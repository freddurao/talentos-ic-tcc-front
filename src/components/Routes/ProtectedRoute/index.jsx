import React, { useMemo } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useSearchObject } from '../../../hooks/url'

import useAuth from '../../../hooks/useAuth'
import { postLoginPath } from '../../../utils/conversions'

function ProtectedRoute() {
  const [search] = useSearchObject()
  const { isAuthenticated, isIdle } = useAuth()

  // Login e cadastro: depois de entrar, volta para onde a pessoa estava indo
  const redirectTo = useMemo(() => postLoginPath(search), [search])

  if (isIdle) return <div />

  return !isAuthenticated ? <Outlet /> : <Navigate to={redirectTo} replace />
}

export default ProtectedRoute
