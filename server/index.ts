import { app } from './api-server';

const port = process.env.PORT || 5001;

// Start server only in development
if (process.env.NODE_ENV === 'development') {
  app.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
    console.log('✅ Database: Neon PostgreSQL (Real database)');
    console.log('✅ Authentication: Firebase (Real auth)');
    console.log('✅ CORS: Configured for credentials support');
    console.log('✅ Health check: http://localhost:5001/health');
    console.log('✅ Frontend: http://localhost:5173');
    console.log('✅ Admin Login: http://localhost:5173/cyberedu-agent');
  });
}
