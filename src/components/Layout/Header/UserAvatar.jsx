import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUser,
  faSignOutAlt,
  faCog,
  faUserCircle,
} from '@fortawesome/free-solid-svg-icons'
import useAuth from '../../../hooks/useAuth'
import Text from '../../Text'
import './styles.css'

function UserAvatar() {
  const navigate = useNavigate()
  const { logout, userId, user } = useAuth()

  const dropdownItem = (label, icon, onClick) => (
    <div className="dropdown-item">
      <button
        className="button is-ghost btn-dropdown"
        type="button"
        onClick={onClick}
      >
        <FontAwesomeIcon icon={icon} className="mr-3 has-text-grey" />
        <Text className="text-dropdown" text={label} size={14} />
      </button>
    </div>
  )

  return (
    <div className="dropdown is-right is-hoverable">
      <div className="dropdown-trigger">
        <div className="user-avatar">
          {user?.avatar ? (
            <img src={user.avatar} alt="User" className="is-rounded" />
          ) : (
            <FontAwesomeIcon icon={faUser} className="lnr-user" />
          )}
        </div>
      </div>
      <div className="dropdown-menu" id="user-dropdown-menu" role="menu">
        <div className="dropdown-content">
          <div className="px-4 py-2 mb-2 border-bottom">
            <Text
              text={user?.name || 'Usuário'}
              className="is-bold"
              size={14}
            />
            <Text
              text={user?.email || ''}
              className="has-text-grey"
              size={12}
            />
          </div>
          {dropdownItem('Meu Perfil', faUserCircle, () =>
            navigate(`/verperfil/${userId}`)
          )}
          {dropdownItem('Configurações', faCog, () => navigate('/editardados'))}
          {user?.role === 'ADMIN' &&
            dropdownItem('Administração', faCog, () =>
              navigate('/gerenciarsistema')
            )}
          <hr className="dropdown-divider" />
          {dropdownItem('Sair do Sistema', faSignOutAlt, () => {
            logout()
            navigate('/')
          })}
        </div>
      </div>
    </div>
  )
}

export default UserAvatar
