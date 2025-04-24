import { api } from '../../index.ts'
import { GetArticlesParams, PaginatedResponse } from '../../../types/news.ts'

export const getArticlesRequest = async (params: GetArticlesParams): Promise<PaginatedResponse> => {
  const result = await api.get<PaginatedResponse>('/news', { params })
  return result.data
}