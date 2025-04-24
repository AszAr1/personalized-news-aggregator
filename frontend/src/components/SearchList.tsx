import {SearchResult} from "../types/news.ts";

type SearchListProps = {
    search_results: SearchResult[];
}

function SearchList(props: SearchListProps) {
    return <div>
        {props.search_results.map((result: SearchResult, index: number) => (
            <div key={index} className="border-2 mx-8 my-2 px-5 py-2 rounded-lg border-gray-900">
                <a className="group" href={result.url} target='_blank'>
                    <div className="font-bold text-lg sm:text-xl lg:text-2xl group-hover:underline">
                        {result.title}
                    </div>
                    <div className="font-medium text-sm sm:text-base lg:text-lg">{result.body}</div>
                </a>
                <div className="font-thin flex gap-1">
                    <div className="">{result.published_at}</div>
                </div>
            </div>
        ))}
    </div>
}

export default SearchList;