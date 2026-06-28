import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faSave,
  faBuilding,
  faIdCard,
  faGlobe,
} from '@fortawesome/free-solid-svg-icons'
import Text from '../../../components/Text'
import TextInput from '../../../components/TextInput'
import { useAdminRoutes } from '../../../hooks/admin'

function CompanyRequest() {
  const { requestCompany } = useAdminRoutes()
  const [formData, setFormData] = useState({
    name: '',
    cnpj: '',
    website: '',
    description: '',
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    const success = await requestCompany(formData)
    if (success) {
      setFormData({
        name: '',
        cnpj: '',
        website: '',
        description: '',
      })
    }
    setLoading(false)
  }

  return (
    <div className="company-request">
      <div className="mb-4">
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

      <div
        className="card p-5 border-radius-16 shadow-sm"
        style={{ maxWidth: '800px', margin: '0 auto' }}
      >
        <div className="field mb-5">
          <TextInput
            label="Nome da Empresa"
            name="name"
            id="company-name"
            placeholder="Ex: Tech Solutions LTDA"
            value={formData.name}
            onChange={handleChange}
            icon={faBuilding}
          />
        </div>

        <div className="field mb-5">
          <TextInput
            label="CNPJ"
            name="cnpj"
            id="company-cnpj"
            placeholder="00.000.000/0000-00"
            value={formData.cnpj}
            onChange={handleChange}
            icon={faIdCard}
          />
        </div>

        <div className="field mb-5">
          <TextInput
            label="Website (Opcional)"
            name="website"
            id="company-website"
            placeholder="https://www.empresa.com"
            value={formData.website}
            onChange={handleChange}
            icon={faGlobe}
          />
        </div>

        <div className="field mb-6">
          <TextInput
            label="Descrição da Empresa"
            name="description"
            id="company-description"
            multiline
            placeholder="Conte um pouco sobre a atuação da empresa..."
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="is-flex is-justify-content-flex-end">
          <button
            type="button"
            className={`button bg-blue is-rounded px-6 ${
              loading ? 'is-loading' : ''
            }`}
            onClick={handleSubmit}
            disabled={loading}
          >
            <FontAwesomeIcon icon={faSave} className="mr-2" />
            Enviar Solicitação
          </button>
        </div>
      </div>
    </div>
  )
}

export default CompanyRequest
