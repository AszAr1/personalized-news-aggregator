import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import SignUpCategoryModal from "../components/SignUpCategoryModal.tsx";
import { useAuth } from '../contexts/AuthContext.tsx';
import { useToast } from '../contexts/ToastContext.tsx';


function SignUpPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userCategories, setUserCategories] = useState<Map<string, number>>(new Map<string, number>())
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { register } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const handleRegister = () => {

    console.log('SignUpPage: userCategories', userCategories)
    const categories = Array.from(userCategories.entries())
      .filter(([, value]) => value === 1).map(([key]) => key);

    if (categories.length < 1) {
      showToast({
        message: "No categories were chosen",
        type: "error",
      })
      return
    }
    console.log('SignUpPage: categories', categories)
    register({
      email: email,
      username: username,
      password: password,
      selected_categories: { values: categories }
    })
    navigate("/")
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const openModal = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (email !== '' && username !== '' && password !== '') {
      setIsModalOpen(true)
    } else {
      showToast({
        message: "Fill in all fields",
        type: "error"
      })
    }
  }

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value)
  }
  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
  }
  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  }


  return <div className="flex justify-center items-center w-full">
    <div className='bg-gray-400 w-80 h-80 p-5 mt-10'>
      <form className="flex flex-col gap-16" onSubmit={openModal}>
        <div className="w-full flex flex-col px-5 text-xl">
          <label>Username</label>
          <input value={username} onChange={handleUsernameChange} type="text" minLength={5} />
          <label>Email</label>
          <input value={email} onChange={handleEmailChange} type="email" />
          <label>Password</label>
          <input value={password} onChange={handlePasswordChange} type="password" minLength={4} />
        </div>
        <div className="w-ful flex justify-center items-center">
          <input type="submit" value="Next" className='bg-white w-24 h-10' />
        </div>
      </form>
    </div>
    {isModalOpen &&
      <SignUpCategoryModal
        handleRegister={handleRegister}
        closeModalFunc={closeModal}
        setUserCategoriesFunc={setUserCategories}
      />
    }
  </div>
}

export default SignUpPage;