import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import admin from 'firebase-admin';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Database configuration
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/cyberedus';

// Firebase configuration
const FIREBASE_CONFIG = {
  projectId: process.env.FIREBASE_PROJECT_ID || 'cyberedu-a094a',
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

async function setupDatabase() {
  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? {
      rejectUnauthorized: false
    } : false
  });

  try {
    console.log('Connecting to database...');
    const client = await pool.connect();

    try {
      // Read and execute setup SQL
      console.log('Reading setup SQL...');
      const setupSql = await fs.readFile(join(__dirname, 'setup-database.sql'), 'utf8');
      await client.query(setupSql);
      console.log('Database tables created successfully');

      // Create admin user
      const adminEmail = 'admin@cyberedu.com';
      const adminPassword = 'admin123';
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      const { rows: [existingAdmin] } = await client.query(
        'SELECT * FROM users WHERE email = $1 AND role = $2',
        [adminEmail, 'admin']
      );

      if (!existingAdmin) {
        await client.query(
          'INSERT INTO users (email, password, role) VALUES ($1, $2, $3)',
          [adminEmail, hashedPassword, 'admin']
        );
        console.log('Admin user created successfully');
      }

      console.log('Database setup completed successfully');
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error setting up database:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

async function setupFirebase() {
  try {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(FIREBASE_CONFIG)
      });
      console.log('Firebase Admin SDK initialized successfully');
    }
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    throw error;
  }
}

async function main() {
  try {
    await setupDatabase();
    await setupFirebase();
    console.log('All setup completed successfully');
  } catch (error) {
    console.error('Setup failed:', error);
    process.exit(1);
  }
}

main(); 