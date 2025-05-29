import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

// Use the correct database where the new columns were added
const DATABASE_URL = "postgresql://postgres.qjqujwxgkqvvzmabcytt:S57%24vq2Xh%26%40BDNa@aws-0-ap-south-1.pooler.supabase.com:6543/postgres";

export const pool = new Pool({ 
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
export const db = drizzle(pool, { schema });
