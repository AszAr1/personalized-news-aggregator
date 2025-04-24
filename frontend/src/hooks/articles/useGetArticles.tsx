import { useQuery } from '@tanstack/react-query';
import { GetArticlesParams, PaginatedResponse } from '../../types/news';
import { getArticlesRequest } from '../../api/requests/articles/getArticlesRequest';
import { useMemo } from 'react';
import useArticles from '../../state/useArticlesStore';
import { useAuth } from '../../contexts/AuthContext';
import useUserData from '../../state/useUserDataStore';

export type useGetArticlesProps = {
    page: number
    lastUpdate: string | null
    selectedCategory: string | null
}

export const useGetArticles = ({ page, lastUpdate, selectedCategory }: useGetArticlesProps) => {
    const { setArticles } = useArticles()
    const { isAuthenticated } = useAuth()
    const { userData } = useUserData()

    const categories = useMemo(() => (
        selectedCategory ? 
        selectedCategory : 
        (isAuthenticated && userData ? userData.selected_categories.values.join(',') : "")
    ), [isAuthenticated, userData, selectedCategory]);

    return useQuery<PaginatedResponse>({
        queryKey: ['news', page, categories],
        queryFn: async () => {
            const params: GetArticlesParams = {
                page,
                "last-update": lastUpdate,
                categories: categories
            };
            const articles = await getArticlesRequest(params);
            console.log("useGetArticles: articles", articles)
            setArticles(articles.results)
            return articles
        },
        staleTime: 1000 * 60 * 20,
        enabled: page > 0,
        refetchOnWindowFocus: false
    });
};