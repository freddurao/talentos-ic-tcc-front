import { useState } from 'react'
import api from '../api'

function useResumeParser() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const parseResume = async (file) => {
    setLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('curriculo', file)

      const response = await api.post('/curriculo/extrair', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      if (response.data?.error) {
        throw new Error(response.data.message)
      }

      return response.data?.data ?? null
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err.message ||
        'Erro ao processar curriculo.'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { parseResume, loading, error }
}

export default useResumeParser
