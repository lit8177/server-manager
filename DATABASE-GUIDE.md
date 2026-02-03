# Database Usage Guide / 数据库使用指南

## English

### Overview
The Server Manager application now includes SQLite database integration for persistent data storage. All server information and history are automatically saved to a local database.

### Database Location
- **macOS**: `~/Library/Application Support/Server Manager/data/servers.db`
- **Windows**: `C:\Users\<username>\AppData\Roaming\Server Manager\data\servers.db`
- **Linux**: `~/.config/Server Manager/data/servers.db`

### Features

#### 1. Automatic Data Persistence
- All discovered servers are automatically saved
- Server information persists across application restarts
- Historical records are maintained permanently

#### 2. Server Management
- **Favorites**: Mark important servers as favorites
- **Notes**: Add custom notes to any server
- **Delete**: Remove servers from the database

#### 3. History Tracking
- Server discovery events
- IP address modifications
- All changes with timestamps

#### 4. Query Capabilities
- View all servers
- Filter by active status (online/offline)
- Filter by favorite status
- View complete server history

### API Reference

#### Get All Servers
```typescript
const servers = await window.electronAPI.getServers();
// Returns array of all servers with status (online/offline)
```

#### Toggle Favorite
```typescript
const result = await window.electronAPI.toggleFavorite('server-id');
// Returns: { success: true, isFavorite: boolean }
```

#### Get Favorite Servers
```typescript
const favorites = await window.electronAPI.getFavoriteServers();
// Returns array of favorite servers only
```

#### Update Server Notes
```typescript
await window.electronAPI.updateServerNotes('server-id', 'My notes here');
// Returns: { success: boolean }
```

#### Get Server History
```typescript
const history = await window.electronAPI.getServerHistory('server-id');
// Returns array of history entries for specific server
```

#### Get All History
```typescript
const allHistory = await window.electronAPI.getAllHistory();
// Returns array of all history entries (last 100)
```

#### Delete Server
```typescript
const result = await window.electronAPI.deleteServer('server-id');
// Returns: { success: boolean }
```

#### Get Database Statistics
```typescript
const stats = await window.electronAPI.getDbStats();
// Returns: {
//   totalServers: number,
//   activeServers: number,
//   favoriteServers: number,
//   totalHistory: number,
//   dbPath: string
// }
```

### Testing Database

Run the test script to verify database functionality:
```bash
node test-database.js
```

This will:
1. Create a test database
2. Insert sample data
3. Test all CRUD operations
4. Verify queries and statistics
5. Display results

---

## 中文

### 概述
Server Manager 应用程序现在集成了 SQLite 数据库，用于持久化数据存储。所有服务器信息和历史记录都会自动保存到本地数据库。

### 数据库位置
- **macOS**: `~/Library/Application Support/Server Manager/data/servers.db`
- **Windows**: `C:\Users\<用户名>\AppData\Roaming\Server Manager\data\servers.db`
- **Linux**: `~/.config/Server Manager/data/servers.db`

### 功能特性

#### 1. 自动数据持久化
- 所有发现的服务器自动保存
- 应用重启后数据自动恢复
- 历史记录永久保存

#### 2. 服务器管理
- **收藏**: 标记重要服务器为收藏
- **备注**: 为任何服务器添加自定义备注
- **删除**: 从数据库中移除服务器

#### 3. 历史追踪
- 服务器发现事件
- IP 地址修改记录
- 所有变更都带有时间戳

#### 4. 查询功能
- 查看所有服务器
- 按活跃状态筛选（在线/离线）
- 按收藏状态筛选
- 查看完整服务器历史

### API 参考

#### 获取所有服务器
```typescript
const servers = await window.electronAPI.getServers();
// 返回所有服务器数组，包含状态（在线/离线）
```

#### 切换收藏状态
```typescript
const result = await window.electronAPI.toggleFavorite('server-id');
// 返回: { success: true, isFavorite: boolean }
```

#### 获取收藏的服务器
```typescript
const favorites = await window.electronAPI.getFavoriteServers();
// 仅返回收藏的服务器数组
```

#### 更新服务器备注
```typescript
await window.electronAPI.updateServerNotes('server-id', '我的备注');
// 返回: { success: boolean }
```

#### 获取服务器历史
```typescript
const history = await window.electronAPI.getServerHistory('server-id');
// 返回指定服务器的历史记录数组
```

#### 获取所有历史
```typescript
const allHistory = await window.electronAPI.getAllHistory();
// 返回所有历史记录数组（最近100条）
```

#### 删除服务器
```typescript
const result = await window.electronAPI.deleteServer('server-id');
// 返回: { success: boolean }
```

#### 获取数据库统计
```typescript
const stats = await window.electronAPI.getDbStats();
// 返回: {
//   totalServers: number,      // 总服务器数
//   activeServers: number,     // 活跃服务器数
//   favoriteServers: number,   // 收藏服务器数
//   totalHistory: number,      // 历史记录总数
//   dbPath: string            // 数据库路径
// }
```

### 测试数据库

运行测试脚本验证数据库功能:
```bash
node test-database.js
```

测试内容:
1. 创建测试数据库
2. 插入示例数据
3. 测试所有 CRUD 操作
4. 验证查询和统计
5. 显示结果

### 数据库架构

#### servers 表
```sql
CREATE TABLE servers (
  id TEXT PRIMARY KEY,           -- 服务器唯一ID
  name TEXT NOT NULL,            -- 服务器名称
  ip TEXT NOT NULL,              -- IP地址
  port INTEGER NOT NULL,         -- 端口号
  version TEXT,                  -- 版本信息
  location TEXT,                 -- 位置信息
  type TEXT,                     -- 服务器类型
  lastSeen INTEGER NOT NULL,     -- 最后活跃时间
  firstDiscovered INTEGER NOT NULL, -- 首次发现时间
  isFavorite INTEGER DEFAULT 0,  -- 是否收藏 (0/1)
  notes TEXT,                    -- 备注信息
  created_at INTEGER,            -- 创建时间
  updated_at INTEGER             -- 更新时间
);
```

#### server_history 表
```sql
CREATE TABLE server_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  serverId TEXT NOT NULL,        -- 关联的服务器ID
  action TEXT NOT NULL,          -- 操作类型
  oldValue TEXT,                 -- 旧值
  newValue TEXT,                 -- 新值
  timestamp INTEGER NOT NULL,    -- 时间戳
  FOREIGN KEY (serverId) REFERENCES servers(id) ON DELETE CASCADE
);
```

### 性能优化
- 使用 WAL 模式提升并发性能
- 索引优化查询速度
- 单例模式避免重复连接

### 注意事项
1. 数据库文件会自动创建
2. 历史记录默认保留30天
3. 删除服务器会级联删除相关历史记录
4. 应用退出时自动关闭数据库连接
