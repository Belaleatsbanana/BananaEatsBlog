import type { PostDetail, PostListResponse } from '@/types'
import { api } from './baseApi'

export const getPostList = async (
  page: number = 1,
  sort: 'asc' | 'desc' = 'desc',
  search: string = ''
): Promise<PostListResponse> => {
  try {
    const response = await api.get('/posts', {
      params: {
        page,
        sort,
        search
      }
    })
    const postListResponse: PostListResponse = response.data
    return postListResponse
  } catch (error) {
    console.error('Failed to fetch posts:', error)
    throw error
  }
}

export const getPost = async (slug: string): Promise<PostDetail> => {
  try {
    const response = await api.get(`/posts/${slug}`)
    const post: PostDetail = response.data.data
    return post
  } catch (error) {
    console.error('Failed to fetch post:', error)
    throw error
  }
}

export const createPost = async (formData: FormData): Promise<string> => {
  try {
    const response = await api.post('/posts', formData)
    const slug: string = response.data.data.slug

    return slug
  } catch (error) {
    console.error('Failed to create post:', error)
    throw error
  }
}

export const updatePost = async (slug: string, formData: FormData): Promise<string> => {
  try {
    const response = await api.put(`/posts/${slug}`, formData)
    const newSlug: string = response.data.data.slug

    return newSlug
  } catch (error) {
    console.error('Failed to update post:', error)
    throw error
  }
}

export const deletePost = async (slug: string): Promise<void> => {
  try {
    await api.delete(`/posts/${slug}`)
  } catch (error) {
    console.error('Failed to delete post:', error)
    throw error
  }
}


