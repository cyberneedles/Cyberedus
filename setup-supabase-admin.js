import { Pool } from 'pg';

async function setupSupabaseAdmin() {
  const connectionString = "postgresql://postgres.nnkkbbbbpvmpvmrhovwu:Needle%4010041010@aws-0-ap-south-1.pooler.supabase.com:6543/postgres";
  
  const pool = new Pool({ 
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🔗 Connecting to Supabase...');
    
    // Create tables first
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('✅ Users table ready');
    
    // Check if admin user exists
    const existingAdmin = await pool.query(
      'SELECT id FROM users WHERE email = $1 AND role = $2',
      ['admin@cyberedus.com', 'admin']
    );
    
    if (existingAdmin.rows.length > 0) {
      console.log('👤 Admin user already exists');
    } else {
      // Create admin user
      await pool.query(
        'INSERT INTO users (email, password, role) VALUES ($1, $2, $3)',
        ['admin@cyberedus.com', 'secure_admin_2024', 'admin']
      );
      console.log('🎉 Admin user created successfully!');
    }
    
    console.log('\n📋 Admin Login Credentials:');
    console.log('   Email: admin@cyberedus.com');
    console.log('   Password: secure_admin_2024');
    console.log('\n🚀 Your database authentication is now ready!');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  } finally {
    await pool.end();
  }
}

setupSupabaseAdmin();