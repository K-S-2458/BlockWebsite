import { Request, Response, NextFunction } from 'express';
import { prisma } from '../prisma';
import {
  createCommentSchema,
  updateCommentSchema,
} from '../validators/comment.validator';
import { AuthenticatedRequest } from '../types';

export async function getPostComments(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const post_id = req.params.id as string;

    const post = await prisma.post.findUnique({
      where: { id: post_id },
      select: { id: true },
    });

    if (!post) {
      res.status(404).json({ error: 'Post not found.' });
      return;
    }

    const comments = await prisma.comment.findMany({
      where: { post_id },
      orderBy: { created_at: 'asc' },
      include: {
        user: {
          select: { id: true, username: true, email: true },
        },
      },
    });

    res.status(200).json({ comments });
  } catch (err) {
    next(err);
  }
}

export async function createComment(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required. Please log in.' });
      return;
    }

    const post_id = req.params.id as string;
    const parsed = createCommentSchema.parse(req.body);

    const post = await prisma.post.findUnique({
      where: { id: post_id },
      select: { id: true },
    });

    if (!post) {
      res.status(404).json({ error: 'Post not found.' });
      return;
    }

    const comment = await prisma.comment.create({
      data: {
        post_id,
        user_id: req.user.id,
        content: parsed.content,
      },
      include: {
        user: {
          select: { id: true, username: true, email: true },
        },
      },
    });

    res.status(201).json({
      message: 'Comment added successfully',
      comment,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateComment(
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
    const parsed = updateCommentSchema.parse(req.body);

    const existingComment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!existingComment) {
      res.status(404).json({ error: 'Comment not found.' });
      return;
    }

    // auth+own check
    if (existingComment.user_id !== req.user.id) {
      res.status(403).json({ error: 'Forbidden. You are not authorized to edit this comment.' });
      return;
    }

    const updatedComment = await prisma.comment.update({
      where: { id },
      data: {
        content: parsed.content,
      },
      include: {
        user: {
          select: { id: true, username: true, email: true },
        },
      },
    });

    res.status(200).json({
      message: 'Comment updated successfully',
      comment: updatedComment,
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteComment(
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

    const existingComment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!existingComment) {
      res.status(404).json({ error: 'Comment not found.' });
      return;
    }

    // auth+own check
    if (existingComment.user_id !== req.user.id) {
      res.status(403).json({ error: 'Forbidden. You are not authorized to delete this comment.' });
      return;
    }

    await prisma.comment.delete({
      where: { id },
    });

    res.status(200).json({
      message: 'Comment deleted successfully',
    });
  } catch (err) {
    next(err);
  }
}
