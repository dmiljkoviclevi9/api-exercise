const proxyServer = require('./proxyServer');

const { cleanupEntries } = require('./utils');
const apiURL = "http://localhost:3000/default/exercise_api";

(async () => {
  try {
    console.log('Starting cleanup...');
    await cleanupEntries(apiURL);
    console.log('Cleanup completed successfully.');
  } catch (error) {
    console.error('Cleanup failed:', error);
  }

  // Close the server
  proxyServer.close(() => {
    console.log('Proxy server closed.');
  });
})();
