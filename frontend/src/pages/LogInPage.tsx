import { useState, ChangeEvent, FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext.tsx';
import { useNavigate } from 'react-router-dom';


function LogInPage() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value)
    }
    const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value)
    }

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        login({ password: password, username: username })
        navigate("/") 
    }

    return <div className="flex justify-center items-center w-full">
        <div className='bg-gray-400 w-80 h-80 p-5 mt-10'>
            <form className="flex flex-col gap-16" onSubmit={handleSubmit}>
                <div className="w-full flex flex-col px-5 text-xl">
                    <label>Username</label>
                    <input value={username} onChange={handleUsernameChange} type="text" />
                    <label>Password</label>
                    <input value={password} onChange={handlePasswordChange} type="password" />
                </div>
                <div className="w-ful flex flex-col justify-end items-center h-full">
                    <input type="submit" value="OK" className='bg-white w-24 h-10' />
                </div>
            </form>
        </div>
    </div>
}

export default LogInPage;