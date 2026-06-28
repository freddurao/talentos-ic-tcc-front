import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { DateBox, SelectBox } from '../../components/FormElements'
import Layout from '../../components/Layout'
import ConfirmModal from '../../components/Modals/ConfirmModal'
import Text from '../../components/Text'
import TextInput from '../../components/TextInput'
import { useGetJobById, useJobRoutes } from '../../hooks/jobs'
import useAuth from '../../hooks/useAuth'
import {
  DEFAULT_SALARY,
  jobScholarities,
  jobTypes,
} from '../../utils/constants/project'
import { translate } from '../../utils/translations'
import './styles.css'

// Component that renders the page to create, edit or delete a job
function JobForm() {
  const navigate = useNavigate()

  const params = useParams()
  const isCreationForm = params.type === 'criar'

  const { userId } = useAuth()

  const { job, jobId } = useGetJobById(params.id)

  const [deleteModalOpened, setDeleteModalOpened] = useState(false)
  const [saveModalOpened, setSaveModalOpened] = useState(false)
  const [createModalOpened, setCreateModalOpened] = useState(false)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startingDate, setStartingDate] = useState('')
  const [endingDate, setEndingDate] = useState('')
  const [site, setSite] = useState('')
  const [scholarity, setScholarity] = useState('')
  const [type, setType] = useState('')
  const [workload, setWorkload] = useState('')
  const [salary, setSalary] = useState(DEFAULT_SALARY)

  const [hasError, setHasError] = useState(false)

  const { createJob, updateJob, deleteJob } = useJobRoutes()

  const isTitleInvalid = () => title === ''
  const isDescriptionInvalid = () => description === ''
  const isStartingDateInvalid = () => startingDate === ''
  const isEndingDateInvalid = () => endingDate === ''
  const isSiteInvalid = () => site === ''
  const isScholarityInvalid = () => scholarity === ''
  const isTypeInvalid = () => type === ''
  const isWorkloadInvalid = () => workload === ''

  const hasJobChanges = () => {
    if (job) {
      return (
        title !== job.title ||
        description !== job.description ||
        startingDate !== job.startingDate ||
        endingDate !== job.endingDate ||
        site !== job.site ||
        scholarity !== job.scholarity ||
        type !== job.type ||
        workload !== job.workload ||
        salary !== job.salary
      )
    }
    return true
  }

  const onSaveConfirm = async () => {
    if (hasJobChanges()) {
      if (
        isTitleInvalid() ||
        isDescriptionInvalid() ||
        isStartingDateInvalid() ||
        isEndingDateInvalid() ||
        isSiteInvalid() ||
        isScholarityInvalid() ||
        isTypeInvalid() ||
        isWorkloadInvalid()
      ) {
        toast.error(translate('mandatory_not_filled'))
        setHasError(true)
        return
      }

      if (isCreationForm) {
        await createJob(
          description,
          scholarity,
          title,
          type,
          site,
          workload,
          salary || DEFAULT_SALARY,
          endingDate,
          startingDate,
          userId
        )
      } else if (job) {
        await updateJob(
          jobId,
          description,
          scholarity,
          title,
          type,
          site,
          workload,
          salary || DEFAULT_SALARY,
          endingDate,
          startingDate,
          userId
        )
      }
    }

    navigate('/minhasvagas?criadas=1')
  }

  const onSave = (e) => {
    e.preventDefault()
    if (isCreationForm) setCreateModalOpened(true)
    else setSaveModalOpened(true)
  }

  const onDeleteJob = async () => {
    await deleteJob(jobId).then(() => {
      navigate('/minhasvagas?criadas=1')
    })
  }

  useEffect(() => {
    if (!job) return
    setTitle(job.title)
    setDescription(job.description)
    setStartingDate(job.startingDate)
    setEndingDate(job.endingDate)
    setSite(job.site)
    setScholarity(job.scholarity)
    setType(job.type)
    setWorkload(job.workload)
    setSalary(job.salary)
  }, [job])

  const renderCard = () => (
    <>
      <div className="card-title">
        <Text
          className="is-bold is-blue"
          text={isCreationForm ? 'Cadastrar Nova Vaga' : 'Editar Vaga'}
          size={24}
        />
      </div>
      <form autoComplete="off" onSubmit={onSave}>
        <div className="columns">
          {/* Coluna Esquerda (7/12) - Textos Principais */}
          <div className="column is-7">
            <div className="mb-2">
              <TextInput
                label="Título da Vaga"
                type="text"
                value={title}
                setValue={setTitle}
                autoComplete={false}
                maxLength={255}
                hasError={hasError && isTitleInvalid()}
                placeholder="Ex: Desenvolvedor Front-end React"
              />
            </div>
            <div>
              <TextInput
                className="textarea-tall"
                label="Descrição Detalhada"
                multiline
                value={description}
                setValue={setDescription}
                hasError={hasError && isDescriptionInvalid()}
                placeholder="Descreva as responsabilidades, requisitos e detalhes da vaga..."
              />
            </div>
          </div>

          {/* Coluna Direita (5/12) - Metadados e Parâmetros */}
          <div className="column is-5">
            <div className="columns is-multiline">
              <div className="column is-12 mb-2">
                <TextInput
                  label="Localidade (Cidade/Estado ou Remoto)"
                  value={site}
                  setValue={setSite}
                  type="text"
                  autoComplete={false}
                  maxLength={255}
                  hasError={hasError && isSiteInvalid()}
                  placeholder="Ex: Rio de Janeiro - RJ ou Remoto"
                />
              </div>

              <div className="column is-6 mb-2">
                <SelectBox
                  label="Regime de Trabalho"
                  labelLarge
                  initialOption="Selecionar Regime"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  options={jobTypes}
                  hasError={hasError && isTypeInvalid()}
                />
              </div>

              <div className="column is-6 mb-2">
                <SelectBox
                  label="Escolaridade Mínima"
                  labelLarge
                  value={scholarity}
                  onChange={(e) => setScholarity(e.target.value)}
                  initialOption="Selecionar Escolaridade"
                  options={jobScholarities}
                  hasError={hasError && isScholarityInvalid()}
                />
              </div>

              <div className="column is-6 mb-2">
                <TextInput
                  label="Carga Horária (h)"
                  type="number"
                  value={`${workload}`}
                  setValue={setWorkload}
                  autoComplete={false}
                  hasError={hasError && isWorkloadInvalid()}
                  placeholder="Ex: 40"
                />
              </div>

              <div className="column is-6 mb-2">
                <TextInput
                  label="Salário / Bolsa (R$)"
                  type="number"
                  value={`${salary}`}
                  setValue={(value) => setSalary(value)}
                  placeholder={`${DEFAULT_SALARY}`}
                  autoComplete={false}
                  maxLength={255}
                />
              </div>

              <div className="column is-12 mb-2">
                <DateBox
                  label="Data de Início do Trabalho"
                  labelLarge
                  value={startingDate}
                  onChange={(e) => setStartingDate(e.target.value)}
                  hasError={hasError && isStartingDateInvalid()}
                />
              </div>

              <div className="column is-12 mb-2">
                <DateBox
                  label="Data Limite para Candidatura"
                  labelLarge
                  value={endingDate}
                  onChange={(e) => setEndingDate(e.target.value)}
                  hasError={hasError && isEndingDateInvalid()}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="field is-grouped is-grouped-right mt-4 pt-3 border-top">
          {!isCreationForm && (
            <p className="control">
              <button
                type="button"
                className="button is-danger is-rounded font-weight-bold px-5"
                style={{ height: '45px' }}
                onClick={() => setDeleteModalOpened(true)}
              >
                Excluir Vaga
              </button>
            </p>
          )}
          <p className="control">
            <button
              type="submit"
              className={`button ${
                isCreationForm ? 'bg-blue' : 'is-success'
              } is-rounded font-weight-bold px-5`}
              style={{ height: '45px', color: '#fff' }}
            >
              {isCreationForm ? 'Criar Vaga' : 'Salvar Alterações'}
            </button>
          </p>
        </div>
      </form>
    </>
  )

  const renderInfoText = (text) => (
    <Text className="is-bold is-blue" text={text} size={24} />
  )

  return (
    <Layout>
      <ConfirmModal
        title="Deletar Vaga"
        description={`Deseja realmente deletar a vaga "${
          job && job.title
        }"? A ação não poderá ser desfeita!`}
        onConfirm={() => onDeleteJob()}
        onCancel={() => setDeleteModalOpened(false)}
        opened={deleteModalOpened}
        isDangerous
      />
      <ConfirmModal
        title="Salvar Vaga"
        description={`Deseja realmente salvar a vaga "${job && job.title}"?`}
        onConfirm={() => onSaveConfirm()}
        onCancel={() => setSaveModalOpened(false)}
        opened={saveModalOpened}
      />
      <ConfirmModal
        title="Criar Vaga"
        description="Deseja realmente criar essa vaga?"
        onConfirm={() => onSaveConfirm()}
        onCancel={() => setCreateModalOpened(false)}
        opened={createModalOpened}
      />
      <div className="job-form">
        <div className="card">
          {isCreationForm || job
            ? renderCard()
            : renderInfoText('Carregando formulário...')}
        </div>
      </div>
    </Layout>
  )
}

export default JobForm
