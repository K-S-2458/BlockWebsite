import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma';
import { registerSchema, loginSchema } from '../validators/auth.validator';
import { AuthenticatedRequest } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_change_me';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

function generateToken(user: { id: string; username: string; email: string }) {
  return jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: parsed.email }, { username: parsed.username }],
      },
    });

    if (existingUser) {
      if (existingUser.email.toLowerCase() === parsed.email.toLowerCase()) {
        res.status(400).json({ error: 'An account with this email address already exists.' });
        return;
      }
      if (existingUser.username.toLowerCase() === parsed.username.toLowerCase()) {
        res.status(400).json({ error: 'This username is already taken. Please choose another.' });
        return;
      }
    }

    const passwordHash = await bcrypt.hash(parsed.password, 12);

    const newUser = await prisma.user.create({
      data: {
        username: parsed.username,
        email: parsed.email,
        password_hash: passwordHash,
      },
      select: {
        id: true,
        username: true,
        email: true,
        created_at: true,
      },
    });

    const token = generateToken(newUser);
    res.cookie('token', token, COOKIE_OPTIONS);

    res.status(201).json({
      message: 'Account registered successfully',
      user: newUser,
      token,
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: parsed.email },
    });

    if (!user) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    const isMatch = await bcrypt.compare(parsed.password, user.password_hash);
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      created_at: user.created_at,
    };

    const token = generateToken(userData);
    res.cookie('token', token, COOKIE_OPTIONS);

    res.status(200).json({
      message: 'Logged in successfully',
      user: userData,
      token,
    });
  } catch (err) {
    next(err);
  }
}

export async function logout(req: Request, res: Response): Promise<void> {
  res.clearCookie('token', COOKIE_OPTIONS);
  res.status(200).json({ message: 'Logged out successfully' });
}

export async function getMe(req: AuthenticatedRequest, res: Response): Promise<void> {
  res.status(200).json({ user: req.user });
}
