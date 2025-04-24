import { useState } from "react";
import { useParams } from "react-router-dom";
import useArticles from "../state/useArticlesStore.ts";
import { useEffect } from "react";
import loadingGif from '../assets/loading.gif'
import ArticlesList from "../components/ArticlesList.tsx";
import PaginationComponent from "../components/PaginationComponent.tsx";
import { useGetArticles } from "../hooks/articles/useGetArticles.tsx";

export type CategoryPageProps = {
    pageNumber: number,
    setPageNumber: (newPageNumber: number) => void
}

function CategoryPage(props: CategoryPageProps) {
    const { category } = useParams();
    const { articles, setArticles } = useArticles()
    const [pagesCount, setPagesCount] = useState(0)
    const { data: articlesResponse, isLoading, isError, error } = useGetArticles({
        "page": props.pageNumber,
        lastUpdate: localStorage.getItem('last-update'),
        selectedCategory: category!,
    })

    useEffect(() => {
        if (articlesResponse) {
            const lastUpdate = localStorage.getItem("last-update")
            setArticles(articlesResponse.results)
            setPagesCount(articlesResponse.pagesCount)
            
            const shouldUpdate = !lastUpdate || 
                (new Date().getTime() - (new Date(lastUpdate).getTime() + (1000 * 3600 * 3)) >= 1000 * 60 * 10)
            console.log(
                "HomePage: new Date().getTime() - (new Date(lastUpdate).getTime() + (1000 * 3600 * 3))", 
                new Date().getTime() - (new Date(lastUpdate!).getTime() + (1000 * 3600 * 3))
            )

            if (shouldUpdate) {
                const newUpdate = new Date().toISOString().split('.')[0]
                console.log("HomePage: new Date()", new Date())
                console.log("HomePage: newUpdate", newUpdate)
                localStorage.setItem('last-update', newUpdate)
            }
        }
    }, [articlesResponse, setArticles]);



    return <div className="flex flex-col">
        {isLoading ? (
            <img src={loadingGif} alt="Loading" width='200' className="self-center" />
        ) : (<>
            <div className="grid grid-rows-4 grid-cols-4 gap-2 mt-1 mx-1">
                <ArticlesList articles={articles} />
            </div>
            <PaginationComponent pageCount={pagesCount} pageNumber={props.pageNumber} changePageFunc={props.setPageNumber} />
        </>)}
    </div>
}

export default CategoryPage;
