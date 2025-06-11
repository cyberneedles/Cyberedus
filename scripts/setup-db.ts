import { Client } from "pg";
import * as bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import { promises as fs } from 'fs'; // Import fs.promises for async file operations
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config(); // Load environment variables from .env file

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in the .env file.");
}

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function setupDatabase(clearCourses: boolean = false) {
  const client = new Client({
    connectionString: DATABASE_URL,
  });

  try {
    await client.connect();
    console.log("Connected to PostgreSQL database.");

    // Execute the full setup-database.sql first to ensure all tables and columns are up-to-date
    console.log("Applying schema from setup-database.sql...");
    const setupSql = await fs.readFile(join(__dirname, '..', 'setup-database.sql'), 'utf8');
    await client.query(setupSql);
    console.log("Database schema applied from setup-database.sql.");

    if (clearCourses) {
      console.log("Clearing existing courses data...");
      await client.query("TRUNCATE TABLE courses RESTART IDENTITY CASCADE;");
      console.log("Courses table cleared.");
    }

    // 2. Seed/Update admin user
    const adminEmail = "admin@cyberedu.com";
    const adminPassword = "admin123";
    const hashedPassword = await bcrypt.hash(adminPassword, 10); // Hash password with salt rounds = 10

    const checkAdminQuery = `SELECT id FROM users WHERE email = $1;`;
    const adminExists = (await client.query(checkAdminQuery, [adminEmail])).rows.length > 0;

    if (!adminExists) {
      console.log(`Inserting admin user: ${adminEmail} into database...`);
      const insertAdminQuery = `
        INSERT INTO users (email, password, role, created_at)
        VALUES ($1, $2, $3, NOW())
        ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password, role = EXCLUDED.role;
      `;
      await client.query(insertAdminQuery, [adminEmail, hashedPassword, "admin"]);
      console.log("Admin user inserted successfully.");
    } else {
      console.log(`Admin user: ${adminEmail} already exists. Updating password if changed...`);
      const updateAdminQuery = `
        UPDATE users
        SET password = $1, role = $2, created_at = NOW()
        WHERE email = $3;
      `;
      await client.query(updateAdminQuery, [hashedPassword, "admin", adminEmail]);
      console.log("Admin user updated successfully.");
    }

    console.log("Database setup and admin user seeding complete.");
  } catch (error) {
    console.error("Error during database setup:", error);
    process.exit(1);
  } finally {
    await client.end();
    console.log("Disconnected from PostgreSQL database.");
  }
}

setupDatabase(true); // Call with true to clear courses table 