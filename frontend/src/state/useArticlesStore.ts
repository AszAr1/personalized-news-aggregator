import {create} from 'zustand'
import {Article} from '../types/news'

interface ArticlesState {
    articles: Article[];
    setArticles: (newArticles: Article[]) => void;
}

const useArticlesStore = create<ArticlesState>((set) => ({
    articles: [],
    setArticles: (newArticles: Article[]) => set(() => ({articles: newArticles})),
}))

function useArticles() {
    const articles = useArticlesStore((state) => state.articles)
    const setArticles = useArticlesStore((state) => state.setArticles)

    return { articles, setArticles }
}

export default useArticles;