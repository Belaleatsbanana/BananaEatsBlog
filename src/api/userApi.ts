import type { AuthSuccessResponse, User, UserLogin, UserRegister } from '@/types'
import { api } from './baseApi'

export const getUser = async (): Promise<User> => {
  try {
    const response = await api.get('/user')
    const user: User = response.data

    // Store the user ID in localStorage
    localStorage.setItem('BananaBlogUserId', user.id.toString())

    return user
  } catch (error) {
    console.error('Failed to fetch user:', error)
    throw error
  }
}

export const registerUser = async (userData: UserRegister): Promise<void> => {
  try {
    const response = await api.post('/register', userData)
    const authResponse: AuthSuccessResponse = response.data

    // Store the token in localStorage
    localStorage.setItem('BananaBlogToken', authResponse.token)

  } catch (error) {
    console.error('Registration failed:', error)
    throw error
  }
}

export const loginUser = async (userData: UserLogin): Promise<void> => {
  try {
    const response = await api.post('/login', userData)
    const authResponse: AuthSuccessResponse = response.data

    // Store the token in localStorage
    localStorage.setItem('BananaBlogToken', authResponse.token)
  } catch (error) {
    console.error('Login failed:', error)
    throw error
  }
}

export const logoutUser = async (): Promise<void> => {
  try {

    // Remove token and userId from localStorage
    localStorage.removeItem('BananaBlogToken')
    localStorage.removeItem('BananaBlogUserId')
  } catch (error) {
    console.error('Logout failed:', error)
    throw error
  }
}
