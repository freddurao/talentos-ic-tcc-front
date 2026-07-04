import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../api'
import { handleNotAuthorized } from '../utils/requests'
import { isCNPJValid } from '../utils/validations'

export const useGetCompanies = () => {
  const navigate = useNavigate()
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchCompanies = async () => {
    try {
      setLoading(true)
      const response = await api.get('/empresas')
      if (response.data.error) {
        toast.error(response.data.message)
      } else {
        setCompanies(response.data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCompanies()
  }, [navigate])

  return { companies, loading, refresh: fetchCompanies }
}

export const useCompanyActions = () => {
  const navigate = useNavigate()

  const requestCompany = async (data) => {
    if (!isCNPJValid(data.cnpj)) {
      toast.error('CNPJ inválido.')
      return false
    }
    try {
      const response = await api.post('/empresas/solicitacao', data)
      if (response.data.error) {
        toast.error(response.data.message)
        return false
      }
      toast.success('Solicitação de criação de empresa enviada com sucesso!')
      return true
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao enviar solicitação.')
      return false
    }
  }

  const requestAssociation = async (companyId) => {
    try {
      const response = await api.post('/empresas/associar', { companyId })
      if (response.data.error) {
        toast.error(response.data.message)
        return false
      }
      toast.success('Solicitação de associação enviada com sucesso!')
      return true
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Erro ao solicitar associação.'
      )
      return false
    }
  }

  const getPendingAssociationRequests = async () => {
    try {
      const response = await api.get('/empresas/associacoes/pendentes')
      if (response.data.error) {
        toast.error(response.data.message)
        handleNotAuthorized(response, navigate)
        return []
      }
      return response.data
    } catch (err) {
      console.error(err)
      return []
    }
  }

  const approveAssociation = async (id) => {
    try {
      const response = await api.patch(`/empresas/associacoes/aprovar/${id}`)
      if (response.data.error) {
        toast.error(response.data.message)
        return false
      }
      toast.success('Solicitação de associação aprovada!')
      return true
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao aprovar solicitação.')
      return false
    }
  }

  const rejectAssociation = async (id) => {
    try {
      const response = await api.patch(`/empresas/associacoes/rejeitar/${id}`)
      if (response.data.error) {
        toast.error(response.data.message)
        return false
      }
      toast.success('Solicitação de associação rejeitada.')
      return true
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Erro ao rejeitar solicitação.'
      )
      return false
    }
  }

  const leaveCompany = async () => {
    try {
      const response = await api.post('/empresas/sair')
      if (response.data.error) {
        toast.error(response.data.message)
        return false
      }
      toast.success('Você se desvinculou da empresa.')
      return true
    } catch (err) {
      toast.error('Erro ao se desvincular da empresa.')
      return false
    }
  }

  return {
    requestCompany,
    requestAssociation,
    getPendingAssociationRequests,
    approveAssociation,
    rejectAssociation,
    leaveCompany,
  }
}
