// Vercel serverless entrypoint.
// Wraps the Express app from /backend so the same codebase runs locally
// (via `npm --prefix backend run dev`) and on Vercel as a serverless function.
import type { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../backend/src/app';

export default function handler(req: VercelRequest, res: VercelResponse) {
  return (app as unknown as (req: VercelRequest, res: VercelResponse) => void)(req, res);
}
