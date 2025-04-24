import {create} from 'zustand'
import {persist, createJSONStorage} from "zustand/middleware";


interface UserLoggedInState {
    isLoggedIn: boolean
    setIsLoggedIn: (isLoggedIn: boolean) => void
}

const useIsUserLoggedInStore = create(
    persist<UserLoggedInState>(
        (set) => ({
            isLoggedIn: false,
            setIsLoggedIn: (isLoggedIn: boolean) => set(() => ({isLoggedIn: isLoggedIn})),
        }),
        {
            name: 'is-logged-in-storage',
            storage: createJSONStorage(() => sessionStorage),
        },
    ),
)


function useIsUserLoggedIn() {
    const isLoggedIn = useIsUserLoggedInStore((state) => state.isLoggedIn)
    const setIsLoggedIn = useIsUserLoggedInStore((state) => state.setIsLoggedIn)

    return {isLoggedIn, setIsLoggedIn}
}

export default useIsUserLoggedIn