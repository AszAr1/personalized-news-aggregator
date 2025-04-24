import {MouseEvent, useEffect} from 'react';
import {Link, useNavigate} from "react-router"

import {Search, Ellipsis} from "lucide-react";
import useHiddenCategories from "../state/useHiddenCategoriesStore.ts";
import useIsCategoryModalOpen from '../state/useIsCategoryModalOpenStore.ts'
import CategoriesModal from './CategoriesModal.tsx'
import blankProfilePicture from "../assets/blankProfilePicture.jpg";
import { useAuth } from '../contexts/AuthContext.tsx';

export type HeaderProps = {
    setPageNumber: (newPageNumber: number) => void
}

function getHiddenCategories(screenWidth: number) {
    if (screenWidth >= 1280) {
        return [];
    } else if (screenWidth >= 1024) {
        return ['Culture'];
    } else if (screenWidth >= 768) {
        return ['Health', 'Politics', 'Culture'];
    } else {
        return ['Sports', 'Technology', 'Business', 'Health', 'Politics', 'Culture'];
    }
}

export function Header(props: HeaderProps) {
    const {isModalOpen, setIsModalOpen} = useIsCategoryModalOpen()
    const {categories, setCategories} = useHiddenCategories()
    const {isAuthenticated} = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        const screenWidth = window.innerWidth
        const newCategories = getHiddenCategories(screenWidth)
        if (JSON.stringify(categories) !== JSON.stringify(newCategories)) {
            setCategories(newCategories);
        }
        const handleResize = () => {
            const updatedScreenWidth = window.innerWidth;
            const newCategoriesOnResize = getHiddenCategories(updatedScreenWidth);
            if (JSON.stringify(categories) !== JSON.stringify(newCategoriesOnResize)) {
                setCategories(newCategoriesOnResize);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [categories, setCategories]);

    const openModal = () => {
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
    }

    const handleSearchClick = () => {
        navigate('/search')
    }

    const handleCategoryNavigate = (e: MouseEvent<HTMLButtonElement>, to: string) => {
        e.preventDefault()
        navigate(to)
        props.setPageNumber(1)
    }

    return <header
        className="bg-black text-white flex gap-x-3 justify-between items-center p-3 md:text-base lg:text-lg xl:text-2xl">
        <Search size={32} className="ml-2 md:ml-3 lg:ml-4" onClick={handleSearchClick}/>
        <div className="flex sm:gap-x-6 gap-x-2 items-center">
            { isAuthenticated ? (
                <button onClick={(e) => handleCategoryNavigate(e, '/')} className="">Моя лента</button>
            ) : (
                <button onClick={(e) => handleCategoryNavigate(e, '/')} className="">Главная</button>
            )}
            <button onClick={(e) => handleCategoryNavigate(e, '/Sports')} className="hidden sm:block">Спорт</button>
            <button onClick={(e) => handleCategoryNavigate(e, '/Tech')} className="hidden sm:block">Технологии</button>
            <button onClick={(e) => handleCategoryNavigate(e, '/Business')} className="hidden md:block">Экономика</button>
            <button onClick={(e) => handleCategoryNavigate(e, '/Health')} className="hidden lg:block">Здоровье</button>
            <button onClick={(e) => handleCategoryNavigate(e, '/Politics')} className="hidden lg:block">Политика</button>
            <button onClick={(e) => handleCategoryNavigate(e, '/Culture')} className="hidden xl:block">Культура</button>
            <Ellipsis size={32} className="block xl:hidden" onClick={openModal}/>
            {isModalOpen &&
                <CategoriesModal closeModalFunc={closeModal} categories={categories}/>}
        </div>
        <div>
            { isAuthenticated ? (
                <Link to={'/profile'} className='mr-5 flex justify-center items-center'>
                    <img src={blankProfilePicture} alt="Profile" width={40}/>
                </Link>
            ) : (
                <div className="flex gap-x-2 justify-center lg:mr-4 text-sm items-center">
                    <Link to="/login" className="bg-white text-black px-2 py-2">Log in</Link>
                    <Link to='/signup' className="">Sign up</Link>
                </div>
            )}
        </div>

    </header>
}