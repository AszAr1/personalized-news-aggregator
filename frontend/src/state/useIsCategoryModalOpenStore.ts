import { create } from 'zustand'


interface IsCategoryModalOpenState {
    isModalOpen: boolean,
    setIsModalOpen: (isModalOpen: boolean) => void,
}

const useIsCategoryModalOpenStore = create<IsCategoryModalOpenState>((set) => ({
    isModalOpen: false,
    setIsModalOpen: (newIsModalOpen: boolean) => set(() => ({isModalOpen: newIsModalOpen})),
}))

function useIsCategoryModalOpen() {
    const isModalOpen = useIsCategoryModalOpenStore((state) => state.isModalOpen)
    const setIsModalOpen = useIsCategoryModalOpenStore((state) => state.setIsModalOpen)

    return { isModalOpen, setIsModalOpen }
}

export default useIsCategoryModalOpen;