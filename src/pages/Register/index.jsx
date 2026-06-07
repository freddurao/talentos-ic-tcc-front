import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Text from '../../components/Text'
import IconIC from '../../components/IconIC'
import TextInput from '../../components/TextInput/index'
import useAuth from '../../hooks/useAuth'
import { isEmailValid, isPasswordValid } from '../../utils/validations'
import { translate } from '../../utils/translations'
import './styles.css'
import { keepQueryOnUrl } from '../../utils/conversions'
import { useSearchObject } from '../../hooks/url'

// Component that renders the page to register a new user
function Register() {
  const navigate = useNavigate()
  const [search] = useSearchObject()

  const { register } = useAuth()

  const [hasError, setHasError] = useState(false)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const navigateToLogin = () =>
    navigate(keepQueryOnUrl('/login', 'criarvaga=1', search.criarvaga === '1'))

  const isNameInvalid = () => name === ''
  const isEmailInvalid = () => !isEmailValid(email)
  const isPasswordInvalid = () => !isPasswordValid(password)
  const isConfirmPasswordInvalid = () =>
    confirmPassword === '' || confirmPassword !== password

  const isFieldsInvalid = () => {
    return (
      isNameInvalid() ||
      isEmailInvalid() ||
      isPasswordInvalid() ||
      isConfirmPasswordInvalid()
    )
  }

  const submitRegister = async (e) => {
    e.preventDefault()

    if (isFieldsInvalid()) {
      setHasError(true)
      return
    }

    try {
      const token = await register(name, email, password)
      if (token) navigate('/')
    } catch (error) {
      toast.error(
        'Houve algum problema com seu cadastro! Verifique os campos e tente novamente.'
      )
    }
  }

  return (
    <div className="auth-page">
      <div className="register-left-container">
        <div className="register-logo-container">
          <IconIC height={80} />
          <div className="logo-text-wrapper">
            <Text
              className="is-bold is-white"
              text={translate('site_name')}
              size={32}
            />
            <Text
              className="is-white"
              text="Instituto de Computação da UFBA"
              size={14}
            />
          </div>
        </div>
        <div className="register-bottom-text">
          <Text
            className="is-bold is-white register-main-title"
            text="Impulsione sua carreira em tecnologia."
            size={48}
          />
          <Text
            className="is-white is-light register-subtitle"
            text="Conecte-se com as melhores oportunidades do mercado, mostre seu potencial e construa seu futuro profissional através da ponte entre o Instituto de Computação da UFBA e o setor de inovação."
            size={20}
          />
        </div>
      </div>
      <div className="auth-right-container">
        <div className="card">
          <div className="auth-header">
            <Text className="is-primary is-bold" text="Criar conta" size={24} />
          </div>
          <Text
            className="auth-form-description"
            text="Preencha os dados abaixo para se cadastrar."
            size={16}
          />
          <form onSubmit={submitRegister}>
            <TextInput
              label="Nome Completo"
              type="text"
              value={name}
              setValue={setName}
              hasError={hasError && isNameInvalid()}
              icon="fa-solid fa-user"
            />
            <TextInput
              label="E-mail"
              type="email"
              value={email}
              setValue={setEmail}
              hasError={hasError && isEmailInvalid()}
              icon="fa-solid fa-envelope"
            />
            <TextInput
              label="Senha"
              type="password"
              value={password}
              setValue={setPassword}
              hasError={hasError && isPasswordInvalid()}
              icon="fa-solid fa-lock"
            />
            <TextInput
              label="Confirmar Senha"
              type="password"
              value={confirmPassword}
              setValue={setConfirmPassword}
              hasError={hasError && isConfirmPasswordInvalid()}
              icon="fa-solid fa-lock"
            />
            {hasError && (
              <Text
                className="is-bold auth-label-error"
                text={
                  isConfirmPasswordInvalid() && password !== confirmPassword
                    ? 'As senhas não coincidem!'
                    : 'Algum campo precisa ser redigitado!'
                }
                size={16}
              />
            )}
            <button className="btn-submit" type="submit" aria-label="Cadastrar">
              <Text className="is-white" text="Cadastrar" size={18} />
            </button>
          </form>
          <div className="login-redirect-container">
            <Text text="Já tem uma conta?" size={15} />
            <button
              className="login-redirect-link"
              type="button"
              onClick={navigateToLogin}
            >
              <Text
                className="is-bold is-primary"
                text="Entre aqui"
                size={15}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
