/* eslint-disable import/prefer-default-export */
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../api'
import { handleNotAuthorized } from '../utils/requests'

export const useGetUsers = () => {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [count, setCount] = useState(0)
  const [fetch, setFetch] = useState(true)

  const refresh = () => setFetch(true)

  useEffect(() => {
    const getUsers = async () => {
      if (!fetch) return

      try {
        const response = await api.get(`/usuarios`)
        if (response.data.error) {
          toast.error(response.data.message)
          handleNotAuthorized(response, navigate)
        } else {
          setUsers(response.data.rows)
          setCount(response.data.count)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setFetch(false)
      }
    }
    getUsers()
  }, [fetch, navigate])

  return { users, count, refresh }
}

export const useGetCompanyRequests = () => {
  const navigate = useNavigate()
  const [requests, setRequests] = useState([])
  const [fetch, setFetch] = useState(true)

  const refresh = () => setFetch(true)

  useEffect(() => {
    const getRequests = async () => {
      if (!fetch) return

      try {
        const response = await api.get(`/empresas/pendentes`)
        if (response.data.error) {
          toast.error(response.data.message)
          handleNotAuthorized(response, navigate)
        } else {
          setRequests(response.data)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setFetch(false)
      }
    }
    getRequests()
  }, [fetch, navigate])

  return { requests, refresh }
}

export const useAdminRoutes = () => {
  const navigate = useNavigate()

  const sendInvite = async (email) => {
    const response = await api.post(`/usuarios/convite`, { email })

    if (response.data.message) {
      if (response.data.error) toast.error(response.data.message)
      else toast.success(response.data.message)
    }

    handleNotAuthorized(response, navigate)
  }

  const requestCompany = async (data) => {
    try {
      const response = await api.post(`/empresas/solicitacao`, data)
      if (response.data.error) {
        toast.error(response.data.message)
      } else {
        toast.success('Solicitação enviada com sucesso!')
        return true
      }
    } catch (err) {
      toast.error('Erro ao enviar solicitação.')
    }
    return false
  }

  const approveCompany = async (id) => {
    try {
      const response = await api.patch(`/empresas/aprovar/${id}`)
      if (response.data.error) {
        toast.error(response.data.message)
      } else {
        toast.success('Empresa aprovada!')
        return true
      }
    } catch (err) {
      toast.error('Erro ao aprovar empresa.')
    }
    return false
  }

  const rejectCompany = async (id) => {
    try {
      const response = await api.patch(`/empresas/rejeitar/${id}`)
      if (response.data.error) {
        toast.error(response.data.message)
      } else {
        toast.success('Solicitação rejeitada.')
        return true
      }
    } catch (err) {
      toast.error('Erro ao rejeitar empresa.')
    }
    return false
  }

  const updateUser = async (id, data) => {
    try {
      const response = await api.patch(`/usuarios/${id}`, data)
      if (response.data.error) {
        toast.error(response.data.message)
      } else {
        toast.success('Usuário atualizado com sucesso!')
        return true
      }
    } catch (err) {
      toast.error('Erro ao atualizar usuário.')
    }
    return false
  }

  const deleteUser = async (id) => {
    try {
      const response = await api.delete(`/usuarios/${id}`)
      if (response.data.error) {
        toast.error(response.data.message)
      } else {
        toast.success('Usuário excluído com sucesso!')
        return true
      }
    } catch (err) {
      toast.error('Erro ao excluir usuário.')
    }
    return false
  }

  return {
    sendInvite,
    requestCompany,
    approveCompany,
    rejectCompany,
    updateUser,
    deleteUser,
  }
}
