import { Pool } from 'pg';

async function createTables() {
  const pool = new Pool({ 
    connectionString: 'postgresql://postgres.nnkkbbbbpvmpvmrhovwu:Needle%4010041010@aws-0-ap-south-1.pooler.supabase.com:6543/postgres',
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    console.log('🔧 Creating database tables...');
    
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Create courses table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS courses (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT NOT NULL,
        duration TEXT NOT NULL,
        prerequisites TEXT,
        mode TEXT NOT NULL,
        level TEXT NOT NULL,
        price INTEGER,
        features JSONB DEFAULT '[]',
        syllabus_url TEXT,
        batch_dates JSONB DEFAULT '[]',
        icon TEXT NOT NULL,
        category TEXT NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Create other tables...
    await pool.query(`
      CREATE TABLE IF NOT EXISTS quizzes (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        course_id INTEGER REFERENCES courses(id),
        questions JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS leads (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        course_interest VARCHAR(255),
        source VARCHAR(100) NOT NULL,
        experience VARCHAR(50),
        message TEXT,
        quiz_results JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        category VARCHAR(100) NOT NULL,
        content TEXT NOT NULL,
        excerpt TEXT NOT NULL,
        featured_image TEXT,
        author_id INTEGER,
        is_published BOOLEAN DEFAULT false,
        reading_time INTEGER DEFAULT 5,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        course_id INTEGER REFERENCES courses(id),
        course_name VARCHAR(255) NOT NULL,
        rating INTEGER NOT NULL,
        review TEXT NOT NULL,
        job_title VARCHAR(255),
        company VARCHAR(255),
        image TEXT,
        is_approved BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS faqs (
        id SERIAL PRIMARY KEY,
        category VARCHAR(100) NOT NULL,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        "order" INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true
      );
    `);
    
    console.log('✅ All tables created successfully!');
    
    // Now create admin user
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      ['admin@cyberedus.com']
    );
    
    if (existingUser.rows.length === 0) {
      await pool.query(
        'INSERT INTO users (email, password, role) VALUES ($1, $2, $3)',
        ['admin@cyberedus.com', 'secure_admin_2024', 'admin']
      );
      console.log('👤 Admin user created!');
    } else {
      await pool.query(
        'UPDATE users SET role = $1, password = $2 WHERE email = $3',
        ['admin', 'secure_admin_2024', 'admin@cyberedus.com']
      );
      console.log('👤 Admin user updated!');
    }
    
    console.log('\n🎉 Database setup complete!');
    console.log('📋 Admin Credentials:');
    console.log('   Email: admin@cyberedus.com');
    console.log('   Password: secure_admin_2024');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

createTables();