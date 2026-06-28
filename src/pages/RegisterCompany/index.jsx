/* eslint-disable */
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBuilding,
  faIdCard,
  faGlobe,
  faSave,
  faHourglassHalf,
} from '@fortawesome/free-solid-svg-icons'
import Layout from '../../components/Layout'
import Text from '../../components/Text'
import TextInput from '../../components/TextInput'
import useAuth from '../../hooks/useAuth'
import { useCompanyActions } from '../../hooks/companies'
import './styles.css'

function RegisterCompany() {
  const navigate = useNavigate()
  const { user, loadToken } = useAuth()
  const { requestCompany } = useCompanyActions()

  const [formData, setFormData] = useState({
    name: '',
    cnpj: '',
    website: '',
    description: '',
    segment: '',
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const success = await requestCompany(formData)
    if (success) {
      setFormData({
        name: '',
        cnpj: '',
        website: '',
        description: '',
        segment: '',
      })
      await loadToken()
      navigate('/empresas')
    }
    setLoading(false)
  }

  // Check if user has a pending request
  const pendingRequest =
    user &&
    user.companyRequests &&
    user.companyRequests.find((r) => r.status === 'PENDING')

  // Render pending request status
  const renderPending = () => (
    <div className="card p-6 border-radius-16 shadow-sm has-text-centered max-width-600 mx-auto mt-6">
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
        text="Sua solicitação está sendo analisada. Por favor, aguarde a aprovação do administrador do sistema."
        className="has-text-grey"
        size={14}
      />
      <button
        type="button"
        className="button border-blue text-blue is-rounded mt-5"
        onClick={() => navigate('/empresas')}
      >
        Voltar para Empresas
      </button>
    </div>
  )

  // Render registration form
  const renderForm = () => (
    <div
      className="card p-5 border-radius-16 shadow-sm mt-4"
      style={{ maxWidth: '900px', margin: '0 auto' }}
    >
      <form onSubmit={handleSubmit}>
        <div className="columns is-multiline">
          {/* Left Column */}
          <div className="column is-7">
            <div className="field mb-4">
              <TextInput
                id="company-name"
                label="Nome da Empresa"
                placeholder="Ex: Tech Solutions LTDA"
                value={formData.name}
                setValue={(val) => setFormData((prev) => ({ ...prev, name: val }))}
                required
              />
            </div>

            <div className="field mb-4">
              <TextInput
                id="company-description"
                label="Descrição da Empresa"
                multiline
                className="register-description-field"
                placeholder="Conte um pouco sobre a atuação da empresa..."
                value={formData.description}
                setValue={(val) => setFormData((prev) => ({ ...prev, description: val }))}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="column is-5">
            <div className="field mb-4">
              <TextInput
                id="company-cnpj"
                label="CNPJ"
                placeholder="00.000.000/0000-00"
                value={formData.cnpj}
                setValue={(val) => setFormData((prev) => ({ ...prev, cnpj: val }))}
                required
              />
            </div>

            <div className="field mb-4">
              <TextInput
                id="company-website"
                label="Website (Opcional)"
                placeholder="https://www.empresa.com"
                value={formData.website}
                setValue={(val) => setFormData((prev) => ({ ...prev, website: val }))}
              />
            </div>

            <div className="field mb-4">
              <TextInput
                id="company-segment"
                label="Setor / Segmento de Atuação"
                placeholder="Ex: Tecnologia da Informação, Logística, etc."
                value={formData.segment}
                setValue={(val) => setFormData((prev) => ({ ...prev, segment: val }))}
                required
              />
            </div>
          </div>
        </div>

        <div className="is-flex is-justify-content-flex-end mt-4 pt-3 border-top-divider">
          <button
            type="button"
            className="button border-blue text-blue is-rounded mr-3"
            onClick={() => navigate('/empresas')}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className={`button bg-blue is-rounded px-6 ${
              loading ? 'is-loading' : ''
            }`}
            disabled={loading}
          >
            <FontAwesomeIcon icon={faSave} className="mr-2" />
            Enviar Solicitação
          </button>
        </div>
      </form>
    </div>
  )

  return (
    <Layout>
      <div className="register-company-page-container">
        <div className="mb-4 has-text-centered">
          <Text
            text="Solicitar Cadastro de Empresa"
            size={32}
            className="is-bold-700 text-blue-strong mb-1"
          />
          <Text
            text="Preencha as informações detalhadas da empresa para iniciar o processo de credenciamento no sistema."
            className="has-text-grey"
            size={14}
          />
        </div>

        {pendingRequest ? renderPending() : renderForm()}
      </div>
    </Layout>
  )
}

export default RegisterCompany
