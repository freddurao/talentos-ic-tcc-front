/* eslint-disable */
import React, { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { useGetJobById, useJobRoutes } from '../../hooks/jobs'
import Layout from '../../components/Layout'
import Text from '../../components/Text'
import { localDate, numberToReais } from '../../utils/conversions'
import {
  scholarityLabel,
  jobTypeLabel,
  filterLabel,
} from '../../utils/constants/project'
import ButtonRectangle from '../../components/Buttons/ButtonRectangle'
import './styles.css'
import { translate } from '../../utils/translations'
import ConfirmModal from '../../components/Modals/ConfirmModal'
import useAuth from '../../hooks/useAuth'
import { useGetAppliedJobs } from '../../hooks/user'
import ProfileCard from '../ProfilesList/ProfileCard'
import '../ProfilesList/style.css'
import '../ProfilesList/ProfileCard/style.css'

// Component that renders the page to see a job details or apply to it
function JobDetails() {
  const params = useParams()
  const navigate = useNavigate()

  const { userId, isAuthenticated } = useAuth()
  const { applyToJob } = useJobRoutes()
  const { job, user, userId: jobUserId, profiles } = useGetJobById(params.id)

  const { appliedJobs } = useGetAppliedJobs(userId)

  const [modalOpened, setModalOpened] = useState(false)
  const [errorModalOpened, setErrorModalOpened] = useState(false)

  const isJobApplied = useMemo(
    () =>
      appliedJobs.filter(({ jobId }) => jobId === params.id)
        .length > 0,
    [appliedJobs, params]
  )

  const isOwnJob = useMemo(
    () => jobUserId && userId === jobUserId,
    [userId, jobUserId]
  )

  const onApplyToJob = async () => {
    await applyToJob(params.id, userId).then(
      (res) => {
        const hasError = res.error || res.status === 'fail';
        const isEmptyProfile = res.emptyProfile || (res.error && res.error.emptyProfile);
        
        if (!hasError) navigate('/minhasvagas')
        else {
          setModalOpened(false)
          if (isEmptyProfile) {
            setErrorModalOpened(true)
          }
        }
      }
    )
  }

  const renderDetailItem = (
    title,
    description,
    className = 'side-detail-item',
    descriptionSize = 16
  ) => (
    <div className={className}>
      <Text className="is-bold" text={title} size={18} />
      <Text text={description} size={descriptionSize} />
    </div>
  )

  const getBtnJobTranslation = () => {
    if (isOwnJob) return 'is_own_job'
    return isJobApplied ? 'job_applied' : 'apply_to_job'
  }

  return (
    <Layout>
      <ConfirmModal
        title="Aplicar para Vaga"
        description={`Deseja realmente aplicar para a vaga "${
          job && job.title
        }"?`}
        onConfirm={() => onApplyToJob()}
        onCancel={() => setModalOpened(false)}
        opened={modalOpened}
      />
      {/* Modal de Perfil Incompleto (Estilo Admin) */}
      <div className={`modal ${errorModalOpened ? 'is-active' : ''}`}>
        <div 
          className="modal-background" 
          onClick={() => setErrorModalOpened(false)} 
        />
        <div className="modal-card" style={{ width: '500px', maxWidth: '90%' }}>
          <header className="modal-card-head" style={{ backgroundColor: '#203e81' }}>
            <p className="modal-card-title has-text-white">Perfil Incompleto</p>
            <button
              className="delete"
              aria-label="close"
              onClick={() => setErrorModalOpened(false)}
            />
          </header>
          <section className="modal-card-body p-5">
            <div className="has-text-centered mb-4">
               <Text 
                className="is-bold is-blue" 
                text="Quase lá!" 
                size={22} 
              />
            </div>
            <Text 
              text="Para se candidatar a uma vaga, você precisa ter um perfil cadastrado no sistema. Isso ajuda os recrutadores a conhecerem melhor suas habilidades." 
              size={16} 
            />
            <div className="mt-4">
              <Text 
                className="is-bold" 
                text="Deseja completar seu perfil agora?" 
                size={16} 
              />
            </div>
          </section>
          <footer className="modal-card-foot is-justify-content-flex-end">
            <ButtonRectangle
              className="is-blue"
              label="Depois"
              onClick={() => setErrorModalOpened(false)}
            />
            <ButtonRectangle
              className="is-green"
              label="Completar Perfil"
              onClick={() => navigate('/editardados')}
            />
          </footer>
        </div>
      </div>
      <div className="job-details">
        <div className="card detail-card">
          {job ? (
            <>
              <div className="detail-top-container">
                <div>
                  <div className="is-flex is-align-items-center">
                    <Text
                      className="is-blue is-bold"
                      text={job.title}
                      size={24}
                    />
                    {job.companyId && (
                      <span className="tag is-success is-light font-weight-bold ml-3 py-2 px-3 border-radius-8" style={{ fontSize: '13px', display: 'inline-flex', alignItems: 'center' }}>
                        <FontAwesomeIcon icon={faCheckCircle} className="mr-1 text-success" /> Vaga Oficial - {job.company?.name}
                      </span>
                    )}
                  </div>
                </div>
                <div className="description-top-container">
                  <div className="detail-menu">
                    {job.company && renderDetailItem(
                      'Empresa',
                      job.company.name
                    )}
                    {renderDetailItem(
                      'Período da Candidatura',
                      `${localDate(job.createdAt)} - ${localDate(
                        job.endingDate
                      )}`
                    )}
                    {renderDetailItem(
                      'Início do Trabalho',
                      `${localDate(job.startingDate)}`
                    )}
                    {renderDetailItem(
                      'Tipo de Vaga',
                      `${jobTypeLabel[job.type]}`
                    )}
                    {renderDetailItem('Carga horária', `${job.workload} horas`)}
                    {renderDetailItem(
                      filterLabel.salary,
                      `${numberToReais(job.salary)}`
                    )}
                    {renderDetailItem('Localidade', `${job.site}`)}
                    {renderDetailItem(
                      'Escolaridade',
                      `${scholarityLabel[job.scholarity]}`,
                      ''
                    )}
                  </div>
                  <div className="job-description">
                    <Text
                      className="is-blue is-bold"
                      text="Descrição da vaga"
                      size={20}
                    />
                    <Text
                      className="description-container"
                      text={job.description}
                      size={18}
                    />
                  </div>
                </div>
              </div>
              <div>
                <div>
                  <Text className="is-blue is-bold" text="Contato" size={20} />
                </div>
                <div className="bottom-details">
                  {user && renderDetailItem(
                    'Nome do responsável pela vaga',
                    user.name,
                    'bottom-detail-item',
                    18
                  )}
                  {user && renderDetailItem('E-mail', user.email, '', 18)}
                  <div className="btn-apply-container">
                    <ButtonRectangle
                      className="is-green"
                      label={translate(getBtnJobTranslation())}
                      onClick={() => {
                        if (isAuthenticated) setModalOpened(true)
                        else navigate(`/login?vaga=${params.id}`)
                      }}
                      disabled={isOwnJob || isJobApplied}
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <Text
              className="is-bold is-blue"
              text={
                params.id
                  ? 'Carregando detalhes da vaga...'
                  : 'Essa vaga não existe!'
              }
              size={24}
            />
          )}
        </div>
      </div>
      <section id="main">
        <div id="label">
          <span>Perfis recomendados</span>
        </div>

        <div id="profiles">
          <div className="wrap">
            {profiles?.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default JobDetails
