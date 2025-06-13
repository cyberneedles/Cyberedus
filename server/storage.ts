import { Course, Quiz, BlogPost, Testimonial, FAQ, User } from '../shared/types';
import { db } from './db';
import { eq, desc, and } from 'drizzle-orm';
import { courses, quizzes, blogPosts, testimonials, faqs, users, leads } from '@shared/schema';
import type { InsertCourse, InsertQuiz, InsertBlogPost, InsertTestimonial, InsertFAQ, InsertLead } from '@shared/schema';

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: Omit<User, 'id' | 'createdAt'>): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | null>;
  deleteUser(id: number): Promise<boolean>;
  
  // Course operations
  getAllCourses(): Promise<Course[]>;
  getCourseBySlug(slug: string): Promise<Course | null>;
  createCourse(course: Omit<Course, 'id' | 'createdAt'>): Promise<Course>;
  updateCourse(id: number, course: Partial<Course>): Promise<Course | null>;
  deleteCourse(id: number): Promise<boolean>;
  
  // Quiz operations
  getQuizByCourseId(courseId: number): Promise<Quiz | undefined>;
  createQuiz(quiz: Omit<Quiz, 'id' | 'createdAt'>): Promise<Quiz>;
  updateQuiz(id: number, quiz: Partial<Quiz>): Promise<Quiz | null>;
  deleteQuiz(id: number): Promise<boolean>;
  
  // Lead operations
  createLead(lead: Omit<User, 'id' | 'createdAt' | 'password' | 'role'>): Promise<Omit<User, 'id' | 'createdAt' | 'password' | 'role'>>;
  getAllLeads(): Promise<Omit<User, 'id' | 'createdAt' | 'password' | 'role'>[]>;
  
  // Blog operations
  getAllBlogPosts(published?: boolean): Promise<BlogPost[]>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<BlogPost>;
  updateBlogPost(id: number, post: Partial<BlogPost>): Promise<BlogPost | null>;
  deleteBlogPost(id: number): Promise<boolean>;
  
  // Testimonial operations
  getAllTestimonials(approved?: boolean): Promise<Testimonial[]>;
  getTestimonialsByCourse(courseId: number): Promise<Testimonial[]>;
  createTestimonial(testimonial: Omit<Testimonial, 'id' | 'createdAt'>): Promise<Testimonial>;
  updateTestimonial(id: number, testimonial: Partial<Testimonial>): Promise<Testimonial | null>;
  deleteTestimonial(id: number): Promise<boolean>;
  
  // FAQ operations
  getAllFAQs(active?: boolean): Promise<FAQ[]>;
  createFAQ(faq: Omit<FAQ, 'id'>): Promise<FAQ>;
  updateFAQ(id: number, faq: Partial<FAQ>): Promise<FAQ | null>;
  deleteFAQ(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    console.log('✅ Real database storage initialized (Neon PostgreSQL)');
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    try {
      const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
      return result[0];
    } catch (error) {
      console.error('Error getting user:', error);
      return undefined;
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
      return result[0];
    } catch (error) {
      console.error('Error getting user by email:', error);
      return undefined;
    }
  }

  async createUser(user: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    try {
      const result = await db.insert(users).values(user).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async updateUser(id: number, user: Partial<User>): Promise<User | null> {
    try {
      const result = await db.update(users).set(user).where(eq(users.id, id)).returning();
      return result[0] || null;
    } catch (error) {
      console.error('Error updating user:', error);
      return null;
    }
  }

  async deleteUser(id: number): Promise<boolean> {
    try {
      const result = await db.delete(users).where(eq(users.id, id));
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }

  // Course operations
  async getAllCourses(): Promise<Course[]> {
    try {
      return await db.select().from(courses).orderBy(desc(courses.createdAt));
    } catch (error) {
      console.error('Error getting all courses:', error);
      return [];
    }
  }

  async getCourseBySlug(slug: string): Promise<Course | null> {
    try {
      const result = await db.select().from(courses).where(eq(courses.slug, slug)).limit(1);
      return result[0] || null;
    } catch (error) {
      console.error('Error getting course by slug:', error);
      return null;
    }
  }

  async createCourse(course: Omit<Course, 'id' | 'createdAt'>): Promise<Course> {
    try {
      const result = await db.insert(courses).values(course as InsertCourse).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  }

  async updateCourse(id: number, course: Partial<Course>): Promise<Course | null> {
    try {
      const result = await db.update(courses).set(course).where(eq(courses.id, id)).returning();
      return result[0] || null;
    } catch (error) {
      console.error('Error updating course:', error);
      return null;
    }
  }

  async deleteCourse(id: number): Promise<boolean> {
    try {
      await db.delete(courses).where(eq(courses.id, id));
      return true;
    } catch (error) {
      console.error('Error deleting course:', error);
      return false;
    }
  }

  // Quiz operations
  async getQuizByCourseId(courseId: number): Promise<Quiz | undefined> {
    try {
      const result = await db.select().from(quizzes).where(eq(quizzes.courseId, courseId)).limit(1);
      return result[0];
    } catch (error) {
      console.error('Error getting quiz by course ID:', error);
      return undefined;
    }
  }

  async createQuiz(quiz: Omit<Quiz, 'id' | 'createdAt'>): Promise<Quiz> {
    try {
      const result = await db.insert(quizzes).values(quiz as InsertQuiz).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating quiz:', error);
      throw error;
    }
  }

  async updateQuiz(id: number, quiz: Partial<Quiz>): Promise<Quiz | null> {
    try {
      const result = await db.update(quizzes).set(quiz).where(eq(quizzes.id, id)).returning();
      return result[0] || null;
    } catch (error) {
      console.error('Error updating quiz:', error);
      return null;
    }
  }

  async deleteQuiz(id: number): Promise<boolean> {
    try {
      await db.delete(quizzes).where(eq(quizzes.id, id));
      return true;
    } catch (error) {
      console.error('Error deleting quiz:', error);
      return false;
    }
  }

  // Lead operations
  async createLead(lead: Omit<User, 'id' | 'createdAt' | 'password' | 'role'>): Promise<Omit<User, 'id' | 'createdAt' | 'password' | 'role'>> {
    try {
      // Convert to lead format and insert into leads table
      const leadData: InsertLead = {
        name: lead.name || '',
        email: lead.email,
        phone: lead.phone || '',
        currentLocation: lead.currentLocation || '',
        courseInterest: lead.courseInterest || '',
        source: 'contact_form',
        experience: lead.experience || '',
        message: lead.message || ''
      };
      
      await db.insert(leads).values(leadData);
      return lead;
    } catch (error) {
      console.error('Error creating lead:', error);
      throw error;
    }
  }

  async getAllLeads(): Promise<Omit<User, 'id' | 'createdAt' | 'password' | 'role'>[]> {
    try {
      const result = await db.select().from(leads).orderBy(desc(leads.createdAt));
      // Convert leads to the expected format
      return result.map(lead => ({
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        currentLocation: lead.currentLocation,
        courseInterest: lead.courseInterest,
        experience: lead.experience,
        message: lead.message
      } as any));
    } catch (error) {
      console.error('Error getting all leads:', error);
      return [];
    }
  }

  // Blog operations
  async getAllBlogPosts(published?: boolean): Promise<BlogPost[]> {
    try {
    if (published !== undefined) {
        return await db.select().from(blogPosts).where(eq(blogPosts.isPublished, published)).orderBy(desc(blogPosts.createdAt));
      }
      return await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
    } catch (error) {
      console.error('Error getting all blog posts:', error);
      return [];
    }
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    try {
      const result = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
      return result[0];
    } catch (error) {
      console.error('Error getting blog post by slug:', error);
      return undefined;
    }
  }

  async createBlogPost(post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<BlogPost> {
    try {
      const result = await db.insert(blogPosts).values(post as InsertBlogPost).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating blog post:', error);
      throw error;
    }
  }

  async updateBlogPost(id: number, post: Partial<BlogPost>): Promise<BlogPost | null> {
    try {
      const result = await db.update(blogPosts).set(post).where(eq(blogPosts.id, id)).returning();
      return result[0] || null;
    } catch (error) {
      console.error('Error updating blog post:', error);
      return null;
    }
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    try {
      await db.delete(blogPosts).where(eq(blogPosts.id, id));
      return true;
    } catch (error) {
      console.error('Error deleting blog post:', error);
      return false;
    }
  }

  // Testimonial operations
  async getAllTestimonials(approved?: boolean): Promise<Testimonial[]> {
    try {
    if (approved !== undefined) {
        return await db.select().from(testimonials).where(eq(testimonials.isApproved, approved)).orderBy(desc(testimonials.createdAt));
      }
      return await db.select().from(testimonials).orderBy(desc(testimonials.createdAt));
    } catch (error) {
      console.error('Error getting all testimonials:', error);
      return [];
    }
  }

  async getTestimonialsByCourse(courseId: number): Promise<Testimonial[]> {
    try {
      return await db.select().from(testimonials).where(eq(testimonials.courseId, courseId)).orderBy(desc(testimonials.createdAt));
    } catch (error) {
      console.error('Error getting testimonials by course:', error);
      return [];
    }
  }

  async createTestimonial(testimonial: Omit<Testimonial, 'id' | 'createdAt'>): Promise<Testimonial> {
    try {
      const result = await db.insert(testimonials).values(testimonial as InsertTestimonial).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating testimonial:', error);
      throw error;
    }
  }

  async updateTestimonial(id: number, testimonial: Partial<Testimonial>): Promise<Testimonial | null> {
    try {
      const result = await db.update(testimonials).set(testimonial).where(eq(testimonials.id, id)).returning();
      return result[0] || null;
    } catch (error) {
      console.error('Error updating testimonial:', error);
      return null;
    }
  }

  async deleteTestimonial(id: number): Promise<boolean> {
    try {
      await db.delete(testimonials).where(eq(testimonials.id, id));
      return true;
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      return false;
    }
  }

  // FAQ operations
  async getAllFAQs(active?: boolean): Promise<FAQ[]> {
    try {
    if (active !== undefined) {
        return await db.select().from(faqs).where(eq(faqs.isActive, active)).orderBy(faqs.order);
      }
      return await db.select().from(faqs).orderBy(faqs.order);
    } catch (error) {
      console.error('Error getting all FAQs:', error);
      return [];
    }
  }

  async createFAQ(faq: Omit<FAQ, 'id'>): Promise<FAQ> {
    try {
      const result = await db.insert(faqs).values(faq as InsertFAQ).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating FAQ:', error);
      throw error;
    }
  }

  async updateFAQ(id: number, faq: Partial<FAQ>): Promise<FAQ | null> {
    try {
      const result = await db.update(faqs).set(faq).where(eq(faqs.id, id)).returning();
      return result[0] || null;
    } catch (error) {
      console.error('Error updating FAQ:', error);
      return null;
    }
  }

  async deleteFAQ(id: number): Promise<boolean> {
    try {
      await db.delete(faqs).where(eq(faqs.id, id));
      return true;
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      return false;
    }
  }
}

// Keep the MemStorage for fallback
export class MemStorage implements IStorage {
  private users: User[] = [];
  private courses: Course[] = [];
  private quizzes: Quiz[] = [];
  private blogPosts: BlogPost[] = [];
  private testimonials: Testimonial[] = [];
  private faqs: FAQ[] = [];
  private leads: Omit<User, 'id' | 'createdAt' | 'password' | 'role'>[] = [];
  private nextId: number = 1;

  constructor() {
    this.seedData();
  }

  private getNextId(): number {
    return this.nextId++;
  }

  // Implement all methods with in-memory storage as fallback
  async getUser(id: number): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email);
  }

  async createUser(user: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const newUser: User = {
      ...user,
      id: this.getNextId(),
      createdAt: new Date(),
    };
    this.users.push(newUser);
    return newUser;
  }

  async updateUser(id: number, user: Partial<User>): Promise<User | null> {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) return null;
    this.users[index] = { ...this.users[index], ...user };
    return this.users[index];
  }

  async deleteUser(id: number): Promise<boolean> {
    const initialLength = this.users.length;
    this.users = this.users.filter(u => u.id !== id);
    return this.users.length < initialLength;
  }

  async getAllCourses(): Promise<Course[]> {
    return this.courses;
  }

  async getCourseBySlug(slug: string): Promise<Course | null> {
    return this.courses.find(course => course.slug === slug) || null;
  }

  async createCourse(course: Omit<Course, 'id' | 'createdAt'>): Promise<Course> {
    const newCourse: Course = {
      ...course,
      id: this.getNextId(),
      createdAt: new Date(),
      isActive: true,
      syllabusUrl: course.syllabusUrl ?? null,
      overview: course.overview ?? null,
      mainImage: course.mainImage ?? null,
      logo: course.logo ?? null,
      price: course.price ?? null,
      features: course.features ?? null,
      batchDates: course.batchDates || [],
      category: course.category,
      icon: course.icon,
      prerequisites: course.prerequisites ?? null,
      level: course.level,
      duration: course.duration,
      description: course.description,
      mode: course.mode,
      title: course.title
    };
    this.courses.push(newCourse);
    return newCourse;
  }

  async updateCourse(id: number, course: Partial<Course>): Promise<Course | null> {
    const index = this.courses.findIndex(c => c.id === id);
    if (index === -1) return null;
    this.courses[index] = { ...this.courses[index], ...course };
    return this.courses[index];
  }

  async deleteCourse(id: number): Promise<boolean> {
    const initialLength = this.courses.length;
    this.courses = this.courses.filter(c => c.id !== id);
    return this.courses.length < initialLength;
  }

  async getQuizByCourseId(courseId: number): Promise<Quiz | undefined> {
    return this.quizzes.find(quiz => quiz.courseId === courseId);
  }

  async createQuiz(quiz: Omit<Quiz, 'id' | 'createdAt'>): Promise<Quiz> {
    const newQuiz: Quiz = {
      ...quiz,
      id: this.getNextId(),
      createdAt: new Date(),
      courseId: quiz.courseId ?? null,
      questions: quiz.questions
    };
    this.quizzes.push(newQuiz);
    return newQuiz;
  }

  async updateQuiz(id: number, quiz: Partial<Quiz>): Promise<Quiz | null> {
    const index = this.quizzes.findIndex(q => q.id === id);
    if (index === -1) return null;
    this.quizzes[index] = { ...this.quizzes[index], ...quiz };
    return this.quizzes[index];
  }

  async deleteQuiz(id: number): Promise<boolean> {
    const initialLength = this.quizzes.length;
    this.quizzes = this.quizzes.filter(q => q.id !== id);
    return this.quizzes.length < initialLength;
  }

  async createLead(lead: Omit<User, 'id' | 'createdAt' | 'password' | 'role'>): Promise<Omit<User, 'id' | 'createdAt' | 'password' | 'role'>> {
    this.leads.push(lead);
      return lead;
  }

  async getAllLeads(): Promise<Omit<User, 'id' | 'createdAt' | 'password' | 'role'>[]> {
    return this.leads;
  }

  async getAllBlogPosts(published?: boolean): Promise<BlogPost[]> {
    if (published !== undefined) {
      return this.blogPosts.filter(post => post.isPublished === published);
    }
    return this.blogPosts;
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return this.blogPosts.find(post => post.slug === slug);
  }

  async createBlogPost(post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<BlogPost> {
    const newPost: BlogPost = {
      ...post,
      id: this.getNextId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      featuredImage: post.featuredImage ?? null,
      authorId: post.authorId ?? null,
      isPublished: post.isPublished ?? false,
      readingTime: post.readingTime ?? 0
    };
    this.blogPosts.push(newPost);
    return newPost;
  }

  async updateBlogPost(id: number, post: Partial<BlogPost>): Promise<BlogPost | null> {
    const index = this.blogPosts.findIndex(p => p.id === id);
    if (index === -1) return null;
    this.blogPosts[index] = { ...this.blogPosts[index], ...post };
    return this.blogPosts[index];
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    const initialLength = this.blogPosts.length;
    this.blogPosts = this.blogPosts.filter(p => p.id !== id);
    return this.blogPosts.length < initialLength;
  }

  async getAllTestimonials(approved?: boolean): Promise<Testimonial[]> {
    if (approved !== undefined) {
      return this.testimonials.filter(testimonial => testimonial.isApproved === approved);
    }
    return this.testimonials;
  }

  async getTestimonialsByCourse(courseId: number): Promise<Testimonial[]> {
    return this.testimonials.filter(testimonial => testimonial.courseId === courseId);
  }

  async createTestimonial(testimonial: Omit<Testimonial, 'id' | 'createdAt'>): Promise<Testimonial> {
    const newTestimonial: Testimonial = {
      ...testimonial,
      id: this.getNextId(),
      createdAt: new Date(),
      courseId: testimonial.courseId ?? null,
      jobTitle: testimonial.jobTitle ?? null,
      company: testimonial.company ?? null,
      image: testimonial.image ?? null,
      isApproved: testimonial.isApproved ?? false
    };
    this.testimonials.push(newTestimonial);
    return newTestimonial;
  }

  async updateTestimonial(id: number, testimonial: Partial<Testimonial>): Promise<Testimonial | null> {
    const index = this.testimonials.findIndex(t => t.id === id);
    if (index === -1) return null;
    this.testimonials[index] = { ...this.testimonials[index], ...testimonial };
    return this.testimonials[index];
  }

  async deleteTestimonial(id: number): Promise<boolean> {
    const initialLength = this.testimonials.length;
    this.testimonials = this.testimonials.filter(t => t.id !== id);
    return this.testimonials.length < initialLength;
  }

  async getAllFAQs(active?: boolean): Promise<FAQ[]> {
    if (active !== undefined) {
      return this.faqs.filter(faq => faq.isActive === active);
    }
    return this.faqs;
  }

  async createFAQ(faq: Omit<FAQ, 'id'>): Promise<FAQ> {
    const newFAQ: FAQ = {
      ...faq,
      id: this.getNextId(),
    };
    this.faqs.push(newFAQ);
    return newFAQ;
  }

  async updateFAQ(id: number, faq: Partial<FAQ>): Promise<FAQ | null> {
    const index = this.faqs.findIndex(f => f.id === id);
    if (index === -1) return null;
    this.faqs[index] = { ...this.faqs[index], ...faq };
    return this.faqs[index];
  }

  async deleteFAQ(id: number): Promise<boolean> {
    const initialLength = this.faqs.length;
    this.faqs = this.faqs.filter(f => f.id !== id);
    return this.faqs.length < initialLength;
  }

  private seedData() {
    // Seed data for fallback
    this.courses.push(
      {
        id: this.getNextId(),
        createdAt: new Date(),
        title: 'Cybersecurity Fundamentals',
        slug: 'cybersecurity-fundamentals',
        description: 'Learn the basics of cybersecurity.',
        overview: 'This course provides a comprehensive introduction to cybersecurity.',
        price: 499,
        features: ['Video Lectures', 'Quizzes', 'Certificate'],
        batchDates: ['2024-09-01', '2024-10-01'],
        category: 'Cybersecurity',
        icon: 'ShieldCheckIcon',
        prerequisites: 'None',
        level: 'Beginner',
        duration: '4 weeks',
        mode: 'Online',
        syllabusUrl: 'https://example.com/syllabus/cybersecurity-fundamentals.pdf',
        mainImage: 'https://example.com/images/cybersecurity-fundamentals.jpg',
        logo: 'https://example.com/logos/cybersecurity.png',
        isActive: true,
      }
    );

    this.faqs.push(
      {
        id: this.getNextId(),
        question: 'What is CyberEdu?',
        answer: 'CyberEdu is an online learning platform specializing in cybersecurity education.',
        category: 'General',
        isActive: true,
        order: 1,
      }
    );
  }
}
