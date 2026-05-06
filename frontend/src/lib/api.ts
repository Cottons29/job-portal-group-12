import axios from 'axios'

/**
 * Centralised axios instance for talking to the NestJS backend.
 *
 * The backend uses cookie-based sessions (`connect.sid`) and still supports
 * the existing JWT token, so requests include credentials and attach the
 * saved bearer token when one is available.
 */
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const api = axios.create({
    baseURL,
    withCredentials: true,
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('fs_token')

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

export default api
export {baseURL as API_BASE}
