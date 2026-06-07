import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import Text from '../../components/Text'
import IconIC from '../../components/IconIC'
import TextInput from '../../components/TextInput'
import { translate } from '../../utils/translations'
import './style.css'
import { usePasswordRecovery } from '../../hooks/user'
import { isPasswordValid } from '../../utils/validations'

const ResetPassword = () => {
  const params = useParams()
  const navigate = useNavigate()

  const { token } = params
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const { sendRecoveryLink } = usePasswordRecovery()

  const navigateToLogin = () => navigate('/login')

  const handleSubmitPassword = (e) => {
    e.preventDefault()
    if (password === password2) {
      if (!isPasswordValid(password)) {
        toast.error('A senha precisa ter no mínimo 6 dígitos!')
        return
      }

      sendRecoveryLink({ token, password })
        .then(() => {
          toast.success('Senha alterada')
          setTimeout(() => {
            navigate('/login')
          }, 1000)
        })
        .catch(() => toast.error('Algo não funcionou como esperado'))
    } else {
      toast.error('As senhas não coincidem.')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-left-container">
        <IconIC height={100} />
        <div style={{ marginTop: '20px' }}>
          <Text
            className="is-bold is-white"
            text={translate('site_name')}
            size={48}
          />
          <Text
            className="is-white"
            text="Instituto de Computação da UFBA"
            size={20}
          />
        </div>
        <Text
          className="auth-subtitle is-white is-light"
          text="Defina sua nova senha de acesso."
          size={24}
        />
      </div>
      <div className="auth-right-container">
        <div className="card">
          <div className="auth-header">
            <Text
              className="is-bold is-primary"
              text="Cadastrar nova senha"
              size={24}
            />
          </div>
          <form onSubmit={handleSubmitPassword}>
            <TextInput
              label="Nova senha"
              type="password"
              value={password}
              setValue={setPassword}
            />
            <TextInput
              label="Repita a nova senha"
              type="password"
              value={password2}
              setValue={setPassword2}
            />
            <button className="btn-submit" type="submit" aria-label="Salvar">
              <Text className="is-white" text="Salvar" size={18} />
            </button>
          </form>
          <button
            className="button is-ghost btn-register-call"
            type="button"
            onClick={navigateToLogin}
          >
            <Text
              className="is-bold is-blue"
              text="Voltar para o Login"
              size={16}
            />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
