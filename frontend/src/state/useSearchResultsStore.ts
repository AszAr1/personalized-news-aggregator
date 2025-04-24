import {create} from 'zustand'
import {SearchResult} from '../types/news'

interface SearchResultsState {
    searchResults: SearchResult[];
    setSearchResults: (newArticles: SearchResult[]) => void;
}

const useSearchResultsStore = create<SearchResultsState>((set) => ({
    searchResults: [],
    setSearchResults: (newSearchResults: SearchResult[]) => set(() => ({searchResults: newSearchResults})),
}))

function useSearchResults() {
    const searchResults = useSearchResultsStore((state) => state.searchResults)
    const setSearchResults = useSearchResultsStore((state) => state.setSearchResults)

    return { searchResults, setSearchResults }
}

export default useSearchResults;