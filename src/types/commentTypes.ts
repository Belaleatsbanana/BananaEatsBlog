import type { MetaData, PaginationLinks } from './postResponseTypes'
import type { Post } from './postTypes'
import type { UserBasicInfo } from './userTypes'

// Base Comment type
export type Comment = {
  id: number
  content: string
  created_at: string
  created_at_readable: string
  user: UserBasicInfo
  children: Comment[] // Recursive type for nested comments
}

// Use Omit to exclude the `children` property for CommentBasicInfo
export type CommentBasicInfo = Omit<Comment, 'children'>

// Type for creating a new comment
export type CreateComment = {
  content: string
  parent_id: number | null // If null, it is a top-level comment
}

// Type for updating a comment
export type UpdateComment = {
  id: number
  content: string
}

// Type that accepts id, content, created_at, created_at_readable, children, and post
export type ExtendedComment = Comment & {
  post: Post
}

// Type for my comments response
export type MyCommentsResponse = {
  data: ExtendedComment[]
  links: PaginationLinks
  meta: MetaData
}
