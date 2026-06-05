/* eslint-disable react/prop-types */
import React, { createContext, useCallback, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import jwtDecode from 'jwt-decode'
import api from '../api'
import { getWithExpiry, saveWithExpiry } from '../utils/object'

export const AuthState = {
  AUTHENTICATED: 1,
  UNAUTHENTICATED: 2,
  IDLE: 3,
}

const AuthContext = createContext({})

const AUTH_TOKEN_KEY = '@vagas/token'
const AUTH_USER_ID_KEY = '@vagas/user_id'

export function AuthProvider({ children }) {
  const [token, setToken] = useState()
  const [userId, setUserId] = useState()
  const [user, setUser] = useState()
  const [authState, setAuthState] = useState(AuthState.IDLE)

  const manageUser = (userData) => {
    if (
      !userData ||
      !userData.token ||
      !userData.id ||
      userData.id === 'undefined' ||
      userData.token === 'undefined'
    ) {
      setToken(undefined)
      setUserId(undefined)
      setUser(undefined)
      setAuthState(AuthState.UNAUTHENTICATED)
      localStorage.removeItem(AUTH_TOKEN_KEY)
      localStorage.removeItem(AUTH_USER_ID_KEY)
      return
    }

    setToken(userData.token)
    setUserId(userData.id)
    setUser(userData)
    setAuthState(AuthState.AUTHENTICATED)
    saveWithExpiry(AUTH_TOKEN_KEY, userData.token, 7200000)
    saveWithExpiry(AUTH_USER_ID_KEY, userData.id, 7200000)
  }

  const login = useCallback(async (email, password) => {
    return new Promise((resolve, reject) => {
      api
        .post('usuarios/login', { email, password })
        .then((response) => {
          const tokenFromResponse = response.data.token

          if (!tokenFromResponse && response.data.message)
            toast.error(response.data.message)

          manageUser(response.data)

          resolve(tokenFromResponse !== undefined)
        })
        .catch(reject)
    })
  }, [])

  const register = useCallback(async (name, email, password) => {
    const response = await api.post('usuarios', {
      name,
      email,
      password,
    })

    const tokenFromResponse = response.data.token

    if (!tokenFromResponse && response.data.message)
      toast.error(response.data.message)

    manageUser(response.data)

    return tokenFromResponse !== undefined
  }, [])

  const logout = useCallback(async () => {
    manageUser(undefined)
  }, [])

  const loadToken = useCallback(async () => {
    const tokenLoaded = getWithExpiry(AUTH_TOKEN_KEY)
    const userIdLoaded = getWithExpiry(AUTH_USER_ID_KEY)

    const id =
      userIdLoaded === 'undefined' || !userIdLoaded ? undefined : userIdLoaded
    const tkn =
      tokenLoaded === 'undefined' || !tokenLoaded ? undefined : tokenLoaded

    if (tkn && id) {
      try {
        const decoded = jwtDecode(tkn)

        // Check if token is expired
        const now = Date.now() / 1000
        if (decoded.exp && decoded.exp < now) {
          throw new Error('Token expirado')
        }

        // Set initial state from token to avoid "Usuário" placeholder
        const initialState = {
          token: tkn,
          id,
          name: decoded.name || 'Usuário', // Fallback if name is in token
          role: decoded.role,
        }

        setToken(tkn)
        setUserId(id)
        setUser(initialState)
        setAuthState(AuthState.AUTHENTICATED)

        try {
          const response = await api.get(`/usuarios/${id}`)
          // Merge API data with token, ensuring role and name are preserved
          const fullUser = {
            ...response.data,
            token: tkn,
          }
          setUser(fullUser)
        } catch (apiErr) {
          console.error(
            'Erro ao buscar detalhes do usuário, mantendo sessão básica',
            apiErr
          )
        }
      } catch (err) {
        console.error('Sessão inválida ou expirada', err)
        manageUser(undefined)
      }
    } else {
      manageUser(undefined)
    }
  }, [])

  const isAuthenticated = useMemo(
    () => authState === AuthState.AUTHENTICATED,
    [authState]
  )

  const isIdle = useMemo(() => authState === AuthState.IDLE, [authState])

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isIdle,
        token,
        userId,
        user,
        state: authState,
        login,
        register,
        logout,
        loadToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
