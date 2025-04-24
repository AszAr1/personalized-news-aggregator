import { UserArticleAction as UserArticleAction } from "../enums/user"
import { Article } from "./news"

export type CreateUser = {
    username: string
    email: string
    password: string
    selected_categories: SelectedCategories
}

export type LoginUser = {
    username: string
    password: string
}

export type GetUser = {
    id: string
    username: string
    email: string
    first_name: string
    last_name: string
    selected_categories: SelectedCategories
    favorited_articles: Article[]
    liked_articles: Article[]
    disliked_articles: Article[]
}

type SelectedCategories = {
    values: string[]
}

export type UserArticleActionData = {
    article_id: string
    action: UserArticleAction
}