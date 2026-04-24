import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
})

export async function sendOtp(identifier: string) {
  const { data } = await api.post('/api/auth/send-otp', { identifier })
  return data
}

export async function verifyOtp(identifier: string, otp: string) {
  const { data } = await api.post('/api/auth/verify-otp', { identifier, otp })
  return data
}

export async function resendOtp(identifier: string) {
  const { data } = await api.post('/api/auth/resend-otp', { identifier })
  return data
}
