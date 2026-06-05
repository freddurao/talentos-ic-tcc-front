/* eslint-disable import/prefer-default-export */
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../api'
import { handleNotAuthorized } from '../utils/requests'

export const useGetSkills = () => {
  const navigate = useNavigate()
  const [skills, setSkills] = useState([])

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await api.get(`/habilidades`)

        if (response.data.message) {
          if (response.data.error) {
            toast.error(response.data.message)
            handleNotAuthorized(response, navigate)
            return
          }
          toast.success(response.data.message)
        }

        setSkills(response.data.rows)
      } catch (err) {
        console.error(err)
      }
    }
    fetchSkills()
  }, [navigate])

  return skills
}

export const useSkillRoutes = () => {
  const navigate = useNavigate()

  const createSkill = async (descriptions) => {
    if (!descriptions || descriptions.length === 0) {
      toast.error(
        'O campo "Descrição" não pode estar vazio para criar uma habilidade.'
      )
      return
    }

    const response = await api.post(
      `/habilidades`,
      descriptions.map((description) => ({ description }))
    )

    if (response.data.message) {
      if (response.data.error) toast.error(response.data.message)
      else toast.success(response.data.message)
    }

    handleNotAuthorized(response, navigate)
  }

  return { createSkill }
}
