import { exec } from 'child_process';

// Start the API server on port 3001
const apiServer = exec('npx tsx server/api-server.ts', (error, stdout, stderr) => {
  if (error) {
    console.error('API Server error:', error);
    return;
  }
  if (stderr) {
    console.error('API Server stderr:', stderr);
  }
  console.log('API Server stdout:', stdout);
});

apiServer.stdout.on('data', (data) => {
  console.log(`API Server: ${data}`);
});

apiServer.stderr.on('data', (data) => {
  console.error(`API Server Error: ${data}`);
});

console.log('Starting API server on port 3001...');