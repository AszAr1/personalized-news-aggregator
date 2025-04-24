import { api } from '../../index.ts'
import { GetUser, UserArticleActionData } from '../../../types/user.ts'


export const userArticleActionRequest = async ({ userId, data }: {
  userId: string,
  data: UserArticleActionData
}): Promise<GetUser> => {
  const result = await api.post<GetUser>(`/users/${userId}/article-action`, { ...data })
  return result.data
}