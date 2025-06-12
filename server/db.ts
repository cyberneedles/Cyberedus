import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";
import * as bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
const NEON_DATABASE_URL = process.env.NEON_DATABASE_URL;

if (!DATABASE_URL && !NEON_DATABASE_URL) {
  throw new Error("Neither DATABASE_URL nor NEON_DATABASE_URL is set in the environment variables.");
}

// Use NEON_DATABASE_URL in production, fallback to DATABASE_URL
const connectionString = process.env.NODE_ENV === 'production' 
  ? NEON_DATABASE_URL 
  : DATABASE_URL;

export const pool = new Pool({ 
  connectionString,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : undefined
});

export const db = drizzle(pool, { schema });

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// --- Database Initialization and Seeding --- //
async function initializeDatabase() {
  const client = await pool.connect();
  try {
    console.log("Attempting to initialize database...");

    // Read the SQL from setup-database.sql
    const setupSql = await fs.readFile(join(__dirname, '..', 'setup-database.sql'), 'utf8');
    
    // Run the setup SQL (create tables if not exist)
    await client.query(setupSql);
    console.log("Database tables created (if not exist) from setup-database.sql.");

    // Add the 'what_you_will_learn' column if it does not exist
    console.log("Adding 'what_you_will_learn' column to courses table...");
    await client.query("ALTER TABLE courses ADD COLUMN IF NOT EXISTS what_you_will_learn TEXT;");
    
    // Only create admin user in development
    if (process.env.NODE_ENV !== 'production') {
      const adminEmail = "admin@cyberedu.com";
      const adminPassword = "admin123";
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      
      const { rows: [existingAdmin] } = await client.query(
        "SELECT * FROM users WHERE email = $1 AND role = 'admin'",
        [adminEmail]
      );
      
      if (!existingAdmin) {
        await client.query(
          "INSERT INTO users (email, password, role) VALUES ($1, $2, 'admin')",
          [adminEmail, hashedPassword]
        );
        console.log("Admin user created successfully");
      }
    }
    
    console.log("Database initialization completed successfully.");
  } catch (err) {
    console.error("Error during database initialization/seeding:", err);
    throw err;
  } finally {
    client.release();
  }
}

// Call the initialization function when the module is loaded
initializeDatabase().catch(err => {
  console.error("Unhandled error during database initialization:", err);
  process.exit(1);
});
