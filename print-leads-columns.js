import { Pool } from 'pg';

async function printLeadsColumns() {
  const pool = new Pool({ 
    connectionString: 'postgresql://postgres.nnkkbbbbpvmpvmrhovwu:Needle%4010041010@aws-0-ap-south-1.pooler.supabase.com:6543/postgres',
    ssl: { rejectUnauthorized: false }
  });
  try {
    const res = await pool.query(`SELECT column_name FROM information_schema.columns WHERE table_name = 'leads' ORDER BY ordinal_position;`);
    console.log('Columns in leads table:');
    res.rows.forEach(row => console.log(' -', row.column_name));
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

printLeadsColumns(); 