/**
 * Types pour l'authentification et la gestion des utilisateurs
 */

export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  phone_number?: string
  created_at: string
  updated_at: string
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
  token_type: string
}

export interface RegisterResponse {
  id: string
  first_name: string
  last_name: string
  email: string
  message: string
  created_at: string
  updated_at: string
}

export interface Session {
  id: string
  user_id: string
  refresh_token: string
  user_agent: string
  ip_address: string
  created_at: string
  revoked: boolean
}

export interface RequestPasswordResetRequest {
  email?: string
  phone_number?: string
}

export interface RequestPasswordResetResponse {
  success: boolean
  message: string
}

export interface VerifyResetCodeRequest {
  code: string
  new_password: string
}

export interface VerifyResetCodeResponse {
  success: boolean
  message: string
}
