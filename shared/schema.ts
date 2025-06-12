import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("admin"), // Only admin users can login
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  duration: text("duration").notNull(),
  prerequisites: text("prerequisites"),
  mode: text("mode").notNull(), // "online", "offline", "both"
  level: text("level").notNull(), // "beginner", "intermediate", "advanced"
  price: integer("price"),
  features: jsonb("features").$type<string[]>(),
  syllabusUrl: text("syllabus_url"),
  batchDates: jsonb("batch_dates").$type<string[]>(),
  icon: text("icon").notNull(),
  category: text("category").notNull(),
  
  // Enhanced course page sections
  overview: text("overview"), // Rich text content for overview section
  mainImage: text("main_image"), // Main course image
  logo: text("logo"), // Course logo
  
  // Curriculum structure
  curriculum: jsonb("curriculum").$type<{
    sectionTitle: string;
    items: string[];
  }[]>(),
  
  // Batches information
  batches: jsonb("batches").$type<{
    startDate: string;
    time: string;
    mode: string;
    instructor: string;
  }[]>(),
  
  // Fee structures
  fees: jsonb("fees").$type<{
    label: string;
    amount: number;
    notes: string;
  }>(),
  
  // Additional course details
  careerOpportunities: text("career_opportunities").array(),
  toolsAndTechnologies: text("tools_and_technologies"),
  whatYouWillLearn: text("what_you_will_learn"), // What You'll Learn section
  
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").references(() => courses.id),
  title: text("title").notNull(),
  questions: jsonb("questions").$type<Array<{
    question: string;
    options: string[];
    correct: number;
  }>>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  currentLocation: text("current_location"),
  courseInterest: text("course_interest"),
  source: text("source").notNull(), // "contact_form", "quiz", "syllabus_download", etc.
  experience: text("experience"),
  message: text("message"),
  quizResults: jsonb("quiz_results"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt").notNull(),
  category: text("category").notNull(),
  featuredImage: text("featured_image"),
  authorId: integer("author_id").references(() => users.id),
  isPublished: boolean("is_published").default(false).notNull(),
  readingTime: integer("reading_time").default(5).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  courseId: integer("course_id").references(() => courses.id),
  courseName: text("course_name").notNull(),
  rating: integer("rating").notNull(),
  review: text("review").notNull(),
  jobTitle: text("job_title"),
  company: text("company"),
  image: text("image"),
  isApproved: boolean("is_approved").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const faqs = pgTable("faqs", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: text("category").notNull(),
  order: integer("order").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
  createdAt: true,
}).extend({
  curriculum: z.array(z.object({
    sectionTitle: z.string(),
    items: z.array(z.string()),
  })).optional(),
  batches: z.array(z.object({
    startDate: z.string(),
    time: z.string(),
    mode: z.string(),
    instructor: z.string(),
  })).optional(),
  fees: z.array(z.object({
    label: z.string(),
    amount: z.number(),
    notes: z.string(),
  })).optional(),
  careerOpportunities: z.array(z.string()).optional(),
  whatYouWillLearn: z.string().optional(),
  syllabusUrl: z.string().optional(),
});

export const insertQuizSchema = createInsertSchema(quizzes).omit({
  id: true,
  createdAt: true,
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTestimonialSchema = createInsertSchema(testimonials).omit({
  id: true,
  createdAt: true,
});

export const insertFaqSchema = createInsertSchema(faqs).omit({
  id: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Course = typeof courses.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;

export type Quiz = typeof quizzes.$inferSelect;
export type InsertQuiz = z.infer<typeof insertQuizSchema>;

export type Lead = typeof leads.$inferSelect;
export type InsertLead = z.infer<typeof insertLeadSchema>;

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;

export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;

export type FAQ = typeof faqs.$inferSelect;
export type InsertFAQ = z.infer<typeof insertFaqSchema>;
