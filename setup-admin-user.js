const { Pool, neonConfig } = require('@neondatabase/serverless');
const ws = require('ws');

neonConfig.webSocketConstructor = ws;

async function setupAdminUser() {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is required');
    process.exit(1);
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();

  try {
    console.log('🔗 Connected to Supabase database');

    // Create admin user for dashboard access
    const result = await client.query(`
      INSERT INTO users (email, password, role) 
      VALUES ($1, $2, $3)
      ON CONFLICT (email) 
      DO UPDATE SET 
        password = EXCLUDED.password,
        role = EXCLUDED.role
      RETURNING id, email, role;
    `, ['admin@cyberedus.com', 'secure_admin_2024', 'admin']);

    if (result.rows.length > 0) {
      console.log('✅ Admin user created/updated successfully');
      console.log('📧 Email: admin@cyberedus.com');
      console.log('🔑 Password: secure_admin_2024');
      console.log('🛡️  Role: admin');
    }

    console.log('🎉 Admin setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Admin setup failed:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

if (require.main === module) {
  setupAdminUser().catch(console.error);
}

module.exports = { setupAdminUser };