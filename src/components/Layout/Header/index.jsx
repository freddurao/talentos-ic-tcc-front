import React from 'react'
import PropTypes from 'prop-types'
import { Link, useNavigate, NavLink } from 'react-router-dom'
import IconIC from '../../IconIC'
import UserAvatar from './UserAvatar'
import Text from '../../Text'
import useAuth from '../../../hooks/useAuth'
import { translate } from '../../../utils/translations'
import './styles.css'

function Header({ headerChildren }) {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()

  const [dismissedRequests, setDismissedRequests] = React.useState(() => {
    try {
      const saved = localStorage.getItem('@vagas/dismissed_requests')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  React.useEffect(() => {
    const handleUpdate = () => {
      try {
        const saved = localStorage.getItem('@vagas/dismissed_requests')
        setDismissedRequests(saved ? JSON.parse(saved) : [])
      } catch {
        setDismissedRequests([])
      }
    }
    window.addEventListener('dismiss_request_update', handleUpdate)
    return () =>
      window.removeEventListener('dismiss_request_update', handleUpdate)
  }, [])

  const hasRequests = React.useMemo(() => {
    if (!user || !user.companyRequests) return false
    return user.companyRequests.some(
      (r) =>
        r.status === 'PENDING' ||
        (r.status === 'REJECTED' && !dismissedRequests.includes(r.id))
    )
  }, [user, dismissedRequests])

  const navigateToLogin = () => navigate('/login')

  return (
    <header className="main-header">
      <div className="header-container">
        <div className="header-left">
          <Link to="/" className="logo-section">
            <IconIC height={45} />
            <div className="logo-text">
              <Text
                className="is-bold-700 is-white site-title"
                text={translate('site_name')}
                size={20}
              />
              <Text
                className="is-white subtitle-ic"
                text="Instituto de Computação"
                size={12}
                style={{ opacity: 0.8 }}
              />
            </div>
          </Link>

          <nav className="header-nav">
            <NavLink
              to="/vagas"
              className={({ isActive }) =>
                `nav-item ${isActive ? 'is-active' : ''}`
              }
              end
            >
              Vagas
            </NavLink>
            <NavLink
              to="/perfis"
              className={({ isActive }) =>
                `nav-item ${isActive ? 'is-active' : ''}`
              }
            >
              Perfis
            </NavLink>
            <NavLink
              to="/empresas"
              className={({ isActive }) =>
                `nav-item ${isActive ? 'is-active' : ''}`
              }
            >
              Empresas
            </NavLink>
            {isAuthenticated && user?.role !== 'ADMIN' && user?.companyId && (
              <NavLink
                to="/minha-empresa"
                className={({ isActive }) =>
                  `nav-item ${isActive ? 'is-active' : ''}`
                }
              >
                Minha Empresa
              </NavLink>
            )}
            {isAuthenticated &&
              user?.role !== 'ADMIN' &&
              !user?.companyId &&
              hasRequests && (
                <NavLink
                  to="/minha-empresa"
                  className={({ isActive }) =>
                    `nav-item ${isActive ? 'is-active' : ''}`
                  }
                >
                  Minha Solicitação
                </NavLink>
              )}
            {user?.role === 'ADMIN' && (
              <NavLink
                to="/gerenciarsistema"
                className={({ isActive }) =>
                  `nav-item ${isActive ? 'is-active' : ''}`
                }
              >
                Admin
              </NavLink>
            )}
          </nav>
        </div>

        <div className="header-right">
          {headerChildren && (
            <div className="header-custom-content">{headerChildren}</div>
          )}

          <div className="auth-section">
            {isAuthenticated ? (
              <div className="user-info-wrapper">
                {user && (
                  <div className="user-text mr-3 is-hidden-mobile">
                    <Text
                      className="is-bold is-white"
                      text={user.name?.split(' ')[0] || 'Usuário'}
                      size={14}
                    />
                    <Text
                      className="is-white"
                      text={
                        user.role === 'ADMIN' ? 'Administrador' : 'Candidato'
                      }
                      size={11}
                      style={{ opacity: 0.8 }}
                    />
                  </div>
                )}
                <UserAvatar />
              </div>
            ) : (
              <button
                className="button is-white is-outlined is-rounded is-small"
                type="button"
                onClick={navigateToLogin}
                style={{ fontWeight: 'bold' }}
              >
                Entrar
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

Header.propTypes = {
  headerChildren: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
}

Header.defaultProps = {
  headerChildren: undefined,
}

export default Header
