import api from '@/lib/api';
import type {
  LoginResponse,
  RegisterResponse,
  User,
  Session,
  RequestPasswordResetResponse,
  VerifyResetCodeResponse,
} from '@/types/auth';

export const loginService = async (email: string, password: string): Promise<LoginResponse> => {
  const formData = new FormData();
  formData.append('username', email);
  formData.append('password', password);

  const res = await api.post('/auth/login', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const registerService = async (
  email: string,
  password: string,
  first_name: string,
  last_name: string
): Promise<RegisterResponse> => {
  const res = await api.post('/auth/register', { email, password, first_name, last_name });
  return res.data;
};

export const refreshTokenService = async (refresh_token: string): Promise<{ access_token: string; token_type: string }> => {
  const res = await api.post('/auth/refresh', { refresh_token });
  return res.data;
};

export const getSessionsService = async (access_token: string): Promise<Session[]> => {
  const res = await api.get('/auth/me/sessions', {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  return res.data;
};

export const revokeSessionService = async (sessionId: string, access_token: string): Promise<{ message: string }> => {
  const res = await api.delete(`/auth/me/sessions/${sessionId}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  return res.data;
};

export const getUserService = async (access_token: string): Promise<User> => {
  const res = await api.get('/auth/me', {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  return res.data;
};

export const updateUserService = async (
  data: { first_name?: string; last_name?: string; email?: string; phone_number?: string },
  access_token: string
): Promise<User> => {
  const res = await api.put('/users/me', data, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  return res.data;
};

export const deleteUserService = async (access_token: string): Promise<{ message: string }> => {
  const res = await api.delete('/users/me', {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  return res.data;
};

export const requestPasswordResetService = async (
  email?: string,
  phone_number?: string
): Promise<RequestPasswordResetResponse> => {
  const res = await api.post('/auth/request-password-reset', {
    email,
    phone_number,
  });
  return res.data;
};

export const verifyResetCodeService = async (
  code: string,
  new_password: string
): Promise<VerifyResetCodeResponse> => {
  const res = await api.post('/auth/verify-reset-code', {
    code,
    new_password,
  });
  return res.data;
};
