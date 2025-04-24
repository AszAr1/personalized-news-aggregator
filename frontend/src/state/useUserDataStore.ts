import {create} from 'zustand'
import {persist, createJSONStorage} from "zustand/middleware";
import {GetUser} from "../types/user.ts";

interface UserDataState {
    userData: GetUser | null,
    setUserData: (updateFn: (prev: GetUser) => GetUser) => void,
}

const useUserDataStore = create(
    persist<UserDataState>(
        (set) => ({
            userData: null,
            setUserData: (updateFn: (prev: GetUser) => GetUser) => 
                set((state) => ({ userData: updateFn(state.userData as GetUser) })),
        }),
        {
            name: 'user-data-storage',
            storage: createJSONStorage(() => sessionStorage),
        },
    )
)


function useUserData() {
    const userData = useUserDataStore((state) => state.userData)
    const setUserData = useUserDataStore((state) => state.setUserData)

    return {userData, setUserData}
}

export default useUserData