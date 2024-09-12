import { ref } from 'vue'
import { useDebounceFn, useCloned } from '@vueuse/core'
import { api } from './baseApi'

const likeToggled = ref(false)
const tempLiked = useCloned(likeToggled) // Temporary to track changes

// API call to like a post
const likeApiCall = async (slug: string): Promise<void> => {
  try {
    await api.post(`/posts/like/${slug}`)
    console.log('API call executed: User liked the post.')
  } catch (error) {
    console.error('Failed to execute API call:', error)
    throw error
  }
}

// Debounced API call
const debouncedLike = useDebounceFn(async (slug: string): Promise<boolean> => {

  // check if the state has changed
  if (tempLiked.cloned.value !== likeToggled.value) {
    try {
      await likeApiCall(slug)
      likeToggled.value = tempLiked.cloned.value
      return true // Return true when like action succeeds
    } catch (error) {
      console.error('API call failed:', error)
      return false // Return false on API error
    }
  } else {
    console.log('API call cancelled: State unchanged.')
    return true // Return true if state hasn't changed
  }
}, 500)

// Handle click event and return a boolean indicating success or failure
export const handleLikeClick = (slug: string): Promise<boolean> => {
  tempLiked.cloned.value = !tempLiked.cloned.value
  return debouncedLike(slug)
}
