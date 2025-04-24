import { Article } from "../types/news.ts";
import ArticleComponent from "./ArticleComponent.tsx";

type ArticlesListProps = {
    articles: Article[];
}

function ArticlesList(props: ArticlesListProps) {
    return <>
        {props.articles.map((article: Article, index: number) => (
            <ArticleComponent key={index} article={article} />
        ))}
    </>
}

export default ArticlesList;