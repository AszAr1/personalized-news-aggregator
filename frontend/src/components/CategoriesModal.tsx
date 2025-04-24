// import {useState, useEffect} from 'react'
import { useNavigate } from "react-router-dom";
import { X } from 'lucide-react'
import PropTypes from 'prop-types';
import { getTranslatedCategory } from "../utils/getRussianCategory"

type CategoriesModalProps = {
    categories: string[],
    closeModalFunc: () => void,
}

function CategoriesModal(props: CategoriesModalProps) {
    const navigate = useNavigate()

    const handleClick = (category: string) => {
        props.closeModalFunc()
        navigate(`/${category}`)
    }


    return <div className="absolute top-6 right-40 w-28 bg-white text-black p-2.5 rounded-lg shadow-md">
        <div className="flex items-start justify-center w-full">
            <ul className="list-none">
                {props.categories.map((category, index) => (
                    <li key={index} onClick={() => handleClick(category)}>{getTranslatedCategory(category)}</li>
                ))}
            </ul>
            <X onClick={() => props.closeModalFunc()} />
        </div>
    </div>
}

CategoriesModal.propTypes = {
    categories: PropTypes.array.isRequired,
    closeModalFunc: PropTypes.func.isRequired,
}

export default CategoriesModal;