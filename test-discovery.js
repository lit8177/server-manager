// Quick test script to verify discovery protocol
const dgram = require('dgram');

const socket = dgram.createSocket('udp4');
let messageCount = 0;

socket.bind(9876, () => {
  socket.addMembership('239.255.255.250');
  console.log('✓ Listening for server announcements on 239.255.255.250:9876');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
});

socket.on('message', (msg, rinfo) => {
  try {
    messageCount++;
    const data = JSON.parse(msg.toString());
    console.log(`[Message ${messageCount}] ${new Date().toLocaleTimeString()}`);
    console.log(`Source: ${rinfo.address}:${rinfo.port}`);
    console.log(`Type: ${data.type}`);
    if (data.type === 'server-announce') {
      console.log(`Server: ${data.name} (${data.ip}:${data.port})`);
      if (data.metadata) {
        console.log(`Metadata:`, data.metadata);
      }
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  } catch (error) {
    console.error('Error parsing message:', error);
  }
});

socket.on('error', (err) => {
  console.error('Socket error:', err);
  socket.close();
  process.exit(1);
});

// Run for 30 seconds
setTimeout(() => {
  console.log(`\n✓ Test complete. Received ${messageCount} messages.`);
  socket.close();
  process.exit(0);
}, 30000);

console.log('Running test for 30 seconds...\n');
