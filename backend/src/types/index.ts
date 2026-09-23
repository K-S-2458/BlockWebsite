import { Request } from 'express';

export interface AuthUser {
  id: string;
  username: string;
  email: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}
