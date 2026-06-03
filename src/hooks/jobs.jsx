/* eslint-disable import/prefer-default-export */
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../api'
import { handleNotAuthorized } from '../utils/requests'

export const useGetJobById = (id) => {
  const [job, setJob] = useState()
  const [user, setUser] = useState()
  const [jobId, setJobId] = useState()
  const [userId, setUserId] = useState()
  const [profiles, setProfiles] = useState()

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return
      try {
        const response = await api.get(`/vagas/${id}`)

        if (response.data.message && response.data.error) {
          toast.error(response.data.message)
          return
        }

        setJob(response.data.job)
        setUser(response.data.user)
        setJobId(response.data.jobId)
        setUserId(response.data.userId)
        setProfiles(response.data.recmd_profiles)
      } catch (err) {
        console.error(err)
      }
    }
    fetchJob()
  }, [id])

  return { job, user, jobId, userId, profiles }
}

export const useJobRoutes = () => {
  const navigate = useNavigate()

  const createJob = async (
    description,
    scholarity,
    title,
    type,
    site,
    workload,
    salary,
    endingDate,
    startingDate,
    userId,
    emailsToSend
  ) => {
    if (startingDate === undefined || endingDate === undefined)
      toast.error('Os campos "Inicio" e "Fim" não podem estar vazio.')

    const response = await api.post(`/vagas`, {
      description,
      scholarity,
      title,
      type,
      site,
      workload,
      salary,
      endingDate,
      startingDate,
      userId,
      emailsToSend,
    })

    if (response.data.message) {
      if (response.data.error) toast.error(response.data.message)
      else toast.success(response.data.message)
    }

    handleNotAuthorized(response, navigate)
  }

  const updateJob = async (
    jobId,
    description,
    scholarity,
    title,
    type,
    site,
    workload,
    salary,
    endingDate,
    startingDate,
    userId
  ) => {
    if (startingDate === undefined || endingDate === undefined)
      toast.error('Os campos "Inicio" e "Fim" não podem estar vazio.')

    const response = await api.patch(`/vagas/${jobId}`, {
      description,
      scholarity,
      title,
      type,
      site,
      workload,
      salary,
      endingDate,
      startingDate,
      userId,
    })

    if (response.data.message) {
      if (response.data.error) toast.error(response.data.message)
      else toast.success(response.data.message)
    }

    handleNotAuthorized(response, navigate)
  }

  const deleteJob = async (id) => {
    const response = await api.delete(`/vagas/${id}`)

    if (response.data.message) {
      if (response.data.error) toast.error(response.data.message)
      else toast.success(response.data.message)
    }

    handleNotAuthorized(response, navigate)
  }

  const applyToJob = async (jobId, userId) => {
    const response = await api.post('/vagas/aplicacao', {
      jobId,
      userId,
    })

    if (response.data.message) {
      if (response.data.error) toast.error(response.data.message)
      else toast.success(response.data.message)
    }

    handleNotAuthorized(response, navigate)

    return response.data
  }

  const feedbackJobs = async (jobId, status) => {
    const response = await api.put(`/vagas/${jobId}`, {
      status,
    })

    if (response.data.message) {
      if (response.data.error) toast.error(response.data.message)
      else toast.success(response.data.message)
    }
  }

  return { createJob, updateJob, deleteJob, applyToJob, feedbackJobs }
}

export const getFeedbackStatus = (id) => {
  const [status, setStatus] = useState('')

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await api.get(`/vagas/feedback/${id}`)
        if (response.data.error && response.data.message) {
          toast.error(response.data.message)
          return
        }
        setStatus(response.data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchFeedback()
  }, [id])
  return status
}

export const useGetJobs = (pageNumber, itemsPerPage, filters) => {
  const [jobs, setJobs] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [count, setCount] = useState(0)

  // Use JSON.stringify for deep comparison in dependency array
  const filtersString = JSON.stringify(filters)

  useEffect(() => {
    const fetchJobs = async () => {
      const buildQuery = () => {
        const query = []
        query.push(`pageNumber=${pageNumber}`)
        query.push(`itemsPerPage=${itemsPerPage}`)
        Object.keys(filters).forEach((field) => {
          if (field === 'salary') {
            query.push(`min=${filters[field].min}`)
            query.push(`max=${filters[field].max}`)
          } else if (field === 'workload') {
            query.push(`chmin=${filters[field].min}`)
            query.push(`chmax=${filters[field].max}`)
          } else if (filters[field]) query.push(`${field}=${filters[field]}`)
        })
        return query.join('&')
      }

      try {
        const response = await api.get(`/vagas?${buildQuery()}`)

        if (response.data.error && response.data.message) {
          toast.error(response.data.message)
          return
        }

        setJobs(response.data.rows)
        setCount(response.data.count)
        setTotalPages(Math.ceil(response.data.count / itemsPerPage))
      } catch (err) {
        console.error(err)
      }
    }
    fetchJobs()
  }, [pageNumber, itemsPerPage, filtersString])

  return { jobs, totalPages, count }
}
