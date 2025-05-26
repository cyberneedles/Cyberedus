import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import { storage } from "./storage";
import { pool } from "./db";
import { insertLeadSchema, insertBlogPostSchema, insertTestimonialSchema } from "@shared/schema";
import { z } from "zod";

// Admin authentication middleware
const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session?.user) {
    return res.status(401).json({ error: "Authentication required" });
  }
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Completely bypass Vite for API routes - must be first
  app.use('/api', (req, res, next) => {
    // Prevent any caching or middleware interference
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('X-API-Route', 'true');
    next();
  });

  // Configure session middleware
  app.use(session({
    secret: process.env.SESSION_SECRET || 'cyberedus-secret-key-2024',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Admin authentication routes
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      // Direct database authentication (bypassing Drizzle for now)
      console.log('Login attempt for email:', email);
      
      // Direct query to database
      const directResult = await pool.query(
        'SELECT id, email, role FROM users WHERE email = $1 AND password = $2',
        [email, password]
      );
      
      console.log('Direct query result:', directResult.rows);
      
      if (directResult.rows.length === 0 || directResult.rows[0].role !== 'admin') {
        console.log('Access denied - Invalid credentials or not admin');
        return res.status(401).json({ error: "Access denied" });
      }
      
      const adminUser = directResult.rows[0];

      // Set session
      req.session.user = {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.email.split('@')[0], // Use email prefix as name
        isAdmin: true
      };
      
      // Save session and send response
      req.session.save((err) => {
        if (err) {
          console.error('Session save error:', err);
          return res.status(500).json({ error: "Session error" });
        }
        
        res.json({ 
          success: true, 
          user: {
            id: adminUser.id,
            email: adminUser.email,
            name: adminUser.email.split('@')[0],
            isAdmin: true
          }
        });
      });
    } catch (error) {
      console.error('Admin login error:', error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/admin/logout", (req, res) => {
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ error: "Could not log out" });
        }
        res.json({ success: true });
      });
    } else {
      res.json({ success: true });
    }
  });

  app.get("/api/admin/session", (req, res) => {
    if (req.session?.user?.isAdmin) {
      res.json({ 
        authenticated: true, 
        user: req.session.user 
      });
    } else {
      res.json({ authenticated: false });
    }
  });

  // Courses API
  app.get("/api/courses", async (req, res) => {
    try {
      const courses = await storage.getAllCourses();
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });

  app.post("/api/courses", async (req, res) => {
    console.log("POST /api/courses hit!");
    console.log("Request body:", req.body);
    
    // Mark as handled to prevent Vite interference
    res.locals.apiHandled = true;
    
    try {
      const courseData = req.body;
      console.log("About to create course with data:", courseData);
      
      const course = await storage.createCourse(courseData);
      console.log("Course created successfully:", course);
      
      // Send response and end immediately
      return res.status(201).json(course);
    } catch (error) {
      console.error('Create course error:', error);
      return res.status(500).json({ message: "Failed to create course", error: String(error) });
    }
  });

  app.patch("/api/courses/:id", async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      const courseData = req.body;
      const course = await storage.updateCourse(courseId, courseData);
      
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      res.json(course);
    } catch (error) {
      console.error('Update course error:', error);
      res.status(500).json({ message: "Failed to update course" });
    }
  });

  app.delete("/api/courses/:id", requireAuth, async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      const success = await storage.deleteCourse(courseId);
      
      if (!success) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      res.json({ success: true, message: "Course deleted successfully" });
    } catch (error) {
      console.error('Delete course error:', error);
      res.status(500).json({ message: "Failed to delete course" });
    }
  });

  app.get("/api/courses/:slug", async (req, res) => {
    try {
      const course = await storage.getCourseBySlug(req.params.slug);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.json(course);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch course" });
    }
  });

  // Quiz API
  app.get("/api/courses/:id/quiz", async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      const quiz = await storage.getQuizByCourseId(courseId);
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }
      res.json(quiz);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch quiz" });
    }
  });

  // Lead generation API
  const leadFormSchema = insertLeadSchema.extend({
    quizResults: z.object({
      score: z.number(),
      totalQuestions: z.number(),
      answers: z.array(z.number()),
    }).optional(),
  });

  app.post("/api/leads", async (req, res) => {
    try {
      const validatedData = leadFormSchema.parse(req.body);
      const lead = await storage.createLead(validatedData);
      
      // Here you would integrate with Google Sheets API
      // For now, we'll just log the lead
      console.log("New lead generated:", lead);
      
      res.json({ message: "Lead captured successfully", id: lead.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid form data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to capture lead" });
    }
  });

  app.get("/api/leads", async (req, res) => {
    try {
      const leads = await storage.getAllLeads();
      res.json(leads);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch leads" });
    }
  });

  // Blog API
  app.get("/api/blog", async (req, res) => {
    try {
      const published = req.query.published === "true";
      const posts = await storage.getAllBlogPosts(published);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog/:slug", async (req, res) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  app.post("/api/blog", async (req, res) => {
    try {
      const validatedData = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(validatedData);
      res.json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid blog post data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create blog post" });
    }
  });

  app.put("/api/blog/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertBlogPostSchema.partial().parse(req.body);
      const post = await storage.updateBlogPost(id, validatedData);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid blog post data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update blog post" });
    }
  });

  app.delete("/api/blog/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteBlogPost(id);
      if (!deleted) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json({ message: "Blog post deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete blog post" });
    }
  });

  // Testimonials API
  app.get("/api/testimonials", async (req, res) => {
    try {
      const approved = req.query.approved === "true";
      const courseId = req.query.courseId ? parseInt(req.query.courseId as string) : undefined;
      
      let testimonials;
      if (courseId) {
        testimonials = await storage.getTestimonialsByCourse(courseId);
      } else {
        testimonials = await storage.getAllTestimonials(approved);
      }
      
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });

  app.post("/api/testimonials", async (req, res) => {
    try {
      const validatedData = insertTestimonialSchema.parse(req.body);
      const testimonial = await storage.createTestimonial(validatedData);
      res.json(testimonial);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid testimonial data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create testimonial" });
    }
  });

  // FAQs API
  app.get("/api/faqs", async (req, res) => {
    try {
      const active = req.query.active === "true";
      const faqs = await storage.getAllFAQs(active);
      res.json(faqs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch FAQs" });
    }
  });

  // Authentication API (simplified)
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await storage.getUserByEmail(email);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // In a real app, you'd generate a JWT token here
      res.json({ 
        message: "Login successful", 
        user: { id: user.id, email: user.email, role: user.role } 
      });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Contact form (special lead endpoint)
  app.post("/api/contact", async (req, res) => {
    try {
      const contactData = {
        ...req.body,
        source: "contact_form",
      };
      const validatedData = insertLeadSchema.parse(contactData);
      const lead = await storage.createLead(validatedData);
      
      console.log("Contact form submission:", lead);
      
      res.json({ message: "Message sent successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid form data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
