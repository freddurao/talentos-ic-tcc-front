import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faSearch,
  faEye,
  faEdit,
  faCheckCircle,
  faTimesCircle,
  faChartLine,
  faChevronLeft,
  faChevronRight,
  faBuilding,
  faCalendarAlt,
  faClock,
  faMoneyBillWave,
  faGraduationCap,
  faMapMarkerAlt,
} from '@fortawesome/free-solid-svg-icons'
import Text from '../../../components/Text'
import TextInput from '../../../components/TextInput'
import { useGetJobs } from '../../../hooks/jobs'
import { localDate, numberToReais } from '../../../utils/conversions'
import {
  jobTypeLabel,
  scholarityLabel,
} from '../../../utils/constants/project'

function MonitorJobs() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [pageNumber, setPageNumber] = useState(1)
  const [viewModal, setViewModal] = useState({ opened: false, job: null })

  // Using real hook for jobs
  const { jobs, totalPages, count } = useGetJobs(pageNumber, 10, {
    filter: searchTerm,
  })

  const handleViewClick = (job) => {
    setViewModal({ opened: true, job })
  }

  const renderDetailRow = (icon, label, value) => (
    <div className="is-flex is-align-items-center mb-3">
      <div
        className="has-background-light p-2 border-radius-8 mr-3"
        style={{ width: '40px', textAlign: 'center' }}
      >
        <FontAwesomeIcon icon={icon} className="has-text-grey" />
      </div>
      <div>
        <Text text={label} size={12} className="has-text-grey" />
        <Text text={value || 'Não informado'} size={14} className="is-bold" />
      </div>
    </div>
  )

  return (
    <div className="monitor-jobs">
      {/* View Job Modal */}
      <div className={`modal ${viewModal.opened ? 'is-active' : ''}`}>
        <div
          className="modal-background"
          onClick={() => setViewModal({ opened: false, job: null })}
        />
        <div className="modal-card" style={{ width: '700px', maxWidth: '90%' }}>
          <header className="modal-card-head bg-blue">
            <p className="modal-card-title has-text-white">Detalhes da Vaga</p>
            <button
              type="button"
              className="delete"
              aria-label="close"
              onClick={() => setViewModal({ opened: false, job: null })}
            />
          </header>
          <section className="modal-card-body p-5">
            {viewModal.job && (
              <>
                <div className="mb-5">
                  <Text
                    text={viewModal.job.title}
                    size={24}
                    className="is-bold text-blue-strong mb-2"
                  />
                  <span className="status-badge status-active">
                    Vaga Ativa
                  </span>
                </div>

                <div className="columns is-multiline">
                  <div className="column is-6">
                    {renderDetailRow(
                      faBuilding,
                      'Empresa',
                      viewModal.job.company?.name || 'Não vinculada'
                    )}
                    {renderDetailRow(
                      faCalendarAlt,
                      'Data de Publicação',
                      localDate(viewModal.job.createdAt)
                    )}
                    {renderDetailRow(
                      faCalendarAlt,
                      'Encerramento',
                      localDate(viewModal.job.endingDate)
                    )}
                  </div>
                  <div className="column is-6">
                    {renderDetailRow(
                      faClock,
                      'Tipo / Carga Horária',
                      `${jobTypeLabel[viewModal.job.type] || 'Padrão'} - ${
                        viewModal.job.workload
                      }h/semana`
                    )}
                    {renderDetailRow(
                      faMoneyBillWave,
                      'Remuneração',
                      numberToReais(viewModal.job.salary)
                    )}
                    {renderDetailRow(
                      faGraduationCap,
                      'Escolaridade Mínima',
                      scholarityLabel[viewModal.job.scholarity]
                    )}
                  </div>
                </div>

                <hr className="my-4" />

                <div className="mb-4">
                  <div className="is-flex is-align-items-center mb-2">
                    <FontAwesomeIcon
                      icon={faMapMarkerAlt}
                      className="has-text-grey mr-2"
                    />
                    <Text text="Localidade:" size={14} className="is-bold" />
                    <Text
                      text={viewModal.job.site}
                      size={14}
                      className="ml-2"
                    />
                  </div>
                </div>

                <div>
                  <Text
                    text="Descrição da Vaga"
                    size={16}
                    className="is-bold mb-2"
                  />
                  <div
                    className="has-background-light p-4 border-radius-12"
                    style={{ maxHeight: '200px', overflowY: 'auto' }}
                  >
                    <Text text={viewModal.job.description} size={14} />
                  </div>
                </div>
              </>
            )}
          </section>
          <footer className="modal-card-foot is-justify-content-flex-end">
            <button
              type="button"
              className="button is-link"
              onClick={() => {
                const id = viewModal.job?.id
                setViewModal({ opened: false, job: null })
                navigate(`/formulariovaga/editar/${id}`)
              }}
            >
              <FontAwesomeIcon icon={faEdit} className="mr-2" />
              Editar Vaga
            </button>
            <button
              type="button"
              className="button"
              onClick={() => setViewModal({ opened: false, job: null })}
            >
              Fechar
            </button>
          </footer>
        </div>
      </div>

      <div className="mb-4">
        <Text
          text="Monitorar Vagas"
          size={32}
          className="is-bold-700 text-blue-strong mb-1"
        />
        <Text
          text="Acompanhe o desempenho, status e moderação de todas as oportunidades publicadas."
          className="has-text-grey"
          size={14}
        />
      </div>

      {/* Summary Cards - Compact and Horizontal */}
      <div className="columns is-multiline mb-4">
        <div className="column is-4">
          <div className="card p-3 has-background-white is-flex is-align-items-center border-radius-12 shadow-sm">
            <div className="has-background-link-light p-2 border-radius-8 mr-3">
              <FontAwesomeIcon
                icon={faChartLine}
                className="has-text-link is-size-5"
              />
            </div>
            <div className="is-flex is-align-items-center">
              <Text text="Total:" size={14} className="has-text-grey mr-2" />
              <Text text={count.toString()} size={18} className="is-bold" />
            </div>
          </div>
        </div>
        <div className="column is-4">
          <div className="card p-3 has-background-white is-flex is-align-items-center border-radius-12 shadow-sm">
            <div className="has-background-success-light p-2 border-radius-8 mr-3">
              <FontAwesomeIcon
                icon={faCheckCircle}
                className="has-text-success is-size-5"
              />
            </div>
            <div className="is-flex is-align-items-center">
              <Text text="Ativas:" size={14} className="has-text-grey mr-2" />
              <Text
                text={jobs.length.toString()}
                size={18}
                className="is-bold"
              />
            </div>
          </div>
        </div>
        <div className="column is-4">
          <div className="card p-3 has-background-white is-flex is-align-items-center border-radius-12 shadow-sm">
            <div className="has-background-danger-light p-2 border-radius-8 mr-3">
              <FontAwesomeIcon
                icon={faTimesCircle}
                className="has-text-danger is-size-5"
              />
            </div>
            <div className="is-flex is-align-items-center">
              <Text text="Outras:" size={14} className="has-text-grey mr-2" />
              <Text
                text={(count - jobs.length).toString()}
                size={18}
                className="is-bold"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="is-flex is-justify-content-space-between is-align-items-center mb-4">
        <div style={{ width: '450px' }}>
          <TextInput
            className="dashboard-search"
            placeholder="Pesquisar por título ou empresa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={faSearch}
          />
        </div>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Título da Vaga</th>
            <th>Empresa</th>
            <th>Tipo</th>
            <th>Data</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id}>
              <td>
                <Text text={job.title} className="is-bold" />
              </td>
              <td>
                <Text text={job.company?.name || 'Não vinculada'} />
              </td>
              <td>
                <Text text={jobTypeLabel[job.type] || 'Padrão'} />
              </td>
              <td>
                <Text text={localDate(job.createdAt) || '-'} />
              </td>
              <td>
                <div className="buttons are-small">
                  <button
                    type="button"
                    className="button is-white has-text-info"
                    title="Visualizar"
                    onClick={() => handleViewClick(job)}
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                  <button
                    type="button"
                    className="button is-white has-text-warning"
                    title="Editar"
                    onClick={() => navigate(`/formulariovaga/editar/${job.id}`)}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination-container mt-6">
        <div className="is-flex is-align-items-center has-text-grey">
          <Text text={`Página ${pageNumber} de ${totalPages}`} size={14} />
        </div>
        <div className="pagination-buttons">
          <button
            type="button"
            className={`pagination-btn ${pageNumber === 1 ? 'disabled' : ''}`}
            onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
            disabled={pageNumber === 1}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <button type="button" className="pagination-btn active">
            {pageNumber}
          </button>
          <button
            type="button"
            className={`pagination-btn ${
              pageNumber >= totalPages ? 'disabled' : ''
            }`}
            onClick={() => setPageNumber((p) => Math.min(totalPages, p + 1))}
            disabled={pageNumber >= totalPages}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default MonitorJobs
