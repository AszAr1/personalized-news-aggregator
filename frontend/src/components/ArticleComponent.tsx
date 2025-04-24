import { Link } from 'react-router'
import { Eye, ThumbsUp, ThumbsDown, Bookmark } from 'lucide-react'
import { Article } from '../types/news'
import { useIncrementViewsCount } from '../hooks/articles/useIncrementViewsCount'
import { MouseEvent, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useAddArticleToFavorite, useAddArticleToDisliked, useRemoveArticleFromDisliked, useRemoveArticleFromFavorite, useAddArticleToLiked, useRemoveArticleFromLiked } from '../hooks/articles/useUserArticleAction'
import useUserData from '../state/useUserDataStore'


type ArticleComponentProps = {
  article: Article
}

function ArticleComponent({ article }: ArticleComponentProps) {
  const { userData } = useUserData()
  const [isLiked, setIsLiked] = useState(
    () => {
      if (userData) {
        return userData.liked_articles.map(article => article.id).includes(article.id)
      }
    }
  )
  const [isDisliked, setIsDisliked] = useState(
    () => {
      if (userData) {
        return userData.disliked_articles.map(article => article.id).includes(article.id)
      }
    }
  )
  const [isFavorited, setIsFavorited] = useState(
    () => {
      if (userData) {
        return userData.favorited_articles.map(article => article.id).includes(article.id)
      }
    }
  )
  const addArticleToLiked = useAddArticleToLiked()
  const removeArticleFromLiked = useRemoveArticleFromLiked()
  const addArticleToDisliked = useAddArticleToDisliked()
  const removeArticleFromDisliked = useRemoveArticleFromDisliked()
  const addArticleToFavorite = useAddArticleToFavorite()
  const removeArticleFromFavorite = useRemoveArticleFromFavorite()
  const isAuthenticated = useAuth()
  const { mutate: incrementViews } = useIncrementViewsCount({
    article: article
  })

  const handleSourceClick = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    window.open(article.url, '_blank')
    incrementViews()
  }

  const handleLikeClick = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (isLiked) {
      removeArticleFromLiked(article.id)
    } else {
      addArticleToLiked(article.id)
      removeArticleFromDisliked(article.id)
    }
    setIsLiked(!isLiked)
    setIsDisliked(false)
  }

  const handleDislikeClick = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (isDisliked) {
      removeArticleFromDisliked(article.id)
    } else {
      addArticleToDisliked(article.id)
      removeArticleFromLiked(article.id)
    }
    setIsDisliked(!isDisliked)
    setIsLiked(false)
  }

  const handleFavoritedClick = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (isFavorited) {
      removeArticleFromFavorite(article.id)
    } else {
      addArticleToFavorite(article.id)
    }
    setIsFavorited(!isFavorited)
  }

  return <div className="border-2 rounded-lg border-gray-900 overflow-hidden">
    <div onClick={handleSourceClick} className="group flex flex-col items-start justify-between gap-4">
      <div className='w-full'>
        <img src={article.image} alt="image" className='w-full' />
      </div>
      <div className="mx-2 font-bold text-base sm:text-lg lg:text-xl group-hover:underline">
        {article.title}
      </div>
    </div>
    <div className='mx-2 flex gap-2'>
      {isAuthenticated &&
        <>
          <div className='flex items-center' onClick={handleLikeClick}>
            <ThumbsUp
              color={isLiked ? 'green' : 'currentColor'}
              fill={isLiked ? 'lightgreen' : 'none'}
            />
            <p className='text-2xl'>{article.users_liked.length}</p>
          </div>
          <div className='flex items-center' onClick={handleDislikeClick}>
            <ThumbsDown
              color={isDisliked ? 'darkred' : 'currentColor'}
              fill={isDisliked ? 'indianred' : 'none'}
            />
            <p className='text-2xl'>{article.users_disliked.length}</p>
          </div>
          <div className='flex items-center' onClick={handleFavoritedClick}>
            <Bookmark
              color={isFavorited ? 'yellow' : 'currentColor'}
              fill={isFavorited ? 'lightyellow' : 'none'}
            />
          </div>
        </>
      }
      <div className='flex items-center pt-1 gap-1 text-2xl'>
        <Eye />
        {article.views_count}
      </div>
    </div>
    <div className="font-thin flex gap-1 mx-2">
      <div className="">{article.published_at.split("-").reverse().join('-')}</div>
      <p>|</p>
      <Link to={`/${article.category.name}`} className="hover:underline">{article.category.name}</Link>
    </div>
  </div>
}

export default ArticleComponent