import type { Express } from "express";
import { createServer, type Server } from "http";
import express, { type Request, Response, NextFunction } from "express";
import session from 'express-session';
import { pool } from "./db";
import { insertLeadSchema, insertBlogPostSchema, insertTestimonialSchema } from "@shared/schema";
import { z } from "zod";

// Extend session interface to include admin flag
declare module 'express-session' {
  interface SessionData {
    isAdmin?: boolean;
    adminEmail?: string;
  }
}

// Admin authentication middleware
const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  console.log('Auth check - Session ID:', req.sessionID);
  console.log('Auth check - Session data:', req.session);
  
  // Check if admin session exists
  if (!req.session.isAdmin) {
    return res.status(401).json({ error: "Authentication required" });
  }
  
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Completely bypass Vite for API routes - must be first
  app.use('/api', (req, res, next) => {
    res.setHeader('X-API-Route', 'true');
    next();
  });

  // Configure session middleware with proper store
  app.use(session({
    secret: process.env.SESSION_SECRET || 'cyberedus-secret-key-2024',
    resave: true,
    saveUninitialized: true,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'lax'
    },
    name: 'cyberedus.session'
  }));

  // Admin authentication routes - simple credential check
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      console.log('Admin login attempt for:', email);
      
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
      }

      // Simple hardcoded admin authentication for development
      if (email === 'admin@cyberedus.com' && password === 'admin123') {
        // Set session data
        req.session.isAdmin = true;
        req.session.adminEmail = email;
        
        console.log('Admin session created - Session ID:', req.sessionID);
        res.json({ 
          success: true, 
          user: {
            id: 1,
            email: email,
            name: 'admin',
            isAdmin: true
          },
          redirect: '/admin'
        });
      } else {
        console.log('Access denied - Invalid credentials');
        return res.status(401).json({ error: "Invalid credentials" });
      }
    } catch (error) {
      console.error('Admin login error:', error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Admin logout route
  app.post("/api/admin/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destroy error:', err);
        return res.status(500).json({ error: "Could not log out" });
      }
      res.json({ success: true });
    });
  });

  // Admin session check
  app.get("/api/admin/session", (req, res) => {
    console.log('Session check - Session ID:', req.sessionID);
    console.log('Session check - Is Admin:', req.session.isAdmin);
    
    if (req.session.isAdmin) {
      res.json({ 
        authenticated: true,
        user: {
          id: 1,
          email: req.session.adminEmail || 'admin@cyberedus.com',
          name: 'admin',
          isAdmin: true
        }
      });
    } else {
      res.json({ authenticated: false });
    }
  });

  // Test database connection endpoint
  app.get("/api/test-db", async (req, res) => {
    try {
      const result = await pool.query('SELECT NOW()');
      res.json({ success: true, timestamp: result.rows[0].now });
    } catch (error) {
      console.error('Database test error:', error);
      res.status(500).json({ error: "Database connection failed" });
    }
  });

  // Check table schemas
  app.get("/api/debug/schema/:table", async (req, res) => {
    try {
      const { table } = req.params;
      const result = await pool.query(`
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = $1 
        ORDER BY ordinal_position
      `, [table]);
      res.json(result.rows);
    } catch (error) {
      console.error('Schema error:', error);
      res.status(500).json({ error: "Failed to get schema" });
    }
  });

  // Create admin user endpoint
  app.post("/api/debug/create-admin", async (req, res) => {
    try {
      const adminEmail = 'admin@cyberedus.com';
      const adminPassword = 'admin123';
      
      // Check if admin already exists
      const existingResult = await pool.query('SELECT id FROM users WHERE email = $1', [adminEmail]);
      
      if (existingResult.rows.length > 0) {
        // Update existing user to be super admin
        const updateResult = await pool.query(`
          UPDATE users 
          SET is_super_admin = true, password = $2
          WHERE email = $1
          RETURNING id, email, is_super_admin
        `, [adminEmail, adminPassword]);
        
        res.json({ message: 'Admin user updated', user: updateResult.rows[0] });
      } else {
        // Create new admin user
        const insertResult = await pool.query(`
          INSERT INTO users (email, password, is_super_admin, created_at) 
          VALUES ($1, $2, true, NOW()) 
          RETURNING id, email, is_super_admin
        `, [adminEmail, adminPassword]);
        
        res.json({ message: 'Admin user created', user: insertResult.rows[0] });
      }
    } catch (error) {
      console.error('Create admin error:', error);
      res.status(500).json({ error: "Failed to create admin user" });
    }
  });

  // Course routes
  app.get("/api/courses", async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM courses ORDER BY created_at DESC');
      res.json(result.rows);
    } catch (error) {
      console.error('Get courses error:', error);
      res.status(500).json({ error: "Failed to fetch courses" });
    }
  });

  app.get("/api/courses/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const result = await pool.query('SELECT * FROM courses WHERE slug = $1', [slug]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Course not found" });
      }
      
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Get course error:', error);
      res.status(500).json({ error: "Failed to fetch course" });
    }
  });

  app.post("/api/courses", requireAuth, async (req, res) => {
    try {
      const courseData = req.body;
      
      const query = `
        INSERT INTO courses (title, slug, description, duration, level, price, category, icon, overview, main_image, logo, curriculum, batches, fees, career_opportunities, tools_and_technologies, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, NOW())
        RETURNING *
      `;
      
      const values = [
        courseData.title,
        courseData.slug,
        courseData.description,
        courseData.duration || null,
        courseData.level || null,
        courseData.price || null,
        courseData.category || null,
        courseData.icon || null,
        courseData.overview || null,
        courseData.mainImage || null,
        courseData.logo || null,
        courseData.curriculum ? JSON.stringify(courseData.curriculum) : null,
        courseData.batches ? JSON.stringify(courseData.batches) : null,
        courseData.fees ? JSON.stringify(courseData.fees) : null,
        courseData.careerOpportunities ? JSON.stringify(courseData.careerOpportunities) : null,
        courseData.toolsAndTechnologies || null
      ];
      
      const result = await pool.query(query, values);
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Create course error:', error);
      res.status(500).json({ error: "Failed to create course" });
    }
  });

  app.put("/api/courses/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const courseData = req.body;
      
      const query = `
        UPDATE courses 
        SET title = $1, slug = $2, description = $3, duration = $4, level = $5, 
            price = $6, category = $7, icon = $8, overview = $9, main_image = $10, 
            logo = $11, curriculum = $12, batches = $13, fees = $14, 
            career_opportunities = $15, tools_and_technologies = $16
        WHERE id = $17
        RETURNING *
      `;
      
      const values = [
        courseData.title,
        courseData.slug,
        courseData.description,
        courseData.duration,
        courseData.level,
        courseData.price || null,
        courseData.category,
        courseData.icon,
        courseData.overview || null,
        courseData.mainImage || null,
        courseData.logo || null,
        JSON.stringify(courseData.curriculum || []),
        JSON.stringify(courseData.batches || []),
        JSON.stringify(courseData.fees || []),
        JSON.stringify(courseData.careerOpportunities || []),
        courseData.toolsAndTechnologies || null,
        id
      ];
      
      const result = await pool.query(query, values);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Course not found" });
      }
      
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Update course error:', error);
      res.status(500).json({ error: "Failed to update course" });
    }
  });

  app.delete("/api/courses/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      
      const result = await pool.query('DELETE FROM courses WHERE id = $1 RETURNING *', [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Course not found" });
      }
      
      res.json({ success: true, deleted: result.rows[0] });
    } catch (error) {
      console.error('Delete course error:', error);
      res.status(500).json({ error: "Failed to delete course" });
    }
  });

  // Lead routes
  app.post("/api/leads", async (req, res) => {
    try {
      const leadData = insertLeadSchema.parse(req.body);
      
      const query = `
        INSERT INTO leads (name, email, phone, course_interest, message, created_at)
        VALUES ($1, $2, $3, $4, $5, NOW())
        RETURNING *
      `;
      
      const values = [
        leadData.name,
        leadData.email,
        leadData.phone || null,
        leadData.courseInterest || null,
        leadData.message || null
      ];
      
      const result = await pool.query(query, values);
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Create lead error:', error);
      res.status(500).json({ error: "Failed to create lead" });
    }
  });

  app.get("/api/leads", requireAuth, async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM leads ORDER BY created_at DESC');
      res.json(result.rows);
    } catch (error) {
      console.error('Get leads error:', error);
      res.status(500).json({ error: "Failed to fetch leads" });
    }
  });

  // Blog routes
  app.get("/api/blog", async (req, res) => {
    try {
      const { published } = req.query;
      let query = 'SELECT * FROM blog_posts';
      const values: any[] = [];
      
      if (published !== undefined) {
        query += ' WHERE is_published = $1';
        values.push(published === 'true');
      }
      
      query += ' ORDER BY created_at DESC';
      
      const result = await pool.query(query, values);
      res.json(result.rows);
    } catch (error) {
      console.error('Get blog posts error:', error);
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const result = await pool.query('SELECT * FROM blog_posts WHERE slug = $1', [slug]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Get blog post error:', error);
      res.status(500).json({ error: "Failed to fetch blog post" });
    }
  });

  app.post("/api/blog", requireAuth, async (req, res) => {
    try {
      const postData = insertBlogPostSchema.parse(req.body);
      
      const query = `
        INSERT INTO blog_posts (title, slug, content, excerpt, featured_image, is_published, category, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
        RETURNING *
      `;
      
      const values = [
        postData.title,
        postData.slug,
        postData.content,
        postData.excerpt || null,
        postData.featuredImage || null,
        postData.isPublished || false,
        postData.category || 'General'
      ];
      
      const result = await pool.query(query, values);
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Create blog post error:', error);
      res.status(500).json({ error: "Failed to create blog post" });
    }
  });

  // Testimonial routes
  app.get("/api/testimonials", async (req, res) => {
    try {
      const { approved, courseId } = req.query;
      let query = 'SELECT * FROM testimonials';
      const values: any[] = [];
      const conditions: string[] = [];
      
      if (approved !== undefined) {
        conditions.push(`is_approved = $${values.length + 1}`);
        values.push(approved === 'true');
      }
      
      if (courseId !== undefined) {
        conditions.push(`course_id = $${values.length + 1}`);
        values.push(parseInt(courseId as string));
      }
      
      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }
      
      query += ' ORDER BY created_at DESC';
      
      const result = await pool.query(query, values);
      res.json(result.rows);
    } catch (error) {
      console.error('Get testimonials error:', error);
      res.status(500).json({ error: "Failed to fetch testimonials" });
    }
  });

  app.post("/api/testimonials", async (req, res) => {
    try {
      const testimonialData = insertTestimonialSchema.parse(req.body);
      
      const query = `
        INSERT INTO testimonials (name, course_name, review, rating, course_id, is_approved, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW())
        RETURNING *
      `;
      
      const values = [
        testimonialData.name,
        testimonialData.courseName || null,
        testimonialData.review,
        testimonialData.rating || 5,
        testimonialData.courseId || null,
        testimonialData.isApproved || false
      ];
      
      const result = await pool.query(query, values);
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Create testimonial error:', error);
      res.status(500).json({ error: "Failed to create testimonial" });
    }
  });

  // FAQ routes
  app.get("/api/faqs", async (req, res) => {
    try {
      const { active } = req.query;
      let query = 'SELECT * FROM faqs';
      const values: any[] = [];
      
      if (active !== undefined) {
        query += ' WHERE is_active = $1';
        values.push(active === 'true');
      }
      
      query += ' ORDER BY created_at DESC';
      
      const result = await pool.query(query, values);
      res.json(result.rows);
    } catch (error) {
      console.error('Get FAQs error:', error);
      res.status(500).json({ error: "Failed to fetch FAQs" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}