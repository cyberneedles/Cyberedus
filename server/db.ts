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

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in the .env file.");
}

export const pool = new Pool({ 
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export const db = drizzle(pool, { schema });

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// --- Database Initialization and Seeding --- //
// Commenting out this function as setup-db.ts now handles initialization
/*
async function initializeDatabase() {
  const client = await pool.connect();
  try {
    console.log("Attempting to initialize database...");

    // Read the SQL from setup-database.sql (moved inside the async function)
    const setupSql = await fs.readFile(join(__dirname, '..', 'setup-database.sql'), 'utf8');
    
    // Run the setup SQL (create tables if not exist) from setup-database.sql
    await client.query(setupSql);
    console.log("Database tables created (if not exist) from setup-database.sql.");

    // Then add the 'what_you_will_learn' column (if it does not exist) to the courses table.
    console.log("Adding 'what_you_will_learn' column to courses table...");
    await client.query("ALTER TABLE courses ADD COLUMN IF NOT EXISTS what_you_will_learn TEXT;");
    
    // Create admin user if not exists
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
    
    console.log("Database initialization completed successfully.");
  } catch (err) {
    console.error("Error during database initialization/seeding:", err);
    throw err; // Re-throw to handle in the calling code
  } finally {
    client.release();
  }
}
*/

// Call the initialization function when the module is loaded
// Commenting out this call as setup-db.ts now handles initialization
/*
initializeDatabase().catch(err => {
  console.error("Unhandled error during database initialization:", err);
  process.exit(1); // Exit if database initialization fails
});
*/
