import express from 'express';
import { IStorage } from './storage';

export function setupRoutes(app: express.Application, storage: IStorage) {
  // Health check endpoint
  app.get('/health', (_, res) => {
    res.json({ status: 'ok' });
  });

  // API routes
  app.get('/api/courses', async (_, res) => {
    try {
      const courses = await storage.getAllCourses();
      res.json(courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      res.status(500).json({ error: 'Failed to fetch courses' });
    }
  });

  app.get('/api/courses/:slug', async (req, res) => {
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