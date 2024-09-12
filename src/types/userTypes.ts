// Base User type
export type User = {
  id: number
  name: string
  email: string
  email_verified_at: string | null
  created_at: string
  updated_at: string
}

// Use Omit to exclude all properties except `id` and `name`
export type UserBasicInfo = Omit<User, 'email' | 'email_verified_at' | 'created_at' | 'updated_at'>

// Type for user registration
export type UserRegister = {
  name: string
  email: string
  password: string
  password_confirmation: string
}

// Type for user login
export type UserLogin = {
  email: string
  password: string
}

export type AuthSuccessResponse = {
  message: string
  token: string
}