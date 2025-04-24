import { create } from 'zustand'

interface HiddenCategoriesState {
    categories: string[];
    setCategories: (newCategories: string[]) => void;
}

const useCategoryCounterStore = create<HiddenCategoriesState>((set) => ({
    categories: [],
    setCategories: (newCategories: string[]) => set(() => ({ categories: newCategories })),
}))

function useHiddenCategories() {
    const categories = useCategoryCounterStore((state) => state.categories)
    const setCategories = useCategoryCounterStore((state) => state.setCategories)

    return { categories, setCategories }
}

export default useHiddenCategories;