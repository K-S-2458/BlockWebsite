export interface User {
  id: string;
  username: string;
  email: string;
  created_at?: string;
}

export interface Post {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
  _count?: {
    comments: number;
  };
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PostsResponse {
  posts: Post[];
  pagination: PaginationMeta;
}
