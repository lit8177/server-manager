# Server Manager

A modern desktop application built with Electron, React, and TypeScript for discovering and managing server IP configurations on your network with SQLite database persistence.

## Features

- 🔍 **Automatic Server Discovery** - Discovers servers on your network using UDP multicast
- 💾 **SQLite Database Integration** - Persistent data storage for servers and history
- 🎨 **Modern UI** - Beautiful, responsive interface with dark/light theme support
- 🌍 **IP Management** - View and modify server IP configurations
- ⚡ **Real-time Updates** - Live server status and connection monitoring
- ⭐ **Favorites** - Mark important servers as favorites
- 📜 **History Tracking** - Track all server changes and IP modifications
- 📊 **Statistics** - View database statistics and server analytics
- 🖥️ **Cross-platform** - Works on Windows, macOS, and Linux

## Technology Stack

- **Electron** v34.0.0 - Desktop application framework
- **React** v18.3.1 - UI library
- **TypeScript** v5.7.3 - Type-safe development
- **SQLite** (better-sqlite3 v12.6.2) - Local database for data persistence
- **Tailwind CSS** v3.4.17 - Modern styling with design system
- **Vite** v6.0.7 - Fast build tool

## Getting Started

### Prerequisites

- Node.js v20 or higher
- npm 10 or higher

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Run the application in development mode
npm run dev
```

This will start both the Vite dev server and Electron application.

### Testing Server Discovery

To test the server discovery feature, run the mock server script in a separate terminal:

```bash
# Start a test server
node test-server.js "My Test Server" 8080

# Start multiple test servers
node test-server.js "Production Server" 8080
node test-server.js "Development Server" 3000
```

### Testing Database

```bash
# Run database functionality test
node test-database.js
```

This will create a test database, insert sample data, and verify all operations.

### Building

```bash
# Build for production
npm run build

# Build for Windows
npm run electron:build:win

# Build for macOS
npm run electron:build:mac
```

Built applications will be available in the `release` directory.

## Architecture

### Server Discovery Protocol

The application uses UDP multicast for server discovery:

- **Multicast Address**: `239.255.255.250`
- **Port**: `9876`
- **Discovery Flow**:
  1. Client broadcasts discovery requests every 5 seconds
  2. Servers respond with announcement messages containing their information
  3. Client maintains a list of active servers (15-second timeout)

### Message Format

**Discovery Request**:
```json
{
  "type": "discovery-request",
  "timestamp": 1234567890
}
```

**Server Announcement**:
```json
{
  "type": "server-announce",
  "serverId": "unique-id",
  "name": "Server Name",
  "ip": "192.168.1.100",
  "port": 8080,
  "metadata": {
    "version": "2.1.0",
    "location": "US East"
  }
}
```

## Database

The application includes comprehensive SQLite database integration:

- **Automatic Persistence**: All server data is automatically saved
- **History Tracking**: Records all changes with timestamps
- **Favorites**: Mark and filter important servers
- **Statistics**: View comprehensive database analytics
- **Location**: Database stored in user's application data directory

### Database Schema

**servers** table:
- Server information (id, name, ip, port, version, location, etc.)
- Discovery timestamps (firstDiscovered, lastSeen)
- User preferences (isFavorite, notes)

**server_history** table:
- Historical records of all changes
- Tracks discoveries, IP modifications, and other actions
- Timestamped for audit trails

For detailed database information, see:
- [Database Usage Guide](./DATABASE-GUIDE.md)
- [SQLite Integration Details](./SQLITE-INTEGRATION.md)

## Project Structure

```
├── electron/          # Electron main process
│   ├── main.ts       # Main process with discovery logic
│   ├── database.ts   # SQLite database service (400+ lines)
│   └── preload.ts    # Preload script for IPC
├── src/              # React application
│   ├── components/   # UI components
│   │   ├── ServerList.tsx
│   │   ├── ServerDetail.tsx
│   │   ├── Header.tsx
│   │   └── ui/       # Reusable UI components
│   ├── lib/          # Utilities
│   ├── types/        # TypeScript types
│   └── App.tsx       # Main application
├── test-server.js    # Mock server for testing
├── test-database.js  # Database functionality test
└── package.json      # Project configuration
```

## Design System

The application uses a comprehensive design system with:

- **Typography**: Inter font family (Google Fonts)
- **Color System**: Semantic tokens for consistent theming
- **Components**: Reusable UI components with variants
- **Themes**: Dark and light mode with system preference detection

## Documentation

- [Quick Start Guide](./QUICKSTART.md) - Get started quickly
- [Testing Guide](./TESTING.md) - How to test the application
- [UI Overview](./UI-OVERVIEW.md) - User interface documentation
- [Database Guide](./DATABASE-GUIDE.md) - SQLite database usage
- [SQLite Integration](./SQLITE-INTEGRATION.md) - Database integration details
- [Project Summary](./PROJECT-SUMMARY.md) - Complete project overview

## API Reference

### Frontend API (window.electronAPI)

```typescript
// Get all servers
const servers = await window.electronAPI.getServers();

// Toggle favorite
await window.electronAPI.toggleFavorite(serverId);

// Get favorites
const favorites = await window.electronAPI.getFavoriteServers();

// Update notes
await window.electronAPI.updateServerNotes(serverId, "My notes");

// Get history
const history = await window.electronAPI.getServerHistory(serverId);

// Get statistics
const stats = await window.electronAPI.getDbStats();

// Delete server
await window.electronAPI.deleteServer(serverId);
```

## Code Statistics

- **Total Lines**: ~1,400 TypeScript/TSX
- **Main Process**: 300+ lines (main.ts)
- **Database Module**: 400+ lines (database.ts)
- **UI Components**: 8 React components
- **Test Scripts**: 2 comprehensive test files

## License

MIT

---

**Built with ❤️ using Electron, React, TypeScript, and SQLite**
