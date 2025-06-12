export const config = {
  apiUrl: process.env.NODE_ENV === 'production' 
    ? '/api'  // In production, use relative path
    : 'http://localhost:5001/api', // In development, use local server
  
  firebase: {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
  },
  
  database: {
    url: process.env.DATABASE_URL,
    neonUrl: process.env.NEON_DATABASE_URL
  },
  
  session: {
    secret: process.env.SESSION_SECRET || 'your-secret-key'
  }
}; 