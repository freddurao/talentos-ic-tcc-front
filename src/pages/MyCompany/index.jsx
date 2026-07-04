/* eslint-disable */
import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBuilding,
  faSave,
  faCheck,
  faTimes,
  faHourglassHalf,
  faUserPlus,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons'
import Layout from '../../components/Layout'
import Text from '../../components/Text'
import TextInput from '../../components/TextInput'
import { SelectBox } from '../../components/FormElements'
import useAuth from '../../hooks/useAuth'
import { useGetCompanies, useCompanyActions } from '../../hooks/companies'
import './styles.css'

function MyCompany() {
  const { user, loadToken } = useAuth()
  const { companies } = useGetCompanies()
  const {
    requestCompany,
    requestAssociation,
    getPendingAssociationRequests,
    approveAssociation,
    rejectAssociation,
    leaveCompany,
  } = useCompanyActions()

  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false)

  const handleLeaveCompanyClick = () => {
    setIsLeaveModalOpen(true)
  }

  const handleConfirmLeaveCompany = async () => {
    setIsLeaveModalOpen(false)
    const success = await leaveCompany()
    if (success) {
      await loadToken()
    }
  }

  // Creation form state
  const [creationForm, setCreationForm] = useState({
    name: '',
    cnpj: '',
    website: '',
    description: '',
    segment: '',
  })
  const [submittingCreation, setSubmittingCreation] = useState(false)

  // Association select state
  const [selectedCompanyId, setSelectedCompanyId] = useState('')
  const [submittingAssociation, setSubmittingAssociation] = useState(false)

  // Track dismissed rejected requests
  const [dismissedRequests, setDismissedRequests] = useState(() => {
    try {
      const saved = localStorage.getItem('@vagas/dismissed_requests')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const handleDismissRequest = (requestId) => {
    const updated = [...dismissedRequests, requestId]
    setDismissedRequests(updated)
    localStorage.setItem('@vagas/dismissed_requests', JSON.stringify(updated))
    window.dispatchEvent(new Event('dismiss_request_update'))
  }

  // Pending association requests for members of this company
  const [pendingAssociations, setPendingAssociations] = useState([])
  const [loadingAssociations, setLoadingAssociations] = useState(false)

  // Load pending association requests if user has a company
  const loadPendingAssociations = async () => {
    if (user && user.companyId) {
      setLoadingAssociations(true)
      const data = await getPendingAssociationRequests()
      setPendingAssociations(data)
      setLoadingAssociations(false)
    }
  }

  useEffect(() => {
    loadToken()
  }, [loadToken])

  useEffect(() => {
    loadPendingAssociations()
  }, [user && user.companyId])

  const handleCreationChange = (e) => {
    const { name, value } = e.target
    setCreationForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleCreateCompany = async (e) => {
    e.preventDefault()
    setSubmittingCreation(true)
    const success = await requestCompany(creationForm)
    if (success) {
      setCreationForm({
        name: '',
        cnpj: '',
        website: '',
        description: '',
        segment: '',
      })
      await loadToken()
    }
    setSubmittingCreation(false)
  }

  const handleRequestAssociation = async (e) => {
    e.preventDefault()
    if (!selectedCompanyId) return
    setSubmittingAssociation(true)
    const success = await requestAssociation(selectedCompanyId)
    if (success) {
      setSelectedCompanyId('')
      await loadToken()
    }
    setSubmittingAssociation(false)
  }

  const handleApproveAssociation = async (requestId) => {
    const success = await approveAssociation(requestId)
    if (success) {
      loadPendingAssociations()
    }
  }

  const handleRejectAssociation = async (requestId) => {
    const success = await rejectAssociation(requestId)
    if (success) {
      loadPendingAssociations()
    }
  }

  // Check if user has a pending request
  const pendingRequest =
    user &&
    user.companyRequests &&
    user.companyRequests.find((r) => r.status === 'PENDING')

  // Check if user has a rejected request
  const rejectedRequest =
    user &&
    user.companyRequests &&
    user.companyRequests.find(
      (r) => r.status === 'REJECTED' && !dismissedRequests.includes(r.id)
    )

  const renderPendingAssociationsList = () => {
    if (loadingAssociations) {
      return (
        <div className="has-text-centered py-4">
          <Text text="Carregando solicitações..." className="has-text-grey" />
        </div>
      )
    }
    if (pendingAssociations.length === 0) {
      return (
        <div className="has-text-centered py-5">
          <Text
            text="Nenhuma solicitação de associação pendente."
            className="has-text-grey"
          />
        </div>
      )
    }
    return (
      <table className="admin-table w-100">
        <thead>
          <tr>
            <th>Usuário Solicitante</th>
            <th>E-mail</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {pendingAssociations.map((req) => (
            <tr key={req.id}>
              <td>
                <Text text={req.user?.name} className="is-bold" />
              </td>
              <td>
                <Text text={req.user?.email} className="has-text-grey" />
              </td>
              <td>
                <div className="buttons are-small">
                  <button
                    type="button"
                    className="button is-success is-light"
                    onClick={() => handleApproveAssociation(req.id)}
                  >
                    <FontAwesomeIcon icon={faCheck} className="mr-1" /> Aprovar
                  </button>
                  <button
                    type="button"
                    className="button is-danger is-light"
                    onClick={() => handleRejectAssociation(req.id)}
                  >
                    <FontAwesomeIcon icon={faTimes} className="mr-1" /> Rejeitar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  // Render state 1: User belongs to a company
  const renderHasCompany = () => (
    <div className="my-company-view">
      <div className="card p-5 mb-5 border-radius-16 shadow-sm company-info-header">
        <div className="is-flex is-justify-content-between is-align-items-center mb-4">
          <div className="is-flex is-align-items-center">
            <div className="company-logo-avatar large mr-4">
              <FontAwesomeIcon
                icon={faBuilding}
                className="text-blue"
                size="2x"
              />
            </div>
            <div>
              <Text
                text={user.company?.name || 'Empresa'}
                size={24}
                className="is-bold-700 text-blue-strong"
              />
              <Text
                text="Sua empresa está vinculada e ativa no sistema."
                className="has-text-grey mt-1"
                size={14}
              />
            </div>
          </div>
        </div>

        <div className="columns is-multiline bg-light p-4 border-radius-12 mx-0">
          <div className="column is-4 mb-2">
            <Text text="CNPJ" size={11} className="is-bold-700 has-text-grey" />
            <Text
              text={user.company?.cnpj || '-'}
              size={15}
              className="is-bold-600 text-blue-strong"
            />
          </div>
          <div className="column is-4 mb-2">
            <Text
              text="WEBSITE"
              size={11}
              className="is-bold-700 has-text-grey"
            />
            {user.company?.website ? (
              <a
                href={user.company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="has-text-link is-bold-600 size-15"
              >
                {user.company.website}
              </a>
            ) : (
              <Text
                text="-"
                size={15}
                className="is-bold-600 text-blue-strong"
              />
            )}
          </div>
          <div className="column is-4 mb-2">
            <Text text="SETOR" size={11} className="is-bold-700 has-text-grey" />
            <Text
              text={user.company?.segment || 'Não informado'}
              size={15}
              className="is-bold-600 text-blue-strong"
            />
          </div>
          <div className="column is-12">
            <Text
              text="SOBRE A EMPRESA"
              size={11}
              className="is-bold-700 has-text-grey"
            />
            <Text
              text={user.company?.description || 'Nenhuma descrição adicionada.'}
              size={15}
              className="company-modal-description"
            />
          </div>
        </div>
      </div>

      {/* Pending requests to join this company */}
      <div className="card p-5 mb-5 border-radius-16 shadow-sm">
        <div className="mb-4">
          <Text
            text="Solicitações de Associação Pendentes"
            size={18}
            className="is-bold-700 text-blue-strong mb-1"
          />
          <Text
            text="Aprove novos membros do RH que desejam se associar à sua empresa."
            className="has-text-grey"
            size={14}
          />
        </div>

        {renderPendingAssociationsList()}
      </div>

      {/* Danger Zone: Leave Company */}
      <div className="card p-5 border-radius-16 shadow-sm border-danger-zone">
        <div className="is-flex is-flex-direction-column is-flex-direction-row-tablet is-justify-content-between is-align-items-start is-align-items-center-tablet gap-3">
          <div>
            <Text
              text="Zona de Perigo"
              size={18}
              className="is-bold-700 text-danger mb-1"
            />
            <Text
              text="Ao sair da empresa, você perderá acesso ao painel de controle e às vagas publicadas vinculadas a esta conta."
              className="has-text-grey"
              size={14}
            />
          </div>
          <button
            type="button"
            className="button is-danger is-outlined is-rounded font-weight-bold ml-auto-tablet"
            onClick={handleLeaveCompanyClick}
          >
            Sair da Empresa
          </button>
        </div>
      </div>
    </div>
  )

  // Render state 2: User has a pending request
  const renderPendingRequest = () => (
    <div className="card p-6 border-radius-16 shadow-sm has-text-centered max-width-600 mx-auto">
      <FontAwesomeIcon
        icon={faHourglassHalf}
        className="has-text-warning mb-4"
        size="3x"
      />
      <Text
        text="Solicitação Pendente"
        size={24}
        className="is-bold-700 text-blue-strong mb-2"
      />
      <Text
        text={`Você possui uma solicitação pendente para a empresa "${
          pendingRequest?.company?.name || 'Empresa'
        }".`}
        size={16}
        className="mb-4"
      />
      <Text
        text="Sua solicitação está sendo analisada. Por favor, aguarde a aprovação do administrador do sistema ou de um colaborador da empresa."
        className="has-text-grey"
        size={14}
      />
    </div>
  )

  // Render state 3: No company and no pending request
  const renderNoCompany = () => {
    const companyOptions = companies.map((c) => ({
      label: c.name,
      value: c.id,
    }))

    return (
      <div>
        {rejectedRequest && (
          <div className="notification is-danger is-light mb-5 border-radius-12 is-flex is-justify-content-between is-align-items-center p-4">
            <div>
              <strong>Solicitação Recusada:</strong> Sua solicitação para a empresa <strong>{rejectedRequest.company?.name || 'solicitada'}</strong> foi recusada pelo administrador do sistema.
            </div>
            <button
              type="button"
              className="delete"
              style={{ marginLeft: '15px' }}
              onClick={() => handleDismissRequest(rejectedRequest.id)}
            />
          </div>
        )}

        <div className="columns">
        {/* Request Association with existing company */}
        <div className="column is-6">
          <div className="card p-5 border-radius-16 shadow-sm h-100">
            <div className="mb-4 is-flex is-align-items-center">
              <div className="has-background-light p-3 border-radius-8 mr-3">
                <FontAwesomeIcon
                  icon={faUserPlus}
                  className="text-blue"
                  size="lg"
                />
              </div>
              <div>
                <Text
                  text="Associar-se a uma Empresa"
                  size={18}
                  className="is-bold-700 text-blue-strong mb-1"
                />
                <Text
                  text="Selecione uma empresa já ativa no sistema para solicitar seu vínculo."
                  className="has-text-grey"
                  size={13}
                />
              </div>
            </div>

            <form onSubmit={handleRequestAssociation} className="mt-5">
              <div className="field mb-5">
                <SelectBox
                  label="Selecione a Empresa"
                  labelLarge
                  initialOption="Escolha uma empresa..."
                  value={selectedCompanyId}
                  options={companyOptions}
                  onChange={(e) => setSelectedCompanyId(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className={`button bg-blue is-rounded is-fullwidth ${
                  submittingAssociation ? 'is-loading' : ''
                }`}
                disabled={!selectedCompanyId || submittingAssociation}
              >
                Solicitar Associação
              </button>
            </form>
          </div>
        </div>

        {/* Create new company */}
        <div className="column is-6">
          <div className="card p-5 border-radius-16 shadow-sm">
            <div className="mb-4 is-flex is-align-items-center">
              <div className="has-background-light p-3 border-radius-8 mr-3">
                <FontAwesomeIcon
                  icon={faBuilding}
                  className="text-blue"
                  size="lg"
                />
              </div>
              <div>
                <Text
                  text="Cadastrar Nova Empresa"
                  size={18}
                  className="is-bold-700 text-blue-strong mb-1"
                />
                <Text
                  text="Se sua empresa não estiver cadastrada, envie uma solicitação de criação."
                  className="has-text-grey"
                  size={13}
                />
              </div>
            </div>

            <form onSubmit={handleCreateCompany} className="mt-4">
              <div className="field mb-4">
                <TextInput
                  id="company-name"
                  label="Nome da Empresa"
                  placeholder="Ex: Tech Solutions LTDA"
                  value={creationForm.name}
                  setValue={(val) => setCreationForm((prev) => ({ ...prev, name: val }))}
                  required
                />
              </div>

              <div className="field mb-4">
                <TextInput
                  id="company-cnpj"
                  label="CNPJ"
                  placeholder="00.000.000/0000-00"
                  value={creationForm.cnpj}
                  setValue={(val) => setCreationForm((prev) => ({ ...prev, cnpj: val }))}
                  required
                />
              </div>

              <div className="field mb-4">
                <TextInput
                  id="company-website"
                  label="Website (Opcional)"
                  placeholder="https://www.empresa.com"
                  value={creationForm.website}
                  setValue={(val) => setCreationForm((prev) => ({ ...prev, website: val }))}
                />
              </div>

              <div className="field mb-4">
                <TextInput
                  id="company-segment"
                  label="Setor / Segmento de Atuação"
                  placeholder="Ex: Tecnologia da Informação, Logística, etc."
                  value={creationForm.segment}
                  setValue={(val) => setCreationForm((prev) => ({ ...prev, segment: val }))}
                  required
                />
              </div>

              <div className="field mb-5">
                <TextInput
                  id="company-description"
                  label="Descrição da Empresa"
                  multiline
                  placeholder="Descreva a atuação da empresa..."
                  value={creationForm.description}
                  setValue={(val) => setCreationForm((prev) => ({ ...prev, description: val }))}
                />
              </div>

              <button
                type="submit"
                className={`button bg-blue is-rounded is-fullwidth ${
                  submittingCreation ? 'is-loading' : ''
                }`}
                disabled={submittingCreation}
              >
                Enviar Solicitação
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

  const renderContent = () => {
    if (user && user.role === 'ADMIN') {
      return (
        <div className="card p-5 border-radius-16 shadow-sm has-text-centered max-width-600 mx-auto mt-6">
          <Text
            text="Acesso Restrito"
            size={24}
            className="is-bold-700 text-blue-strong mb-2"
          />
          <Text
            text="Administradores gerenciam o sistema globalmente e não podem se associar a empresas."
            size={16}
            className="mb-4 has-text-grey"
          />
        </div>
      )
    }
    if (user && user.companyId) {
      if (!user.company) {
        return (
          <div className="has-text-centered py-6">
            <Text text="Carregando informações da empresa..." className="has-text-grey" />
          </div>
        )
      }
      return renderHasCompany()
    }
    if (pendingRequest) {
      return renderPendingRequest()
    }
    return renderNoCompany()
  }

  return (
    <Layout>
      <div className="my-company-page-container">
        <div className="mb-5">
          <Text
            text="Minha Empresa"
            size={32}
            className="is-bold-700 text-blue-strong mb-1"
          />
          <Text
            text="Gerencie seu vínculo corporativo e as solicitações de novos colaboradores."
            className="has-text-grey"
            size={14}
          />
        </div>

        {renderContent()}

        {isLeaveModalOpen && (
          <div className="modal is-active">
            <div
              className="modal-background"
              onClick={() => setIsLeaveModalOpen(false)}
            />
            <div className="modal-card border-radius-16">
              <header className="modal-card-head has-background-danger px-5 py-4">
                <p className="modal-card-title has-text-white font-weight-bold">
                  Confirmar Desvinculação
                </p>
                <button
                  type="button"
                  className="delete"
                  aria-label="close"
                  onClick={() => setIsLeaveModalOpen(false)}
                />
              </header>
              <section className="modal-card-body p-5 has-text-centered">
                <FontAwesomeIcon
                  icon={faExclamationTriangle}
                  className="has-text-danger mb-3"
                  size="3x"
                />
                <div className="mb-2">
                  <Text
                    text="Atenção!"
                    size={20}
                    className="is-bold-700 text-blue-strong"
                  />
                </div>
                <Text
                  text="Tem certeza de que deseja se desvincular desta empresa? Você perderá o acesso ao painel corporativo e precisará solicitar um novo vínculo para retornar."
                  size={15}
                  className="has-text-grey"
                />
              </section>
              <footer className="modal-card-foot is-justify-content-flex-end py-3 px-5">
                <button
                  type="button"
                  className="button is-rounded is-light"
                  onClick={() => setIsLeaveModalOpen(false)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="button is-rounded is-danger font-weight-bold"
                  onClick={handleConfirmLeaveCompany}
                >
                  Confirmar Desvinculação
                </button>
              </footer>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default MyCompany
