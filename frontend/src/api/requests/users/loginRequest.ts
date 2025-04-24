import { api } from '../../index.ts'
import { UserLoginRequest, UserLoginResponse } from '../../../types/auth.ts'


export const userLoginRequest = async (loginData: UserLoginRequest): Promise<UserLoginResponse> => {
  const result = await api.post<UserLoginResponse>('/users/token', loginData)
  
  return result.data
}