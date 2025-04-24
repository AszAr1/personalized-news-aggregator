import businessImg from "../assets/Business.png"
import cultureImg from "../assets/Culture.png"
import sportsImg from "../assets/Sports.png"
import healthImg from "../assets/Health.png"
import techImg from "../assets/Technology.jpg"
import politicsImg from "../assets/Politics.jpg"
import { MouseEvent, useState } from "react";
import { getTranslatedCategory } from "../utils/getRussianCategory"

type SignUpCategoryModalProps = {
  closeModalFunc: () => void,
  handleRegister: () => void,
  setUserCategoriesFunc: (categories: Map<string, number>) => void,
}

type SelectedCategory = {
  image: string
  name: string
}

function SignUpCategoryModal(props: SignUpCategoryModalProps) {
  const [noCategoriesChosen, setNoCategoriesChosen] = useState(false)
  const [categories, setCategories] = useState<Map<string, number>>(new Map([
    ["Business", -1],
    ["Sports", -1],
    ["Culture", -1],
    ["Health", -1],
    ["Tech", -1],
    ["Politics", -1],
  ]))

  const changeCategoryValue = (category: string) => {
    setCategories(prevCategories => {
      const value = prevCategories.get(category);
      if (value === undefined) 
        return prevCategories;
      
      const newCategories = new Map(prevCategories);
      newCategories.set(category, value * -1);
      return newCategories;
    });
  }

  const handleOkClick = () => {
    if (Array.from(categories.values()).every(value => value === -1)) {
      setNoCategoriesChosen(true)
    } else {
      props.setUserCategoriesFunc(new Map(categories))
      props.closeModalFunc()
      props.handleRegister()
    }
  }

  const handleCancelClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    props.closeModalFunc()
  }

  return <div
    className="fixed flex items-center justify-center z-10 left-0 top-0 w-full h-full overflow-auto bg-black bg-opacity-80">
    <div className="bg-gray-200">
      <div className="grid grid-cols-3 grid-rows-2 gap-4 p-4">
        {[
          { image: sportsImg, name: 'Sports' },
          { image: businessImg, name: 'Business' },
          { image: techImg, name: 'Tech' },
          { image: cultureImg, name: 'Culture' },
          { image: healthImg, name: 'Health' },
          { image: politicsImg, name: 'Politics' },
        ].map((category: SelectedCategory, index: number) => (
          <div className="flex flex-col justify-between" key={index}>
            <img src={category.image} alt="Sports" width={200} />
            <div className='flex justify-between'>
              <label className='font-bold'>{getTranslatedCategory(category.name)}</label>
              <input
                type="checkbox"
                className='w-6 rounded-none'
                onChange={() => changeCategoryValue(category.name)}
              />
            </div>
          </div>
        ))}

      </div>
      <div className='flex flex-col w-full'>
        {noCategoriesChosen &&
          <div className="text-red-800 self-center">
            Choose at least one category!
          </div>
        }
        <div className="flex justify-between px-10">
          <button onClick={handleCancelClick}
            className='self-end mr-4 mb-2 text-xl p-2 hover:bg-gray-400 transition duration-150 ease-in-out'>
            Cancel
          </button>
          <button onClick={handleOkClick}
            className='self-end mr-4 mb-2 text-xl p-2 hover:bg-gray-400 transition duration-150 ease-in-out'>
            OK
          </button>
        </div>
      </div>
    </div>
  </div>
}

export default SignUpCategoryModal;