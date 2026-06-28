/* eslint-disable */
import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBuilding,
  faSearch,
  faMapMarkerAlt,
  faGlobe,
  faInfoCircle,
  faBriefcase,
  faUserPlus,
  faFilter,
} from '@fortawesome/free-solid-svg-icons'
import Layout from '../../components/Layout'
import Text from '../../components/Text'
import TextInput from '../../components/TextInput'
import { useGetCompanies, useCompanyActions } from '../../hooks/companies'
import useAuth from '../../hooks/useAuth'
import api from '../../api'
import { toast } from 'react-toastify'
import { useJobRoutes } from '../../hooks/jobs'
import { useGetAppliedJobs } from '../../hooks/user'
import './styles.css'

function CompaniesList() {
  const navigate = useNavigate()
  const { userId, isAuthenticated, user } = useAuth()
  const { companies, loading, refresh } = useGetCompanies()
  const { requestAssociation } = useCompanyActions()
  const { applyToJob } = useJobRoutes()
  const { appliedJobs, getAppliedJobs } = useGetAppliedJobs(userId)

  // Filters state
  const [globalSearch, setGlobalSearch] = useState('')
  const [filterName, setFilterName] = useState('')
  const [filterSegment, setFilterSegment] = useState('')

  // Search parameters applied to the list
  const [searchParams, setSearchParams] = useState({
    global: '',
    name: '',
    segment: '',
  })

  // Selected company for modals
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isJobsModalOpen, setIsJobsModalOpen] = useState(false)

  // Jobs state for the selected company
  const [companyJobs, setCompanyJobs] = useState([])
  const [loadingJobs, setLoadingJobs] = useState(false)

  const handleSearch = () => {
    setSearchParams({
      global: globalSearch,
      name: filterName,
      segment: filterSegment,
    })
  }

  const handleClearFilters = () => {
    setGlobalSearch('')
    setFilterName('')
    setFilterSegment('')
    setSearchParams({
      global: '',
      name: '',
      segment: '',
    })
  }

  // Filter approved companies locally based on applied search parameters
  const filteredCompanies = useMemo(() => {
    return companies.filter((c) => {
      const cName = c.name || ''
      const cDesc = c.description || ''
      const cWeb = c.website || ''
      const cSeg = c.segment || ''

      const nameMatch = cName
        .toLowerCase()
        .includes(searchParams.name.toLowerCase())
      const descMatch = cDesc
        .toLowerCase()
        .includes(searchParams.segment.toLowerCase())
      const segmentMatch = cSeg
        .toLowerCase()
        .includes(searchParams.segment.toLowerCase())
      const websiteMatch = cWeb
        .toLowerCase()
        .includes(searchParams.segment.toLowerCase())

      const globalMatch =
        !searchParams.global ||
        cName.toLowerCase().includes(searchParams.global.toLowerCase()) ||
        cDesc.toLowerCase().includes(searchParams.global.toLowerCase()) ||
        cSeg.toLowerCase().includes(searchParams.global.toLowerCase())

      return (
        nameMatch && (descMatch || websiteMatch || segmentMatch) && globalMatch
      )
    })
  }, [companies, searchParams])

  // Fetch company jobs when the jobs modal is opened
  const fetchCompanyJobs = async (companyId) => {
    setLoadingJobs(true)
    try {
      const response = await api.get(`/vagas?companyId=${companyId}`)
      if (response.data && response.data.rows) {
        setCompanyJobs(response.data.rows)
      } else {
        setCompanyJobs([])
      }
    } catch (err) {
      console.error(err)
      toast.error('Erro ao carregar vagas da empresa.')
    } finally {
      setLoadingJobs(false)
    }
  }

  const openJobsModal = (company) => {
    setSelectedCompany(company)
    setIsJobsModalOpen(true)
    fetchCompanyJobs(company.id)
  }

  const openProfileModal = (company) => {
    setSelectedCompany(company)
    setIsProfileModalOpen(true)
  }

  const handleApply = async (jobId) => {
    if (!isAuthenticated) {
      toast.error('Você precisa estar logado para se candidatar.')
      return
    }
    const res = await applyToJob(jobId, userId)
    if (res && !res.error) {
      toast.success('Candidatura realizada com sucesso!')
      if (getAppliedJobs) getAppliedJobs()
      if (selectedCompany) fetchCompanyJobs(selectedCompany.id)
    }
  }

  const handleRequestAssociation = async (companyId) => {
    if (!isAuthenticated) {
      toast.error('Você precisa fazer login para se associar a uma empresa.')
      return
    }
    if (user?.role === 'ADMIN') {
      toast.error('Administradores não podem se associar a empresas.')
      return
    }
    const success = await requestAssociation(companyId)
    if (success) {
      refresh()
    }
  }

  return (
    <Layout>
      <div className="companies-page-container">
        {isAuthenticated && !user?.companyId && user?.role !== 'ADMIN' && (
          <div className="is-flex is-justify-content-flex-end mb-4">
            <button
              type="button"
              className="button bg-blue is-rounded font-weight-bold"
              onClick={() => navigate('/cadastrar-empresa')}
            >
              <FontAwesomeIcon icon={faBuilding} className="mr-2" />
              Cadastrar Nova Empresa
            </button>
          </div>
        )}

        {/* Search header card */}
        <div className="card mb-5 p-4 border-radius-16 companies-search-header-card">
          <div className="columns is-vcentered">
            <div className="column is-4-desktop is-12-tablet">
              <div className="control has-icons-left">
                <input
                  className="input is-rounded"
                  type="text"
                  placeholder="Nome da empresa..."
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <span className="icon is-left">
                  <FontAwesomeIcon icon={faSearch} />
                </span>
              </div>
            </div>
            <div className="column is-4-desktop is-12-tablet">
              <div className="control has-icons-left">
                <input
                  className="input is-rounded"
                  type="text"
                  placeholder="Segmento ou setor..."
                  value={filterSegment}
                  onChange={(e) => setFilterSegment(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <span className="icon is-left">
                  <FontAwesomeIcon icon={faGlobe} />
                </span>
              </div>
            </div>
            <div className="column is-4-desktop is-12-tablet is-flex is-justify-content-space-between" style={{ gap: '10px' }}>
              <button
                type="button"
                className="button bg-blue is-rounded is-flex-grow-1 font-weight-bold"
                onClick={handleSearch}
              >
                Buscar
              </button>
              <button
                type="button"
                className="button is-light is-rounded font-weight-bold"
                onClick={handleClearFilters}
              >
                Limpar
              </button>
            </div>
          </div>
        </div>

        <div className="columns">
          {/* Companies List */}
          <div className="column is-12">
            <div className="mb-4 is-flex is-justify-content-between is-align-items-center">
              <Text
                text={`Empresas (${filteredCompanies.length} resultados)`}
                size={18}
                className="is-bold-700 text-blue-strong"
              />
            </div>

            {loading ? (
              <div className="has-text-centered py-6">
                <Text text="Carregando empresas..." className="has-text-grey" />
              </div>
            ) : filteredCompanies.length === 0 ? (
              <div className="card p-6 border-radius-16 has-text-centered">
                <FontAwesomeIcon
                  icon={faBuilding}
                  size="3x"
                  className="has-text-grey-light mb-3"
                />
                <Text
                  text="Nenhuma empresa aprovada encontrada."
                  className="has-text-grey"
                />
              </div>
            ) : (
              <div className="companies-list-grid">
                {filteredCompanies.map((company) => (
                  <div
                    key={company.id}
                    className="company-item-card card"
                  >
                    <div>
                      {/* Header */}
                      <div className="company-card-header">
                        <div className="company-logo-avatar mr-3">
                          <FontAwesomeIcon
                            icon={faBuilding}
                            className="text-blue"
                            size="lg"
                          />
                        </div>
                        <Text
                          text={company.name}
                          size={18}
                          className="is-bold-700 text-blue-strong"
                        />
                      </div>

                      {/* Body */}
                      <div className="company-card-body">
                        <p className="company-card-description">
                          {company.description || 'Nenhuma descrição detalhada disponível.'}
                        </p>

                        {company.website && (
                          <div className="size-13 is-flex is-align-items-center mt-2">
                            <FontAwesomeIcon icon={faGlobe} className="mr-2 text-blue" />
                            <a
                              href={
                                company.website.indexOf('http') === 0
                                  ? company.website
                                  : `https://${company.website}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="has-text-link font-weight-bold"
                            >
                              {company.website}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions Footer */}
                    <div className="company-card-footer">
                      <div className="company-actions-row">
                        <button
                          type="button"
                          className="button bg-blue has-text-white"
                          onClick={() => openJobsModal(company)}
                        >
                          <FontAwesomeIcon icon={faBriefcase} className="mr-1" /> Vagas
                        </button>
                        <button
                          type="button"
                          className="button is-outlined border-blue text-blue"
                          onClick={() => openProfileModal(company)}
                        >
                          <FontAwesomeIcon icon={faInfoCircle} className="mr-1" /> Perfil
                        </button>
                        {isAuthenticated && user?.role !== 'ADMIN' && (
                          <button
                            type="button"
                            className="button is-light text-blue"
                            onClick={() => handleRequestAssociation(company.id)}
                            style={{ flex: '1.5' }}
                          >
                            <FontAwesomeIcon icon={faUserPlus} className="mr-1" /> Associar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Profile */}
      {isProfileModalOpen && selectedCompany && (
        <div className="modal is-active">
          <div
            className="modal-background"
            onClick={() => setIsProfileModalOpen(false)}
          />
          <div className="modal-card border-radius-16">
            <header className="modal-card-head header-blue px-5 py-4">
              <p className="modal-card-title has-text-white font-weight-bold">
                Perfil da Empresa - {selectedCompany.name}
              </p>
              <button
                type="button"
                className="delete"
                aria-label="close"
                onClick={() => setIsProfileModalOpen(false)}
              />
            </header>
            <section className="modal-card-body p-5">
              <div className="is-flex is-align-items-center mb-5">
                <div className="company-logo-avatar large mr-4">
                  <FontAwesomeIcon
                    icon={faBuilding}
                    className="text-blue"
                    size="2x"
                  />
                </div>
                <div>
                  <Text
                    text={selectedCompany.name}
                    size={22}
                    className="is-bold-700 text-blue-strong"
                  />
                </div>
              </div>

              <div className="mb-5">
                <Text
                  text="SOBRE A EMPRESA"
                  size={12}
                  className="is-bold-700 has-text-grey mb-2"
                />
                <p className="company-modal-description size-15">
                  {selectedCompany.description ||
                    'Nenhuma descrição detalhada disponível para esta empresa no momento.'}
                </p>
              </div>

              <div className="columns is-multiline bg-light p-4 border-radius-12 mx-0 mt-4">
                <div className="column is-6 py-1">
                  <Text
                    text="SETOR"
                    size={11}
                    className="is-bold-700 has-text-grey"
                  />
                  <Text
                    text={selectedCompany.segment || 'Não informado'}
                    size={14}
                    className="is-bold-600 text-blue-strong mt-1"
                  />
                </div>
                <div className="column is-6 py-1">
                  <Text
                    text="SITE"
                    size={11}
                    className="is-bold-700 has-text-grey"
                  />
                  <div className="mt-1">
                    {selectedCompany.website ? (
                      <a
                        href={
                          selectedCompany.website.indexOf('http') === 0
                            ? selectedCompany.website
                            : `https://${selectedCompany.website}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="has-text-link is-bold-600 size-14"
                      >
                        <FontAwesomeIcon icon={faGlobe} className="mr-1" />
                        {selectedCompany.website}
                      </a>
                    ) : (
                      <Text
                        text="Não informado"
                        size={14}
                        className="is-bold-600 text-blue-strong"
                      />
                    )}
                  </div>
                </div>
              </div>
            </section>
            <footer className="modal-card-foot is-justify-content-flex-end py-3 px-5">
              <button
                type="button"
                className="button border-blue text-blue is-rounded"
                onClick={() => setIsProfileModalOpen(false)}
              >
                Fechar
              </button>
            </footer>
          </div>
        </div>
      )}

      {/* Modal Jobs */}
      {isJobsModalOpen && selectedCompany && (
        <div className="modal is-active">
          <div
            className="modal-background"
            onClick={() => setIsJobsModalOpen(false)}
          />
          <div className="modal-card border-radius-16">
            <header className="modal-card-head header-blue px-5 py-4">
              <p className="modal-card-title has-text-white font-weight-bold">
                Vagas em aberto - {selectedCompany.name}
              </p>
              <button
                type="button"
                className="delete"
                aria-label="close"
                onClick={() => setIsJobsModalOpen(false)}
              />
            </header>
            <section className="modal-card-body p-5">
              {loadingJobs ? (
                <div className="has-text-centered py-5">
                  <Text text="Carregando vagas..." className="has-text-grey" />
                </div>
              ) : companyJobs.length === 0 ? (
                <div className="has-text-centered py-5">
                  <FontAwesomeIcon
                    icon={faInfoCircle}
                    className="has-text-grey mb-3"
                    size="2x"
                  />
                  <Text
                    text="Nenhuma vaga aberta publicada por esta empresa no momento."
                    className="has-text-grey"
                  />
                </div>
              ) : (
                <div className="modal-jobs-list">
                  {companyJobs.map((job) => {
                    const isApplied =
                      appliedJobs &&
                      appliedJobs.some(({ jobId }) => jobId === job.id)
                    return (
                      <div
                        key={job.id}
                        className="job-item-modal card p-4 mb-3 border-radius-12 border-light"
                      >
                        <div className="is-flex is-justify-content-between is-align-items-center">
                          <div>
                            <Text
                              text={job.title}
                              size={16}
                              className="is-bold-700 text-blue-strong mb-1"
                            />
                            <div className="has-text-grey size-13">
                              <span className="mr-3">
                                <FontAwesomeIcon
                                  icon={faMapMarkerAlt}
                                  className="mr-1"
                                />
                                {job.site || 'Remoto'}
                              </span>
                              <span>• {job.type || 'CLT'}</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            className={`button is-rounded btn-modal-apply ${
                              isApplied
                                ? 'is-success is-light'
                                : 'bg-blue has-text-white'
                            }`}
                            onClick={() => !isApplied && handleApply(job.id)}
                            disabled={isApplied}
                          >
                            {isApplied ? 'Candidatado' : 'Candidatar-se'}
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </section>
            <footer className="modal-card-foot is-justify-content-flex-end py-3 px-5">
              <button
                type="button"
                className="button border-blue text-blue is-rounded"
                onClick={() => setIsJobsModalOpen(false)}
              >
                Fechar
              </button>
            </footer>
          </div>
        </div>
      )}
    </Layout>
  )
}

export default CompaniesList
