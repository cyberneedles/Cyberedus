import express from 'express';
import cors from 'cors';
import { setupRoutes } from './routes';
import { DatabaseStorage } from './storage';

const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
  
// Setup routes
setupRoutes(app, new DatabaseStorage());

// Start server
if (process.env.NODE_ENV === 'development') {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
