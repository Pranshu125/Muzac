import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

import app from './app.js';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`[Muzac Server] Running on http://localhost:${PORT}`);
});

// Keep event loop active in background environments
setInterval(() => {}, 60000);
