import express from "express";
import cors from "cors";
import { storage } from "./storage.js";
import session from "express-session";

const app = express();
const PORT = 3001;

// Enable CORS for frontend
app.use(cors({
  origin: 'http://localhost:5000',
  credentials: true
}));

app.use(express.json());

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
  const { email, password } = req.body;
  
  if (email === "admin@cyberedus.com" && password === "secure_admin_2024") {
    const user = await storage.getUserByEmail(email);
    if (user) {
      req.session.user = user;
      return res.json({ authenticated: true, user });
    }
  }
  
  res.status(401).json({ message: "Invalid credentials" });
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

app.post("/courses", requireAuth, async (req, res) => {
  try {
    console.log("Creating course with data:", req.body);
    const course = await storage.createCourse(req.body);
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
    const course = await storage.updateCourse(courseId, req.body);
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

app.listen(PORT, '0.0.0.0', () => {
  console.log(`API Server running on port ${PORT}`);
});