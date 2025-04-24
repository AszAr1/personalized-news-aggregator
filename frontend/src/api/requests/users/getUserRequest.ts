import { api } from '../../index.ts'
import { GetUser } from '../../../types/user.ts'


export const getUserRequest = async ({ userId }: { userId: string }): Promise<GetUser> => {
  const result = await api.get<GetUser>(`/users/${userId}`)
  return result.data
}