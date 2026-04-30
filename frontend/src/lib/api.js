import axios from 'axios'

/**
 * Centralised axios instance for talking to the NestJS backend.
 *
 * The backend uses cookie-based sessions (`connect.sid`), so every request
 * MUST be issued with `withCredentials: true` — both to receive the cookie
 * during login/register and to send it back on subsequent calls (e.g. saving
 * the student profile).
 */
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const api = axios.create({
  baseURL,
  withCredentials: true,
})

export default api
export { baseURL as API_BASE }
