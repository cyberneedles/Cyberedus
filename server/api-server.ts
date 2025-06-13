import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { DatabaseStorage } from "./storage.js";
import session from "express-session";
import admin from "firebase-admin";

declare module 'express-session' {
  interface SessionData {
    user?: { id: string; email?: string; role: string };
  }
}

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  try {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    
    if (!process.env.FIREBASE_CLIENT_EMAIL || !privateKey || !process.env.FIREBASE_PROJECT_ID) {
      throw new Error("Missing required Firebase environment variables");
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    });
    console.log("Firebase Admin SDK initialized successfully");
  } catch (error) {
    console.error("Error initializing Firebase Admin SDK:", error);
    throw error;
  }
}

export const app = express();

const storage = new DatabaseStorage();

// Enable CORS for frontend
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? [process.env.FRONTEND_URL || 'https://cyberedu.vercel.app', 'https://cyberedu-agent.vercel.app']
    : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5184', 'http://localhost:5185'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.use(express.json({ limit: '100mb' }));

// Session middleware with production-ready configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'cyberedus-secret-key-2024-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  },
  name: 'cyberedu-session'
}));

// Auth middleware
const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
};

// Auth routes
app.post("/auth/login", async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ message: "ID token not provided" });
  }

  try {
    console.log("Verifying Firebase ID token...");
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    console.log("Token verified successfully:", decodedToken.email);

    const firebaseUid = decodedToken.uid;
    const firebaseEmail = decodedToken.email;

    // Create user session
    const user = {
      id: firebaseUid,
      email: firebaseEmail,
      role: 'admin'
    };

    // Set session user
    req.session.user = user;
    console.log("Session created for user:", user.email);

    return res.json({ authenticated: true, user });
  } catch (error) {
    console.error("Firebase token verification error:", error);
    return res.status(401).json({ message: "Invalid or expired ID token" });
  }
});

app.get("/auth/session", (req, res) => {
  if (req.session.user) {
    res.json({ authenticated: true, user: req.session.user });
  } else {
    res.json({ authenticated: false });
  }
});

app.post("/auth/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Logged out successfully" });
  });
});

// Health check endpoint
app.get("/health", async (_req, res) => {
  try {
    // Test database operations
    const courses = await storage.getAllCourses();
    const testimonials = await storage.getAllTestimonials();
    const faqs = await storage.getAllFAQs();
    
    res.json({ 
      status: 'ok',
      database: 'Neon PostgreSQL',
      authentication: 'Firebase',
      reliability: 'Production-ready',
      environment: process.env.NODE_ENV || 'development',
      data: {
        courses: courses.length,
        testimonials: testimonials.length,
        faqs: faqs.length
      },
      message: 'All systems operational - Real databases connected successfully'
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Database health check failed',
      error: String(error)
    });
  }
});

// Course routes
app.get("/courses", async (_req, res) => {
  try {
    const courses = await storage.getAllCourses();
    res.json(courses);
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ message: "Failed to fetch courses", error: String(error) });
  }
});

app.get("/courses/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const course = await storage.getCourseBySlug(slug);
    if (course) {
      res.json(course);
    } else {
      res.status(404).json({ message: "Course not found" });
    }
  } catch (error) {
    console.error('Get course by slug error:', error);
    res.status(500).json({ message: "Failed to fetch course by slug", error: String(error) });
  }
});

app.post("/courses", requireAuth, async (req, res) => {
  try {
    console.log("Creating course with data:", req.body);
    const course = await storage.createCourse({ ...req.body, syllabusUrl: req.body.syllabusUrl });
    console.log("Course created successfully:", course);
    res.status(201).json(course);
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ message: "Failed to create course", error: String(error) });
  }
});

app.patch("/courses/:id", requireAuth, async (req, res) => {
  try {
    const courseId = parseInt(req.params.id);
    const course = await storage.updateCourse(courseId, { ...req.body, syllabusUrl: req.body.syllabusUrl });
    if (course) {
      res.json(course);
    } else {
      res.status(404).json({ message: "Course not found" });
    }
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ message: "Failed to update course", error: String(error) });
  }
});

app.delete("/courses/:id", requireAuth, async (req, res) => {
  try {
    const courseId = parseInt(req.params.id);
    const success = await storage.deleteCourse(courseId);
    if (success) {
      res.json({ message: "Course deleted successfully" });
    } else {
      res.status(404).json({ message: "Course not found" });
    }
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ message: "Failed to delete course", error: String(error) });
  }
});

// Other API routes
app.get("/leads", requireAuth, async (_req, res) => {
  try {
    const leads = await storage.getAllLeads();
    res.json(leads);
  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({ message: "Failed to fetch leads", error: String(error) });
  }
});

app.post("/leads", async (req, res) => {
  try {
    console.log("Creating lead with data:", req.body);
    const lead = await storage.createLead(req.body);
    console.log("Lead created successfully:", lead);
    res.status(201).json(lead);
  } catch (error) {
    console.error('Create lead error:', error);
    res.status(500).json({ message: "Failed to create lead", error: String(error) });
  }
});

app.get("/testimonials", async (_req, res) => {
  try {
    const testimonials = await storage.getAllTestimonials(true);
    res.json(testimonials);
  } catch (error) {
    console.error('Get testimonials error:', error);
    res.status(500).json({ message: "Failed to fetch testimonials", error: String(error) });
  }
});

app.post("/testimonials", async (req, res) => {
  try {
    const testimonial = await storage.createTestimonial(req.body);
    res.status(201).json(testimonial);
  } catch (error) {
    console.error('Create testimonial error:', error);
    res.status(500).json({ message: "Failed to create testimonial", error: String(error) });
  }
});

app.patch("/testimonials/:id", async (req, res) => {
  try {
    const testimonialId = parseInt(req.params.id);
    const testimonial = await storage.updateTestimonial(testimonialId, req.body);
    if (testimonial) {
      res.json(testimonial);
    } else {
      res.status(404).json({ message: "Testimonial not found" });
    }
  } catch (error) {
    console.error('Update testimonial error:', error);
    res.status(500).json({ message: "Failed to update testimonial", error: String(error) });
  }
});

app.delete("/testimonials/:id", async (req, res) => {
  try {
    const testimonialId = parseInt(req.params.id);
    const success = await storage.deleteTestimonial(testimonialId);
    if (success) {
      res.json({ message: "Testimonial deleted successfully" });
    } else {
      res.status(404).json({ message: "Testimonial not found" });
    }
  } catch (error) {
    console.error('Delete testimonial error:', error);
    res.status(500).json({ message: "Failed to delete testimonial", error: String(error) });
  }
});

app.get("/faqs", async (_req, res) => {
  try {
    const faqs = await storage.getAllFAQs(true);
    res.json(faqs);
  } catch (error) {
    console.error('Get FAQs error:', error);
    res.status(500).json({ message: "Failed to fetch FAQs", error: String(error) });
  }
});

app.post("/faqs", requireAuth, async (req, res) => {
  try {
    const faq = await storage.createFAQ(req.body);
    res.status(201).json(faq);
  } catch (error) {
    console.error('Create FAQ error:', error);
    res.status(500).json({ message: "Failed to create FAQ", error: String(error) });
  }
});

app.patch("/faqs/:id", requireAuth, async (req, res) => {
  try {
    const faqId = parseInt(req.params.id);
    const faq = await storage.updateFAQ(faqId, req.body);
    if (faq) {
      res.json(faq);
    } else {
      res.status(404).json({ message: "FAQ not found" });
    }
  } catch (error) {
    console.error('Update FAQ error:', error);
    res.status(500).json({ message: "Failed to update FAQ", error: String(error) });
  }
});

app.delete("/faqs/:id", requireAuth, async (req, res) => {
  try {
    const faqId = parseInt(req.params.id);
    const success = await storage.deleteFAQ(faqId);
    if (success) {
      res.json({ message: "FAQ deleted successfully" });
    } else {
      res.status(404).json({ message: "FAQ not found" });
    }
  } catch (error) {
    console.error('Delete FAQ error:', error);
    res.status(500).json({ message: "Failed to delete FAQ", error: String(error) });
  }
});

app.get("/quizzes/:courseId", async (req, res) => {
  try {
    const courseId = parseInt(req.params.courseId);
    const quiz = await storage.getQuizByCourseId(courseId);
    if (quiz) {
      res.json(quiz);
    } else {
      res.status(404).json({ message: "Quiz not found for this course" });
    }
  } catch (error) {
    console.error('Get quiz error:', error);
    res.status(500).json({ message: "Failed to fetch quiz", error: String(error) });
  }
});

app.post("/quizzes", requireAuth, async (req, res) => {
  try {
    const quiz = await storage.createQuiz(req.body);
    res.status(201).json(quiz);
  } catch (error) {
    console.error('Create quiz error:', error);
    res.status(500).json({ message: "Failed to create quiz", error: String(error) });
  }
});

app.patch("/quizzes/:id", requireAuth, async (req, res) => {
  try {
    const quizId = parseInt(req.params.id);
    const quiz = await storage.updateQuiz(quizId, req.body);
    if (quiz) {
      res.json(quiz);
    } else {
      res.status(404).json({ message: "Quiz not found" });
    }
  } catch (error) {
    console.error('Update quiz error:', error);
    res.status(500).json({ message: "Failed to update quiz", error: String(error) });
  }
});

app.delete("/quizzes/:id", requireAuth, async (req, res) => {
  try {
    const quizId = parseInt(req.params.id);
    const success = await storage.deleteQuiz(quizId);
    if (success) {
      res.json({ message: "Quiz deleted successfully" });
    } else {
      res.status(404).json({ message: "Quiz not found" });
    }
  } catch (error) {
    console.error('Delete quiz error:', error);
    res.status(500).json({ message: "Failed to delete quiz", error: String(error) });
  }
});