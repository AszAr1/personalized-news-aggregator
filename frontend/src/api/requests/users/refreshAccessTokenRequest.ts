import { api } from '../../index.ts'


export const refreshAccessTokenRequest = async (refresh_data: { refresh: string }): Promise<{ access_token: string }> => {
  const result = await api.post<{ access_token: string }>('/users/token/refresh', refresh_data)
  return result.data
}