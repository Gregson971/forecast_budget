import api from '@/lib/api';

export const loginService = async (email: string, password: string) => {
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

export const registerService = async (email: string, password: string, first_name: string, last_name: string) => {
  const res = await api.post('/auth/register', { email, password, first_name, last_name });
  return res.data;
};

export const refreshTokenService = async (refresh_token: string) => {
  const res = await api.post('/auth/refresh', { refresh_token });
  return res.data;
};

export const getSessionsService = async (access_token: string) => {
  const res = await api.get('/auth/me/sessions', {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  return res.data;
};

export const revokeSessionService = async (sessionId: string, access_token: string) => {
  const res = await api.delete(`/auth/me/sessions/${sessionId}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  return res.data;
}; 

export const getUserService = async (access_token: string) => {
  const res = await api.get('/auth/me', {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  return res.data;
};
