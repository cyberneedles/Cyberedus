import express, { type Request, type Response, type NextFunction } from "express";
import { app as apiApp } from "./api-server.js";
import { registerRoutes } from "./routes.js";
import { createServer } from "node:http";
import { log } from "./vite.js";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// Mount API routes
app.use('/api', apiApp);

// In production, serve static files
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist/public')));
  
  // Handle SPA routing
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/public/index.html'));
  });
}

// Register other routes (including Vite middleware)
const server = await registerRoutes(app);

// Start the server
server.listen(PORT, () => {
  log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
