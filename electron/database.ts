import Database from 'better-sqlite3';
import path from 'path';
import { app } from 'electron';
import fs from 'fs';

export interface ServerRecord {
  id: string;
  name: string;
  ip: string;
  port: number;
  version?: string;
  location?: string;
  type?: string;
  lastSeen: number;
  firstDiscovered: number;
  isFavorite: boolean;
  notes?: string;
}

export interface ServerHistory {
  id: number;
  serverId: string;
  action: string; // 'discovered', 'updated', 'connected', 'modified_ip'
  oldValue?: string;
  newValue?: string;
  timestamp: number;
}

class DatabaseService {
  private db: Database.Database | null = null;
  private dbPath: string;

  constructor() {
    const userDataPath = app.getPath('userData');
    const dbDir = path.join(userDataPath, 'data');
    
    // Ensure directory exists
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    
    this.dbPath = path.join(dbDir, 'servers.db');
  }

  initialize() {
    if (this.db) return;

    console.log(`[Database] Initializing database at: ${this.dbPath}`);
    
    this.db = new Database(this.dbPath);
    
    // Enable WAL mode for better concurrent access
    this.db.pragma('journal_mode = WAL');
    
    this.createTables();
    console.log('[Database] Database initialized successfully');
  }

  private createTables() {
    if (!this.db) throw new Error('Database not initialized');

    // Servers table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS servers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        ip TEXT NOT NULL,
        port INTEGER NOT NULL,
        version TEXT,
        location TEXT,
        type TEXT,
        lastSeen INTEGER NOT NULL,
        firstDiscovered INTEGER NOT NULL,
        isFavorite INTEGER DEFAULT 0,
        notes TEXT,
        created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
        updated_at INTEGER DEFAULT (strftime('%s', 'now') * 1000)
      )
    `);

    // Server history table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS server_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        serverId TEXT NOT NULL,
        action TEXT NOT NULL,
        oldValue TEXT,
        newValue TEXT,
        timestamp INTEGER NOT NULL,
        FOREIGN KEY (serverId) REFERENCES servers(id) ON DELETE CASCADE
      )
    `);

    // Create indexes for better query performance
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_servers_lastSeen ON servers(lastSeen);
      CREATE INDEX IF NOT EXISTS idx_servers_isFavorite ON servers(isFavorite);
      CREATE INDEX IF NOT EXISTS idx_history_serverId ON server_history(serverId);
      CREATE INDEX IF NOT EXISTS idx_history_timestamp ON server_history(timestamp);
    `);

    console.log('[Database] Tables created successfully');
  }

  // Server CRUD operations

  upsertServer(server: Omit<ServerRecord, 'firstDiscovered'>): ServerRecord {
    if (!this.db) throw new Error('Database not initialized');

    const existing = this.getServerById(server.id);
    const now = Date.now();

    if (existing) {
      // Update existing server
      const stmt = this.db.prepare(`
        UPDATE servers 
        SET name = ?, ip = ?, port = ?, version = ?, location = ?, 
            type = ?, lastSeen = ?, notes = ?, updated_at = ?
        WHERE id = ?
      `);

      stmt.run(
        server.name,
        server.ip,
        server.port,
        server.version || null,
        server.location || null,
        server.type || null,
        server.lastSeen,
        server.notes || existing.notes || null,
        now,
        server.id
      );

      // Log history if IP changed
      if (existing.ip !== server.ip) {
        this.addHistory({
          serverId: server.id,
          action: 'modified_ip',
          oldValue: existing.ip,
          newValue: server.ip,
          timestamp: now
        });
      }

      return { ...server, firstDiscovered: existing.firstDiscovered, isFavorite: existing.isFavorite };
    } else {
      // Insert new server
      const stmt = this.db.prepare(`
        INSERT INTO servers (id, name, ip, port, version, location, type, lastSeen, firstDiscovered, isFavorite, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      stmt.run(
        server.id,
        server.name,
        server.ip,
        server.port,
        server.version || null,
        server.location || null,
        server.type || null,
        server.lastSeen,
        now,
        server.isFavorite ? 1 : 0,
        server.notes || null
      );

      this.addHistory({
        serverId: server.id,
        action: 'discovered',
        newValue: server.ip,
        timestamp: now
      });

      return { ...server, firstDiscovered: now };
    }
  }

  getServerById(id: string): ServerRecord | null {
    if (!this.db) throw new Error('Database not initialized');

    const stmt = this.db.prepare('SELECT * FROM servers WHERE id = ?');
    const row = stmt.get(id) as any;

    if (!row) return null;

    return this.mapRowToServer(row);
  }

  getAllServers(): ServerRecord[] {
    if (!this.db) throw new Error('Database not initialized');

    const stmt = this.db.prepare('SELECT * FROM servers ORDER BY lastSeen DESC');
    const rows = stmt.all() as any[];

    return rows.map(row => this.mapRowToServer(row));
  }

  getActiveServers(timeoutMs: number = 15000): ServerRecord[] {
    if (!this.db) throw new Error('Database not initialized');

    const cutoff = Date.now() - timeoutMs;
    const stmt = this.db.prepare('SELECT * FROM servers WHERE lastSeen > ? ORDER BY lastSeen DESC');
    const rows = stmt.all(cutoff) as any[];

    return rows.map(row => this.mapRowToServer(row));
  }

  getFavoriteServers(): ServerRecord[] {
    if (!this.db) throw new Error('Database not initialized');

    const stmt = this.db.prepare('SELECT * FROM servers WHERE isFavorite = 1 ORDER BY lastSeen DESC');
    const rows = stmt.all() as any[];

    return rows.map(row => this.mapRowToServer(row));
  }

  updateServerIP(id: string, newIP: string): boolean {
    if (!this.db) throw new Error('Database not initialized');

    const existing = this.getServerById(id);
    if (!existing) return false;

    const stmt = this.db.prepare('UPDATE servers SET ip = ?, updated_at = ? WHERE id = ?');
    const now = Date.now();
    stmt.run(newIP, now, id);

    this.addHistory({
      serverId: id,
      action: 'modified_ip',
      oldValue: existing.ip,
      newValue: newIP,
      timestamp: now
    });

    return true;
  }

  toggleFavorite(id: string): boolean {
    if (!this.db) throw new Error('Database not initialized');

    const server = this.getServerById(id);
    if (!server) return false;

    const newState = !server.isFavorite;
    const stmt = this.db.prepare('UPDATE servers SET isFavorite = ?, updated_at = ? WHERE id = ?');
    stmt.run(newState ? 1 : 0, Date.now(), id);

    return newState;
  }

  updateServerNotes(id: string, notes: string): boolean {
    if (!this.db) throw new Error('Database not initialized');

    const stmt = this.db.prepare('UPDATE servers SET notes = ?, updated_at = ? WHERE id = ?');
    stmt.run(notes, Date.now(), id);

    return true;
  }

  deleteServer(id: string): boolean {
    if (!this.db) throw new Error('Database not initialized');

    const stmt = this.db.prepare('DELETE FROM servers WHERE id = ?');
    const result = stmt.run(id);

    return result.changes > 0;
  }

  // History operations

  addHistory(entry: Omit<ServerHistory, 'id'>): number {
    if (!this.db) throw new Error('Database not initialized');

    const stmt = this.db.prepare(`
      INSERT INTO server_history (serverId, action, oldValue, newValue, timestamp)
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      entry.serverId,
      entry.action,
      entry.oldValue || null,
      entry.newValue || null,
      entry.timestamp
    );

    return result.lastInsertRowid as number;
  }

  getServerHistory(serverId: string, limit: number = 50): ServerHistory[] {
    if (!this.db) throw new Error('Database not initialized');

    const stmt = this.db.prepare(`
      SELECT * FROM server_history 
      WHERE serverId = ? 
      ORDER BY timestamp DESC 
      LIMIT ?
    `);

    const rows = stmt.all(serverId, limit) as any[];

    return rows.map(row => ({
      id: row.id,
      serverId: row.serverId,
      action: row.action,
      oldValue: row.oldValue,
      newValue: row.newValue,
      timestamp: row.timestamp
    }));
  }

  getAllHistory(limit: number = 100): ServerHistory[] {
    if (!this.db) throw new Error('Database not initialized');

    const stmt = this.db.prepare(`
      SELECT * FROM server_history 
      ORDER BY timestamp DESC 
      LIMIT ?
    `);

    const rows = stmt.all(limit) as any[];

    return rows.map(row => ({
      id: row.id,
      serverId: row.serverId,
      action: row.action,
      oldValue: row.oldValue,
      newValue: row.newValue,
      timestamp: row.timestamp
    }));
  }

  clearOldHistory(daysToKeep: number = 30): number {
    if (!this.db) throw new Error('Database not initialized');

    const cutoff = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000);
    const stmt = this.db.prepare('DELETE FROM server_history WHERE timestamp < ?');
    const result = stmt.run(cutoff);

    return result.changes;
  }

  // Utility methods

  private mapRowToServer(row: any): ServerRecord {
    return {
      id: row.id,
      name: row.name,
      ip: row.ip,
      port: row.port,
      version: row.version,
      location: row.location,
      type: row.type,
      lastSeen: row.lastSeen,
      firstDiscovered: row.firstDiscovered,
      isFavorite: Boolean(row.isFavorite),
      notes: row.notes
    };
  }

  getStats() {
    if (!this.db) throw new Error('Database not initialized');

    const totalServers = this.db.prepare('SELECT COUNT(*) as count FROM servers').get() as any;
    const activeServers = this.db.prepare(
      'SELECT COUNT(*) as count FROM servers WHERE lastSeen > ?'
    ).get(Date.now() - 15000) as any;
    const favoriteServers = this.db.prepare(
      'SELECT COUNT(*) as count FROM servers WHERE isFavorite = 1'
    ).get() as any;
    const totalHistory = this.db.prepare('SELECT COUNT(*) as count FROM server_history').get() as any;

    return {
      totalServers: totalServers.count,
      activeServers: activeServers.count,
      favoriteServers: favoriteServers.count,
      totalHistory: totalHistory.count,
      dbPath: this.dbPath
    };
  }

  close() {
    if (this.db) {
      console.log('[Database] Closing database connection');
      this.db.close();
      this.db = null;
    }
  }
}

// Singleton instance
let dbInstance: DatabaseService | null = null;

export function getDatabase(): DatabaseService {
  if (!dbInstance) {
    dbInstance = new DatabaseService();
    dbInstance.initialize();
  }
  return dbInstance;
}

export function closeDatabase() {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }
}
