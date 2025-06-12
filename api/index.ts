import { VercelRequest, VercelResponse } from '@vercel/node';
import { app as apiApp } from '../server/api-server.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Convert Vercel request to Express request
  const expressReq = {
    ...req,
    headers: req.headers,
    method: req.method,
    url: req.url,
    body: req.body,
  };

  // Convert Vercel response to Express response
  const expressRes = {
    ...res,
    status: (code: number) => {
      res.status(code);
      return expressRes;
    },
    json: (data: any) => {
      res.json(data);
      return expressRes;
    },
    send: (data: any) => {
      res.send(data);
      return expressRes;
    },
  };

  // Handle the request using your existing API app
  return apiApp(expressReq, expressRes);
} 