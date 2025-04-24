// hooks/useArticleActions.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { userArticleActionRequest } from '../../api/requests/users/userArticleActionRequest'
import { UserArticleActionData, GetUser } from '../../types/user'
import { UserArticleAction } from '../../enums/user'
import useUserData from '../../state/useUserDataStore'
import useArticles from '../../state/useArticlesStore'

export const useArticleActions = () => {
  const queryClient = useQueryClient()
  const { userData, setUserData } = useUserData()
  const { articles } = useArticles()

  return useMutation<GetUser, Error, UserArticleActionData>({
    mutationFn: ({ article_id, action }) => {
      return userArticleActionRequest({
        userId: userData!.id,
        data: { article_id, action }
      })
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ['user', userData?.id] })

      if (userData) {
        switch (variables.action) {
          case UserArticleAction.ADD_LIKE:
            const liked_article = articles.find(article => article.id === variables.article_id)
            console.log("useArticleActions: liked_article", liked_article)
            if (!!liked_article) {
              setUserData(prev => ({
                ...prev,
                liked_articles: [...userData.liked_articles, liked_article],
                disliked_articles: userData.disliked_articles.filter(
                  article => article.id !== variables.article_id
                )
              }))
            }
            break
          case UserArticleAction.REMOVE_LIKE:
            setUserData(prev => ({
              ...prev,
              liked_articles: userData.liked_articles.filter(
                article => article.id !== variables.article_id
              )
            }))
            break
          case UserArticleAction.ADD_DISLIKE:
            const disliked_article = articles.find(article => article.id === variables.article_id)
            if (disliked_article) {
              setUserData(prev => ({
                ...prev,
                disliked_articles: [...userData.disliked_articles, disliked_article],
                liked_articles: userData.liked_articles.filter(
                  article => article.id !== variables.article_id
                )
              }))
            }
            break
          case UserArticleAction.REMOVE_DISLIKE:
            setUserData(prev => ({
              ...prev,
              disliked_articles: userData.disliked_articles.filter(
                article => article.id !== variables.article_id
              )
            }))
            break
          case UserArticleAction.ADD_FAVORITE:
            const favorited_article = articles.find(article => article.id === variables.article_id)
            if (favorited_article) {
              setUserData(prev => ({
                ...prev,
                favorited_articles: [...userData.favorited_articles, favorited_article]
              }))
            }
            break
          case UserArticleAction.REMOVE_FAVORITE:
            setUserData(prev => ({
              ...prev,
              favorited_articles: userData.disliked_articles.filter(
                article => article.id !== variables.article_id
              )
            }))
            break
        }
      }
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(['user', userData?.id], userData)
      console.error('Article action failed:', error)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['user', userData?.id] })
      queryClient.invalidateQueries({ queryKey: ['articles'] })
    }
  })
}

export const useAddArticleToLiked = () => {
  const { mutate } = useArticleActions()
  return (articleId: string) => mutate({
    article_id: articleId,
    action: UserArticleAction.ADD_LIKE
  })
}

export const useRemoveArticleFromLiked = () => {
  const { mutate } = useArticleActions()
  return (articleId: string) => mutate({
    article_id: articleId,
    action: UserArticleAction.REMOVE_LIKE
  })
}

export const useAddArticleToDisliked = () => {
  const { mutate } = useArticleActions()
  return (articleId: string) => mutate({
    article_id: articleId,
    action: UserArticleAction.ADD_DISLIKE
  })
}

export const useRemoveArticleFromDisliked = () => {
  const { mutate } = useArticleActions()
  return (articleId: string) => mutate({
    article_id: articleId,
    action: UserArticleAction.REMOVE_DISLIKE
  })
}

export const useAddArticleToFavorite = () => {
  const { mutate } = useArticleActions()
  return (articleId: string) => mutate({
    article_id: articleId,
    action: UserArticleAction.ADD_FAVORITE
  })
}

export const useRemoveArticleFromFavorite = () => {
  const { mutate } = useArticleActions()
  return (articleId: string) => mutate({
    article_id: articleId,
    action: UserArticleAction.REMOVE_FAVORITE
  })
}