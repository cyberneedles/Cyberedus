import type { Express } from "express";
import { createServer, type Server } from "http";
import express, { type Request, Response, NextFunction } from "express";
import session from 'express-session';
import { pool } from "./db.js";
import { insertLeadSchema, insertBlogPostSchema, insertTestimonialSchema } from "../shared/schema.js";
import { z } from "zod";

// Simple in-memory session store for development
const adminSessions = new Map<string, { isAdmin: boolean; adminEmail: string; timestamp: number }>();
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours

// Extend session interface to include admin flag
declare module 'express-session' {
  interface SessionData {
    isAdmin?: boolean;
    adminEmail?: string;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  const server = createServer(app);

  // Completely bypass Vite for API routes - must be first
  app.use('/api', (req, res, next) => {
    res.setHeader('X-API-Route', 'true');
    next();
  });

  // Increase payload size limit for handling large data like images (Base64)
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Configure session middleware
  app.use(session({
    secret: process.env.SESSION_SECRET || 'cyberedus-secret-key-2024',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'lax'
    },
    name: 'cyberedus.session'
  }));

  // Test database connection endpoint
  app.get("/api/test-db", async (req, res) => {
    try {
      const result = await pool.query('SELECT NOW()');
      res.json({ success: true, timestamp: result.rows[0].now });
    } catch (error) {
      console.error('Database test error:', error instanceof Error ? error.message : error);
      res.status(500).json({ error: "Database connection failed" });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  return server;
}