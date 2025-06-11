import { Pool } from 'pg';

async function printDbInfo() {
  const pool = new Pool({ 
    connectionString: 'postgresql://postgres.nnkkbbbbpvmpvmrhovwu:Needle%4010041010@aws-0-ap-south-1.pooler.supabase.com:6543/postgres',
    ssl: { rejectUnauthorized: false }
  });
  try {
    const dbRes = await pool.query('SELECT current_database() as db');
    const schemaRes = await pool.query('SELECT current_schema() as schema');
    console.log('Current database:', dbRes.rows[0].db);
    console.log('Current schema:', schemaRes.rows[0].schema);
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

printDbInfo(); 