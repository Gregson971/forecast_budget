import axios from "axios"
import { handleSilentError } from "./errorHandler"

let isRefreshing = false
let failedQueue: any[] = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

const instance = axios.create({
  baseURL: baseURL, // backend FastAPI
  timeout: 10000, // 10 secondes de timeout
})

instance.interceptors.request.use(config => {
  const token = localStorage.getItem("access_token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, error => {
  handleSilentError(error)
  return Promise.reject(error)
})

instance.interceptors.response.use(
  response => {
    return response
  },
  async error => {
    // Log silencieux de l'erreur (pas de toast ici, les composants s'en chargent)
    handleSilentError(error)

    // Gestion des erreurs de réseau
    if (!error.response) {
      // Si c'est une erreur de réseau, on peut essayer de rafraîchir le token
      // mais seulement si on a un refresh token
      const refreshToken = localStorage.getItem("refresh_token")
      if (refreshToken && !error.config._retry) {
        error.config._retry = true
        try {
          const res = await axios.post(`${baseURL}/auth/refresh`, {
            refresh_token: refreshToken,
          })
          const newAccessToken = res.data.access_token
          localStorage.setItem("access_token", newAccessToken)
          error.config.headers.Authorization = `Bearer ${newAccessToken}`
          return instance(error.config)
        } catch (refreshError) {
          // Si le refresh échoue aussi, on déconnecte l'utilisateur
          localStorage.removeItem("access_token")
          localStorage.removeItem('refresh_token')
          window.location.href = '/auth/login'
          return Promise.reject(error)
        }
      }
      return Promise.reject(error)
    }
    
    const originalRequest = error.config

    // Si non 401, on ne fait rien
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    // Empêche boucle infinie
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      }).then(token => {
        originalRequest.headers.Authorization = `Bearer ${token}`
        return instance(originalRequest)
      }).catch(err => Promise.reject(err))
    }

    originalRequest._retry = true
    isRefreshing = true

    const refreshToken = localStorage.getItem("refresh_token")

    try {
      const res = await axios.post(`${baseURL}/auth/refresh`, {
        refresh_token: refreshToken,
      })

      const newAccessToken = res.data.access_token
      localStorage.setItem("access_token", newAccessToken)

      instance.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`
      processQueue(null, newAccessToken)
      return instance(originalRequest)
    } catch (err) {
      processQueue(err, null)
      localStorage.removeItem("access_token")
      localStorage.removeItem('refresh_token');
      window.location.href = '/auth/login'; // hard redirect
      return Promise.reject(err);
    } finally {
      isRefreshing = false
    }
  }
)

export default instance
