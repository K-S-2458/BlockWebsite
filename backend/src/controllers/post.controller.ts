import { Request, Response, NextFunction } from 'express';
import { prisma } from '../prisma';
import {
  createPostSchema,
  updatePostSchema,
  queryPostSchema,
} from '../validators/post.validator';
import { AuthenticatedRequest } from '../types';

export async function getPosts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit, search, author } = queryPostSchema.parse(req.query);

    const skip = (page - 1) * limit;

    const where: any = {};

    if (search && search.trim() !== '') {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (author && author.trim() !== '') {
      where.user = {
        OR: [
          { username: { equals: author, mode: 'insensitive' } },
          { id: author },
        ],
      };
    }

    const [total, posts] = await Promise.all([
      prisma.post.count({ where }),
      prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          user: {
            select: { id: true, username: true, email: true },
          },
          _count: {
            select: { comments: true },
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    res.status(200).json({
      posts,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getPostById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, username: true, email: true },
        },
        _count: {
          select: { comments: true },
        },
      },
    });

    if (!post) {
      res.status(404).json({ error: 'Post not found.' });
      return;
    }

    res.status(200).json({ post });
  } catch (err) {
    next(err);
  }
}

export async function createPost(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required. Please log in.' });
      return;
    }

    const parsed = createPostSchema.parse(req.body);

    const post = await prisma.post.create({
      data: {
        user_id: req.user.id,
        title: parsed.title,
        content: parsed.content,
      },
      include: {
        user: {
          select: { id: true, username: true, email: true },
        },
        _count: {
          select: { comments: true },
        },
      },
    });

    res.status(201).json({
      message: 'Post created successfully',
      post,
    });
  } catch (err) {
    next(err);
  }
}

export async function updatePost(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required. Please log in.' });
      return;
    }

    const id = req.params.id as string;
    const parsed = updatePostSchema.parse(req.body);

    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      res.status(404).json({ error: 'Post not found.' });
      return;
    }

    // auth+own check
    if (existingPost.user_id !== req.user.id) {
      res.status(403).json({ error: 'Forbidden. You are not authorized to edit this post.' });
      return;
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        ...(parsed.title !== undefined && { title: parsed.title }),
        ...(parsed.content !== undefined && { content: parsed.content }),
      },
      include: {
        user: {
          select: { id: true, username: true, email: true },
        },
        _count: {
          select: { comments: true },
        },
      },
    });

    res.status(200).json({
      message: 'Post updated successfully',
      post: updatedPost,
    });
  } catch (err) {
    next(err);
  }
}

export async function deletePost(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required. Please log in.' });
      return;
    }

    const id = req.params.id as string;

    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      res.status(404).json({ error: 'Post not found.' });
      return;
    }

    // auth+own check
    if (existingPost.user_id !== req.user.id) {
      res.status(403).json({ error: 'Forbidden. You are not authorized to delete this post.' });
      return;
    }

    await prisma.post.delete({
      where: { id },
    });

    res.status(200).json({
      message: 'Post and associated comments deleted successfully',
    });
  } catch (err) {
    next(err);
  }
}
