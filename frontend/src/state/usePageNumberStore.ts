import {create} from 'zustand'
import {persist, createJSONStorage} from "zustand/middleware";

interface PageNumberState {
    pageNumber: number,
    setPageNumber: (newPageNumber: number) => void,
}

const usePageNumberStore = create(
    persist<PageNumberState>(
        (set) => ({
            pageNumber: 1,
            setPageNumber: (newPageNumber: number) => set(() => ({pageNumber: newPageNumber})),
        }),
        {
            name: 'page-number-storage',
            storage: createJSONStorage(() => sessionStorage),
        },
    )
)


function usePageNumber() {
    const pageNumber = usePageNumberStore((state) => state.pageNumber)
    const setPageNumber = usePageNumberStore((state) => state.setPageNumber)

    return {pageNumber, setPageNumber}
}

export default usePageNumber