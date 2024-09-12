import type { CommentBasicInfo, Comment } from './commentTypes'
import type { UserBasicInfo } from './userTypes'

// Base Post type
export type Post = {
  id: number
  slug: string
  title: string
  content: string
  comments_count: number
  created_at: string
  created_at_readable: string
  updated_at: string
  updated_at_readable: string
  image: string
  image_thumb: string
  user: UserBasicInfo
  last_comment: CommentBasicInfo | null
  likes_count: number
  liked_by_user: boolean
}

// Use Omit to exclude properties from Post and & to include new properties
export type PostDetail = Omit<Post, 'comments_count' | 'last_comment'> & {
  comments: Comment[]
  likes: UserBasicInfo[]
}
