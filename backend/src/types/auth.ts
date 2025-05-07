
import { Request } from 'express';

export interface JwtPayload {
  id: number;
  role: string;
  [key: string]: any;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
} 