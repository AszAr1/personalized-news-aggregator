import { api } from '../../index.ts'

export const verifyTokenRequest = async (verify_data: {token: string}): Promise<boolean> => {
  const result = await api.post<{token: string}>('/users/token/verify', verify_data)
  return result.status === 200 ? true : false 
}