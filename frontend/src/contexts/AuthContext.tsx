import { createContext, useContext, useEffect, useCallback } from 'react'
import { userLoginRequest } from '../api/requests/users/loginRequest'
import { CreateUser } from '../types/user'
import { JwtPayload, UserLoginRequest, UserLoginResponse } from '../types/auth'
import useUserData from '../state/useUserDataStore'
import { verifyTokenRequest } from '../api/requests/users/verifyTokenRequest'
import { useToast } from './ToastContext'
import { getUserRequest } from '../api/requests/users/getUserRequest'
import { userRegisterRequest } from '../api/requests/users/registerRequest'
import { jwtDecode } from 'jwt-decode'
import { api } from '../api'

type AuthContextType = {
  accessToken: string | null
  login: ({ username, password }: UserLoginRequest) => Promise<void>
  register: ({ email, password, username, selected_categories }: CreateUser) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { setUserData } = useUserData()
  const { showToast } = useToast()

  useEffect(() => {
    const validateToken = async () => {
      const accessToken = localStorage.getItem('access-token')
      const refreshToken = localStorage.getItem('refresh-token')
      if (accessToken) {
        try {
          if (refreshToken) {
            const success = await verifyTokenRequest({ token: refreshToken })
            if (success) {
              console.log("token is verified")
            } else {
              console.log("token is expired")
            }
          } else {
            logout()
          }
        } catch (error) {
          logout();
        }
      }
    };
    validateToken();
  }, []);

  const login = useCallback(async ({ username, password }: UserLoginRequest) => {
    try {
      const loginResponse: UserLoginResponse = await userLoginRequest({ username, password });
      localStorage.setItem('access-token', loginResponse.access)
      localStorage.setItem('refresh-token', loginResponse.refresh)
      api.defaults.headers.common['Authorization'] = `Bearer ${loginResponse.access}`;
      const payload = jwtDecode<JwtPayload>(loginResponse.access)
      if (payload.user_id) {
        const userDataResponse = await getUserRequest({ userId: payload.user_id })
        setUserData(_ => (userDataResponse))
        showToast({ message: "Log in successful", type: "success" })
      } else {
        showToast({ message: "Log in failed", type: "error" })
        logout()
      }
    } catch (error) {
      logout();
      showToast({ message: "Log in failed", type: "error" })
    }
  }, []);

  const register = useCallback(async ({ email, password, username, selected_categories }: CreateUser) => {
    try {
      await userRegisterRequest({
        email,
        username,
        password,
        selected_categories
      });
      await login({ username, password });
    } catch (error) {
      logout();
      showToast({ message: "Registration failed", type: "error" })
      throw error;
    }
  }, [login, setUserData]);


  const logout = useCallback(() => {
    localStorage.removeItem('access-token')
    localStorage.removeItem('refresh-token')
  }, []);


  return (
    <AuthContext.Provider value={{
      accessToken: localStorage.getItem("access-token"),
      login,
      register,
      logout,
      isAuthenticated: !!localStorage.getItem("access-token")
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}