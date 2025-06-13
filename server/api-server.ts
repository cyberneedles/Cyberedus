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
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: "cyberedu-a094a",
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
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
    ? [process.env.FRONTEND_URL || 'https://your-production-domain.com']
    : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5184', 'http://localhost:5185'],
  credentials: true
}));

app.use(express.json({ limit: '100mb' }));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'cyberedus-secret-key-2024',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
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

// Course routes
app.get("/courses", async (_req, res) => {
  try {
    const courses = await storage.getAllCourses();
    res.json(courses);
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ message: "Failed to fetch courses" });
  }
});

app.get("/courses/:slug", async (req, res) => {
  try {
    const { slug } = req.params; // Extract the slug from the URL parameters
    const course = await storage.getCourseBySlug(slug);
    if (course) {
      res.json(course);
    } else {
      res.status(404).json({ message: "Course not found" });
    }
  } catch (error) {
    console.error('Get course by slug error:', error);
    res.status(500).json({ message: "Failed to fetch course by slug" });
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
    res.status(500).json({ message: "Failed to update course" });
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
    res.status(500).json({ message: "Failed to delete course" });
  }
});

// Other API routes
app.get("/leads", requireAuth, async (_req, res) => {
  try {
    const leads = await storage.getAllLeads();
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch leads" });
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
    res.status(500).json({ message: "Failed to fetch testimonials" });
  }
});

app.post("/testimonials", async (req, res) => {
  try {
    const testimonial = await storage.createTestimonial(req.body);
    res.status(201).json(testimonial);
  } catch (error) {
    res.status(500).json({ message: "Failed to create testimonial" });
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
    res.status(500).json({ message: "Failed to update testimonial" });
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
    res.status(500).json({ message: "Failed to delete testimonial" });
  }
});

app.get("/faqs", async (_req, res) => {
  try {
    const faqs = await storage.getAllFAQs(true);
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch FAQs" });
  }
});

app.post("/faqs", requireAuth, async (req, res) => {
  try {
    const faq = await storage.createFAQ(req.body);
    res.status(201).json(faq);
  } catch (error) {
    res.status(500).json({ message: "Failed to create FAQ" });
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
    res.status(500).json({ message: "Failed to update FAQ" });
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
    res.status(500).json({ message: "Failed to delete FAQ" });
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
    res.status(500).json({ message: "Failed to fetch quiz" });
  }
});

app.post("/quizzes", requireAuth, async (req, res) => {
  try {
    const quiz = await storage.createQuiz(req.body);
    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ message: "Failed to create quiz" });
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
    res.status(500).json({ message: "Failed to update quiz" });
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
    res.status(500).json({ message: "Failed to delete quiz" });
  }
});