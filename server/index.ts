import express, { type Request, type Response, type NextFunction } from "express";
import { app as apiApp } from "./api-server.js";
import { registerRoutes } from "./routes.js";
import { createServer } from "node:http";
import { log } from "./vite.js";

const app = express();
const PORT = 5001; // Fixed port to match previous working state

// Mount API routes
app.use('/api', apiApp);

// Register other routes (including Vite middleware)
const server = await registerRoutes(app);

// Start the server
server.listen(PORT, () => {
  log(`serving on port ${PORT}`);
});
