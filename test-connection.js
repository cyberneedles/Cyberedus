import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('✓ Successfully connected to Supabase!');
    
    // Test query
    const result = await client.query('SELECT version()');
    console.log('✓ Database version:', result.rows[0].version);
    
    client.release();
    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error('✗ Connection failed:', err.message);
    process.exit(1);
  }
}

testConnection();