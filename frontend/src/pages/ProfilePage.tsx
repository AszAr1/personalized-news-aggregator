import useUserData from "../state/useUserDataStore.ts";
import blankProfilePicture from '../assets/blankProfilePicture.jpg'
import { useAuth } from "../contexts/AuthContext.tsx";
import { ChangeEvent, MouseEvent } from "react";

function ProfilePage() {
    const { userData } = useUserData()
    const { logout } = useAuth()

    const handleLogout = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        logout()
    }

    const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
    }

    return <div className="flex">
        <img src={blankProfilePicture} alt="Profile picture" width={100} className="rounded-2xl" />
        <input className="" value={userData?.username} onChange={handleOnChange}></input>
        <input className="" value={userData?.email} onChange={handleOnChange}></input>
        <input className="" value={userData?.first_name} onChange={handleOnChange}></input>
        <input className="" value={userData?.last_name} onChange={handleOnChange}></input>
        <button onClick={handleLogout} className="border-2 border-black my-3">Log out</button>
    </div>
}

export default ProfilePage;