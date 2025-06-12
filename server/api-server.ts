import express from "express";
import cors from "cors";
import { storage } from "./storage.js";
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
const PORT = 5001;

// Enable CORS for frontend
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5184', 'http://localhost:5185'],
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
const requireAuth = (req: any, res: any, next: any) => {
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
app.get("/courses", async (req, res) => {
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
app.get("/leads", requireAuth, async (req, res) => {
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

app.get("/testimonials", async (req, res) => {
  try {
    const testimonials = await storage.getAllTestimonials(true);
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch testimonials" });
  }
});

app.get("/blog", async (req, res) => {
  try {
    const posts = await storage.getAllBlogPosts(true);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch blog posts" });
  }
});

app.get("/faqs", async (req, res) => {
  try {
    const faqs = await storage.getAllFAQs(true);
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch FAQs" });
  }
});

// Comment out (or remove) the app.listen(...) call below so that only server/index.ts calls listen.
// (This prevents two servers from listening on the same port.)
/*
app.listen(3001, () => {
  console.log("API Server running on port 3001");
});
*/