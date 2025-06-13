import express from 'express';
import cors from 'cors';
import { setupRoutes } from './routes';
import { DatabaseStorage } from './storage';

const app = express();
const port = process.env.PORT || 5001;

// CORS configuration for credentials support
app.use(cors({
  origin: 'http://localhost:5173', // Specific origin instead of wildcard
  credentials: true, // Allow credentials
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());

// Initialize real database storage (Neon PostgreSQL + Firebase)
const storage = new DatabaseStorage();

// Setup routes with real database storage
setupRoutes(app, storage);

// Start server only in development
if (process.env.NODE_ENV === 'development') {
  app.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
    console.log('✅ Database: Neon PostgreSQL (Real database)');
    console.log('✅ Authentication: Firebase (Real auth)');
    console.log('✅ CORS: Configured for credentials support');
    console.log('✅ Health check: http://localhost:5001/health');
    console.log('✅ Frontend: http://localhost:5173');
  });
}
