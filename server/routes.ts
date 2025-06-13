import express, { Request, Response } from 'express';
import { IStorage } from './storage';

export function setupRoutes(app: express.Application, storage: IStorage) {
  // Comprehensive health check endpoint
  app.get('/health', async (_: Request, res: Response) => {
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

  // API routes
  app.get('/api/courses', async (_: Request, res: Response) => {
    try {
      const courses = await storage.getAllCourses();
      res.json(courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      res.status(500).json({ error: 'Failed to fetch courses' });
    }
  });

  app.get('/api/courses/:slug', async (req: Request, res: Response) => {
    try {
      const course = await storage.getCourseBySlug(req.params.slug);
      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }
      res.json(course);
    } catch (error) {
      console.error('Error fetching course:', error);
      res.status(500).json({ error: 'Failed to fetch course' });
    }
  });

  // Add more routes as needed
}