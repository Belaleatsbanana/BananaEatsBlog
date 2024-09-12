import type { CreateComment, UpdateComment } from '@/types'
import { api } from './baseApi'

export const createComment = async (slug: string, comment: CreateComment) => {
  try {
    await api.post(`/posts/${slug}/comments`, comment)
  } catch (error) {
    console.error('Failed to create comment:', error)
    throw error
  }
}

export const updateComment = async (slug: string, comment: UpdateComment) => {
  try {
    await api.patch(`/posts/${slug}/comments/${comment.id}`, comment)
  } catch (error) {
    console.error('Failed to update comment:', error)
    throw error
  }
}

export const deleteComment = async (slug: string, commentId: number) => {
  try {
    await api.delete(`/posts/${slug}/comments/${commentId}`)
  } catch (error) {
    console.error('Failed to delete comment:', error)
    throw error
  }
}
