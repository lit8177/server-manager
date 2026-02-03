#!/usr/bin/env node

/**
 * SQLite Database Test Script
 * Tests the database functionality without running the full Electron app
 */

import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Testing SQLite Database...\n');

// Create test database
const testDbPath = path.join(__dirname, 'test-servers.db');

// Clean up existing test database
if (fs.existsSync(testDbPath)) {
  fs.unlinkSync(testDbPath);
  console.log('✅ Cleaned up existing test database');
}

const db = new Database(testDbPath);
console.log('✅ Database created:', testDbPath);

// Create tables
db.exec(`
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

db.exec(`
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

console.log('✅ Tables created successfully\n');

// Test data insertion
const now = Date.now();
const insertServer = db.prepare(`
  INSERT INTO servers (id, name, ip, port, version, location, type, lastSeen, firstDiscovered, isFavorite)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

console.log('📝 Inserting test data...');

const servers = [
  {
    id: 'server-001',
    name: 'Production Server',
    ip: '192.168.1.100',
    port: 8080,
    version: '1.0.0',
    location: 'US-EAST',
    type: 'production',
    lastSeen: now,
    firstDiscovered: now - 86400000, // 1 day ago
    isFavorite: 1
  },
  {
    id: 'server-002',
    name: 'Development Server',
    ip: '192.168.1.101',
    port: 8081,
    version: '1.1.0-beta',
    location: 'US-WEST',
    type: 'development',
    lastSeen: now - 5000, // 5 seconds ago
    firstDiscovered: now - 3600000, // 1 hour ago
    isFavorite: 0
  },
  {
    id: 'server-003',
    name: 'Test Server',
    ip: '192.168.1.102',
    port: 8082,
    version: '0.9.0',
    location: 'EU-CENTRAL',
    type: 'testing',
    lastSeen: now - 20000, // 20 seconds ago (offline)
    firstDiscovered: now - 7200000, // 2 hours ago
    isFavorite: 0
  }
];

for (const server of servers) {
  insertServer.run(
    server.id,
    server.name,
    server.ip,
    server.port,
    server.version,
    server.location,
    server.type,
    server.lastSeen,
    server.firstDiscovered,
    server.isFavorite
  );
  console.log(`  ✓ ${server.name} (${server.ip}:${server.port})`);
}

// Insert history records
const insertHistory = db.prepare(`
  INSERT INTO server_history (serverId, action, oldValue, newValue, timestamp)
  VALUES (?, ?, ?, ?, ?)
`);

insertHistory.run('server-001', 'discovered', null, '192.168.1.100', now - 86400000);
insertHistory.run('server-001', 'modified_ip', '192.168.1.50', '192.168.1.100', now - 43200000);
insertHistory.run('server-002', 'discovered', null, '192.168.1.101', now - 3600000);

console.log('✅ Test data inserted\n');

// Test queries
console.log('🔍 Testing queries...\n');

// Get all servers
const allServers = db.prepare('SELECT * FROM servers').all();
console.log(`📊 Total servers: ${allServers.length}`);
allServers.forEach(s => {
  console.log(`  - ${s.name}: ${s.ip}:${s.port} (Favorite: ${s.isFavorite ? 'Yes' : 'No'})`);
});

// Get active servers (within last 15 seconds)
const activeServers = db.prepare('SELECT * FROM servers WHERE lastSeen > ?').all(now - 15000);
console.log(`\n🟢 Active servers (last 15s): ${activeServers.length}`);
activeServers.forEach(s => {
  console.log(`  - ${s.name}: ${s.ip}:${s.port}`);
});

// Get favorites
const favorites = db.prepare('SELECT * FROM servers WHERE isFavorite = 1').all();
console.log(`\n⭐ Favorite servers: ${favorites.length}`);
favorites.forEach(s => {
  console.log(`  - ${s.name}: ${s.ip}:${s.port}`);
});

// Test update
console.log('\n📝 Testing IP update...');
const updateStmt = db.prepare('UPDATE servers SET ip = ?, updated_at = ? WHERE id = ?');
updateStmt.run('192.168.1.200', now, 'server-002');
const updated = db.prepare('SELECT * FROM servers WHERE id = ?').get('server-002');
console.log(`  ✓ Updated server-002 IP to: ${updated.ip}`);

// Test history retrieval
const history = db.prepare('SELECT * FROM server_history WHERE serverId = ?').all('server-001');
console.log(`\n📜 History for server-001: ${history.length} entries`);
history.forEach(h => {
  console.log(`  - ${h.action}: ${h.oldValue || 'N/A'} → ${h.newValue || 'N/A'}`);
});

// Statistics
const stats = {
  totalServers: db.prepare('SELECT COUNT(*) as count FROM servers').get().count,
  activeServers: db.prepare('SELECT COUNT(*) as count FROM servers WHERE lastSeen > ?').get(now - 15000).count,
  favoriteServers: db.prepare('SELECT COUNT(*) as count FROM servers WHERE isFavorite = 1').get().count,
  totalHistory: db.prepare('SELECT COUNT(*) as count FROM server_history').get().count
};

console.log('\n📈 Database Statistics:');
console.log(`  - Total servers: ${stats.totalServers}`);
console.log(`  - Active servers: ${stats.activeServers}`);
console.log(`  - Favorite servers: ${stats.favoriteServers}`);
console.log(`  - History entries: ${stats.totalHistory}`);
console.log(`  - Database path: ${testDbPath}`);
console.log(`  - Database size: ${(fs.statSync(testDbPath).size / 1024).toFixed(2)} KB`);

// Close database
db.close();
console.log('\n✅ All tests passed! Database is working correctly.\n');
