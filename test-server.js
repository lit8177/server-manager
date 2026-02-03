const dgram = require('dgram');
const os = require('os');

// Create UDP socket for broadcasting
const socket = dgram.createSocket({ type: 'udp4', reuseAddr: true });

const MULTICAST_ADDR = '239.255.255.250';
const MULTICAST_PORT = 9876;

// Get local IP address
function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1';
}

const SERVER_INFO = {
  serverId: `server-${Date.now()}`,
  name: process.argv[2] || 'Test Server',
  ip: getLocalIp(),
  port: parseInt(process.argv[3]) || 8080,
  metadata: {
    version: '2.1.0',
    location: 'Development',
    environment: 'test'
  }
};

socket.on('error', (err) => {
  console.error('Socket error:', err);
  socket.close();
});

socket.on('message', (msg, rinfo) => {
  try {
    const data = JSON.parse(msg.toString());
    
    if (data.type === 'discovery-request') {
      console.log(`Received discovery request from ${rinfo.address}:${rinfo.port}`);
      
      // Respond with server announcement
      const announcement = {
        type: 'server-announce',
        ...SERVER_INFO,
        timestamp: Date.now()
      };
      
      const message = JSON.stringify(announcement);
      socket.send(message, 0, message.length, MULTICAST_PORT, MULTICAST_ADDR, (err) => {
        if (err) {
          console.error('Error sending announcement:', err);
        } else {
          console.log('Sent server announcement');
        }
      });
    }
  } catch (error) {
    console.error('Error processing message:', error);
  }
});

socket.bind(MULTICAST_PORT, () => {
  socket.addMembership(MULTICAST_ADDR);
  console.log(`\n🚀 Mock Server Started`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`Name:     ${SERVER_INFO.name}`);
  console.log(`IP:       ${SERVER_INFO.ip}`);
  console.log(`Port:     ${SERVER_INFO.port}`);
  console.log(`ID:       ${SERVER_INFO.serverId}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`Listening on multicast ${MULTICAST_ADDR}:${MULTICAST_PORT}`);
  console.log(`Waiting for discovery requests...\n`);
});

// Send periodic announcements
setInterval(() => {
  const announcement = {
    type: 'server-announce',
    ...SERVER_INFO,
    timestamp: Date.now()
  };
  
  const message = JSON.stringify(announcement);
  socket.send(message, 0, message.length, MULTICAST_PORT, MULTICAST_ADDR);
}, 10000);

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\nShutting down server...');
  socket.close();
  process.exit(0);
});
