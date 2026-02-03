# Testing Guide

## Overview
This guide will help you test the Server Manager application to ensure all features work correctly.

## Prerequisites
- Node.js v20 or higher installed
- The application running in development mode (`npm run dev`)

## Test Scenarios

### 1. Application Launch Test
**Objective**: Verify the application starts correctly

**Steps**:
1. Run `npm run dev`
2. Vite dev server should start on port 5173
3. Electron window should open automatically
4. The window should display "Server Manager" in the header
5. Theme switcher (Light/Dark/System) should be visible in the top-right

**Expected Result**: Application launches without errors, showing the main interface

---

### 2. Theme Switching Test
**Objective**: Verify dark/light/system themes work correctly

**Steps**:
1. Click the Sun icon (Light theme)
   - Background should become white
   - Text should become dark
2. Click the Moon icon (Dark theme)
   - Background should become dark blue/slate
   - Text should become light
3. Click the Monitor icon (System theme)
   - Theme should match your system preferences

**Expected Result**: All three theme modes work correctly with proper color contrast

---

### 3. Server Discovery Test
**Objective**: Verify the application can discover servers on the network

**Steps**:
1. Open a separate terminal
2. Start a test server: `node test-server.js "Production Server" 8080`
3. Wait 5-10 seconds
4. The server should appear in the left panel
5. Server should show:
   - Name: "Production Server"
   - IP address
   - Port: 8080
   - Status badge: "online" (green)

**Expected Result**: Server appears in the list with correct information

---

### 4. Multiple Servers Test
**Objective**: Verify multiple servers can be discovered simultaneously

**Steps**:
1. Start multiple test servers in separate terminals:
   ```bash
   node test-server.js "Production Server" 8080
   node test-server.js "Development Server" 3000
   node test-server.js "Staging Server" 5000
   ```
2. Wait 5-10 seconds
3. All three servers should appear in the list

**Expected Result**: All servers are discovered and displayed correctly

---

### 5. Server Selection Test
**Objective**: Verify server detail view works

**Steps**:
1. Ensure at least one test server is running
2. Click on a server card in the left panel
3. The card should highlight with a blue ring
4. The right panel should show:
   - Server name in large text
   - Status badge
   - IP Configuration section
   - Server Information section

**Expected Result**: Server details display correctly when selected

---

### 6. IP Address Update Test
**Objective**: Verify IP address can be edited

**Steps**:
1. Select a server
2. In the IP Configuration section, click "Edit" button
3. Input field should become editable
4. Change IP address to `192.168.1.200`
5. Click "Save Changes"
6. Success message should appear
7. IP should update in the display

**Test Invalid IP**:
1. Click "Edit" again
2. Enter invalid IP like `999.999.999.999`
3. Click "Save Changes"
4. Error message "Invalid IP address format" should appear

**Expected Result**: Valid IPs are saved successfully, invalid IPs show error

---

### 7. Connection Test (Ping)
**Objective**: Verify the ping/connection test feature

**Steps**:
1. Select a server
2. Click "Test Connection" button
3. Button should show "Pinging..." with spinning icon
4. After 1-2 seconds, result should show:
   - Green box with "Connection successful • XXms" if successful
   - Red box with "Connection failed" if failed

**Expected Result**: Ping test executes and shows appropriate result

---

### 8. Refresh Servers Test
**Objective**: Verify manual refresh works

**Steps**:
1. Click the "Refresh" button in the server list header
2. Button should pulse/animate briefly
3. Server list should update

**Expected Result**: Refresh button works and triggers server list update

---

### 9. No Servers State Test
**Objective**: Verify empty state displays correctly

**Steps**:
1. Stop all test servers (Ctrl+C in their terminals)
2. Wait 15-20 seconds for timeout
3. The server list should show:
   - "No Servers Found" message
   - Icon and description text
   - "Scanning network..." with pulsing icon

**Expected Result**: Friendly empty state is displayed

---

### 10. Server Metadata Display Test
**Objective**: Verify additional server information displays

**Steps**:
1. Servers with metadata should show:
   - Version badge (e.g., "v2.1.0")
   - Location badge (e.g., "Development")
2. In detail view, Server Information section should show:
   - Last Seen timestamp
   - Version
   - Location
   - Server ID

**Expected Result**: All metadata displays correctly

---

## Automated Test Script

You can also use this Node.js script to verify server discovery:

```javascript
// test-discovery.js
const dgram = require('dgram');

const socket = dgram.createSocket('udp4');
socket.bind(9876, () => {
  socket.addMembership('239.255.255.250');
  console.log('Listening for server announcements...');
});

socket.on('message', (msg, rinfo) => {
  console.log(`\n[${new Date().toISOString()}]`);
  console.log(`From: ${rinfo.address}:${rinfo.port}`);
  console.log('Message:', msg.toString());
});

setTimeout(() => {
  socket.close();
  console.log('\nTest complete');
  process.exit(0);
}, 30000);
```

Run with: `node test-discovery.js`

---

## Common Issues

### Issue: Electron window doesn't open
**Solution**: Check console for errors. Ensure port 5173 is not in use.

### Issue: Servers not appearing
**Solution**: 
- Ensure test-server.js is running
- Check firewall settings (UDP port 9876 must be open)
- Verify multicast is enabled on your network

### Issue: Theme not switching
**Solution**: Clear localStorage and reload the app

### Issue: IP update not saving
**Solution**: Check browser console for errors, ensure valid IP format

---

## Success Criteria

All features working correctly:
- ✅ Application launches without errors
- ✅ Theme switching works (light/dark/system)
- ✅ Server discovery finds test servers
- ✅ Multiple servers can be displayed
- ✅ Server selection shows details
- ✅ IP address can be edited (valid IPs only)
- ✅ Connection test executes
- ✅ Refresh button updates list
- ✅ Empty state displays correctly
- ✅ Server metadata displays correctly

---

## Development Testing

For developers, use these commands:

```bash
# Run in development mode
npm run dev

# Build the application
npm run build

# Build for Windows
npm run electron:build:win

# Build for macOS
npm run electron:build:mac

# Start test server
node test-server.js "My Server" 8080
```

---

## Network Protocol Testing

To verify the UDP multicast protocol:

1. Start application
2. Use Wireshark or tcpdump to capture UDP traffic on port 9876
3. Filter for multicast address 239.255.255.250
4. You should see:
   - Discovery request messages every 5 seconds
   - Server announcement responses

**Discovery Request Example**:
```json
{
  "type": "discovery-request",
  "timestamp": 1234567890
}
```

**Server Announcement Example**:
```json
{
  "type": "server-announce",
  "serverId": "server-1234567890",
  "name": "Test Server",
  "ip": "192.168.1.100",
  "port": 8080,
  "metadata": {
    "version": "2.1.0",
    "location": "Development"
  }
}
```
