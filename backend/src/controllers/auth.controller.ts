import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import { sendSuccess, sendError } from '../utils/response.util';

export const adminLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return sendError(res, 'Email and password required', 400);
    const result = await authService.adminLogin(email, password);
    sendSuccess(res, result, 200, 'Login successful');
  } catch (err) { next(err); }
};

export const hostLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return sendError(res, 'Email and password required', 400);
    const result = await authService.hostLogin(email, password);
    sendSuccess(res, result, 200, 'Login successful');
  } catch (err) { next(err); }
};

export const hostSignup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) return sendError(res, 'Name, email and password required', 400);
    if (password.length < 8) return sendError(res, 'Password must be at least 8 characters', 400);
    const result = await authService.hostSignup({ name, email, password, phone });
    sendSuccess(res, result, 201, 'Account created');
  } catch (err) { next(err); }
};

export const userLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return sendError(res, 'Email and password required', 400);
    const result = await authService.userLogin(email, password);
    sendSuccess(res, result, 200, 'Login successful');
  } catch (err) { next(err); }
};

export const userSignup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) return sendError(res, 'Name, email and password required', 400);
    if (password.length < 8) return sendError(res, 'Password must be at least 8 characters', 400);
    const result = await authService.userSignup({ name, email, password, phone });
    sendSuccess(res, result, 201, 'Account created');
  } catch (err) { next(err); }
};

export const refreshTokens = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return sendError(res, 'Refresh token required', 400);
    const result = await authService.refreshTokens(refreshToken);
    sendSuccess(res, result);
  } catch (err) { next(err); }
};

export const me = async (req: Request, res: Response) => {
  sendSuccess(res, req.user);
};
