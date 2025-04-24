import { Article } from '../../../types/news.ts'
import { api } from '../../index.ts'

export const incrementViewsCountRequest = async ({article}: {article: Article}): Promise<void> => {
  await api.patch(`/news/${article.id}`, { 'views_count': article.likes_count + 1 })
}