import { GetUser } from "./user"

export type PaginatedResponse = {
    pagesCount: number
    next: string | null
    previous: string | null
    results: Article[]
}

export type Article = {
    id: string
    title: string
    url: string
    image: string
    views_count: number
    source: Source
    category: Category
    users_liked: GetUser[]
    users_disliked: GetUser[]
    users_favorited: GetUser[]
    published_at: string
    see_more: string
}

export type SearchResult = {
    title: string
    body: string
    published_at: string
    url: string
}

export type Source = {
    id: string
    link: string
}

export type Category = {
    id: string
    name: string
}

export type GetArticlesParams = {
    page: number
    "last-update": string | null
    categories: string
}