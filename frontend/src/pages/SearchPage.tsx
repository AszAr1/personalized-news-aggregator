import {useState, ChangeEvent, KeyboardEvent} from 'react';
import {Search} from "lucide-react"
import axios from "axios";
import loadingGif from "../assets/loading.gif";
import SearchList from "../components/SearchList.tsx";
import {SearchResult} from "../types/news.ts";
import useSearchResults from "../state/useSearchResultsStore.ts";

function SearchPage() {
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const {searchResults, setSearchResults} = useSearchResults()

    const handleInput = () => {
        setIsLoading(true)
        const params: { query: string | null } = {query: inputValue}
        axios.get<SearchResult[]>("http://localhost:8000/news/search", {params: params})
            .then(response => {
                setSearchResults(response.data)
            })
            .catch(error => {
                console.log(error)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleEnterPress();
        }
    }

    const handleEnterPress = () => {
        handleInput()
    }

    return <div className="flex flex-col">
        <div className='bg-gray-400 flex mt-14 mx-32 p-4 rounded-3xl gap-2 justify-center items-center'>
            <input className='w-full rounded-lg focus:outline-none p-2'
                   type='text' value={inputValue} onChange={handleInputChange} onKeyDown={handleKeyDown}/>
            <Search size={32} className="" onClick={handleInput}/>
        </div>
        {isLoading ? (
            <img src={loadingGif} alt="Loading" width='200' className="self-center"/>
        ) : (
            <SearchList search_results={searchResults}/>
        )}

    </div>
}

    export default SearchPage;