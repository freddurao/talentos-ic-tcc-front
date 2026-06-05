/* eslint-disable no-nested-ternary */
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout'
import Text from '../../components/Text'
import useAuth from '../../hooks/useAuth'
import ManageUsers from './components/ManageUsers'
import MonitorJobs from './components/MonitorJobs'
import ApproveCompanies from './components/ApproveCompanies'
import './styles.css'

const optionsSettings = [
  {
    optionName: 'Gerenciar Usuários',
    cardTitle: 'Gerenciamento de Usuários do Sistema',
    cardComponent: () => <ManageUsers />,
    iconClass: 'icon-user',
  },
  {
    optionName: 'Monitorar Vagas',
    cardTitle: 'Dashboard de Monitoramento de Vagas',
    cardComponent: () => <MonitorJobs />,
    iconClass: 'icon-graphic',
  },
  {
    optionName: 'Aprovação de Empresas',
    cardTitle: 'Fila de Aprovação de Novas Empresas',
    cardComponent: () => <ApproveCompanies />,
    iconClass: 'icon-solicitation',
  },
]

const manageOptions = optionsSettings.map((setting, id) => ({
  ...setting,
  id,
}))

// Component that renders the page to the admin manage the system
function ManageSystem() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [manageOption, setManageOption] = useState(manageOptions[0])

  const renderOptionCard = (option) => {
    const { id, optionName, iconClass } = option
    const isSelected = id === manageOption.id
    return (
      <button
        type="button"
        key={optionName}
        className={`card option ${isSelected && 'option-selected'}`}
        onClick={() => setManageOption(option)}
      >
        <div className="option-inner">
          <div
            className={`menu-icon ${iconClass} ${
              isSelected && 'icon-selected'
            }`}
          />
          <Text
            className={`is-bold ${isSelected && 'is-white'}`}
            text={optionName}
          />
        </div>
      </button>
    )
  }

  const renderInfoCard = (text) => (
    <div className="card manage-container">
      <div className="option-content">
        <Text className="text-blue-strong is-bold-700" text={text} size={24} />
      </div>
    </div>
  )

  return (
    <Layout>
      <div className="manage-system">
        {user ? (
          user.role === 'ADMIN' ? (
            <>
              <div className="options">
                <div className="sidebar-top">
                  <div className="admin-title">
                    <Text
                      text="Admin Dashboard"
                      size={24}
                      className="is-bold-700 text-blue-strong"
                    />
                  </div>
                  {manageOptions.map((option) => renderOptionCard(option))}
                </div>

                <div className="sidebar-bottom">
                  <button
                    type="button"
                    className="card option"
                    onClick={() => navigate('/editardados')}
                  >
                    <div className="option-inner">
                      <div className="menu-icon icon-settings" />
                      <Text className="is-bold" text="Configurações" />
                    </div>
                  </button>

                  <button
                    type="button"
                    className="card option logout-option"
                    onClick={logout}
                  >
                    <div className="option-inner">
                      <div className="menu-icon icon-logout" />
                      <Text
                        className="is-bold has-text-danger"
                        text="Sair do Sistema"
                      />
                    </div>
                  </button>
                </div>
              </div>
              <div className="card manage-container">
                <div className="option-content">
                  {manageOption.cardComponent && manageOption.cardComponent()}
                </div>
              </div>
            </>
          ) : (
            renderInfoCard('Você não tem permissão para acessar essa página!')
          )
        ) : (
          renderInfoCard('Verificando usuário...')
        )}
      </div>
    </Layout>
  )
}

export default ManageSystem
