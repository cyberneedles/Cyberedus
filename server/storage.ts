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
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
      return result[0];
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw error;
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
      throw error;
    }
  }

  async deleteUser(id: number): Promise<boolean> {
    try {
      await db.delete(users).where(eq(users.id, id));
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  // Course operations
  async getAllCourses(): Promise<Course[]> {
    try {
      return await db.select().from(courses).orderBy(desc(courses.createdAt));
    } catch (error) {
      console.error('Error getting all courses:', error);
      throw error;
    }
  }

  async getCourseBySlug(slug: string): Promise<Course | null> {
    try {
      const result = await db.select().from(courses).where(eq(courses.slug, slug)).limit(1);
      return result[0] || null;
    } catch (error) {
      console.error('Error getting course by slug:', error);
      throw error;
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
      throw error;
    }
  }

  async deleteCourse(id: number): Promise<boolean> {
    try {
      await db.delete(courses).where(eq(courses.id, id));
      return true;
    } catch (error) {
      console.error('Error deleting course:', error);
      throw error;
    }
  }

  // Quiz operations
  async getQuizByCourseId(courseId: number): Promise<Quiz | undefined> {
    try {
      const result = await db.select().from(quizzes).where(eq(quizzes.courseId, courseId)).limit(1);
      return result[0];
    } catch (error) {
      console.error('Error getting quiz by course ID:', error);
      throw error;
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
      throw error;
    }
  }

  async deleteQuiz(id: number): Promise<boolean> {
    try {
      await db.delete(quizzes).where(eq(quizzes.id, id));
      return true;
    } catch (error) {
      console.error('Error deleting quiz:', error);
      throw error;
    }
  }

  // Lead operations
  async createLead(lead: Omit<User, 'id' | 'createdAt' | 'password' | 'role'>): Promise<Omit<User, 'id' | 'createdAt' | 'password' | 'role'>> {
    try {
      const result = await db.insert(leads).values(lead as InsertLead).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating lead:', error);
      throw error;
    }
  }

  async getAllLeads(): Promise<Omit<User, 'id' | 'createdAt' | 'password' | 'role'>[]> {
    try {
      return await db.select().from(leads).orderBy(desc(leads.createdAt));
    } catch (error) {
      console.error('Error getting all leads:', error);
      throw error;
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
      throw error;
    }
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    try {
      const result = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
      return result[0];
    } catch (error) {
      console.error('Error getting blog post by slug:', error);
      throw error;
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
      throw error;
    }
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    try {
      await db.delete(blogPosts).where(eq(blogPosts.id, id));
      return true;
    } catch (error) {
      console.error('Error deleting blog post:', error);
      throw error;
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
      throw error;
    }
  }

  async getTestimonialsByCourse(courseId: number): Promise<Testimonial[]> {
    try {
      return await db.select().from(testimonials).where(eq(testimonials.courseId, courseId)).orderBy(desc(testimonials.createdAt));
    } catch (error) {
      console.error('Error getting testimonials by course:', error);
      throw error;
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
      throw error;
    }
  }

  async deleteTestimonial(id: number): Promise<boolean> {
    try {
      await db.delete(testimonials).where(eq(testimonials.id, id));
      return true;
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      throw error;
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
      throw error;
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
      throw error;
    }
  }

  async deleteFAQ(id: number): Promise<boolean> {
    try {
      await db.delete(faqs).where(eq(faqs.id, id));
      return true;
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      throw error;
    }
  }
}
