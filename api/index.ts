import { VercelRequest, VercelResponse } from '@vercel/node';
import { app as apiApp } from '../server/api-server.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Forward the request to the Express app
  return apiApp(req, res);
} 