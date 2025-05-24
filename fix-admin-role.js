import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
neonConfig.webSocketConstructor = ws;

async function fixAdminRole() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    console.log('🔧 Updating admin user role...');
    
    // Update admin user to have proper role
    const result = await pool.query(
      `UPDATE users SET role = 'admin' WHERE email = 'admin@cyberedus.com' RETURNING id, email, role, name`
    );
    
    if (result.rows.length > 0) {
      console.log('✅ Admin user role updated successfully:');
      console.log('   ID:', result.rows[0].id);
      console.log('   Email:', result.rows[0].email);
      console.log('   Role:', result.rows[0].role);
      console.log('   Name:', result.rows[0].name);
    } else {
      console.log('❌ No admin user found to update');
    }
    
  } catch (error) {
    console.error('❌ Error updating admin role:', error.message);
  } finally {
    await pool.end();
  }
}

fixAdminRole();