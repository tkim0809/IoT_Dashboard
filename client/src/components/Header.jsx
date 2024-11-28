import React from 'react'
import { Logo } from '../assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { isActiveStyle, isNotActiveStyle } from '../utils/styles'
import { FaCrown } from 'react-icons/fa'
import { useStateValue } from '../context/StateProvider'
import { getAuth } from 'firebase/auth'
import { app } from '../config/firebase.config'
import { motion } from 'framer-motion'
import { useState } from 'react'

const Header = () => {
    const [{ user }, dispatch] = useStateValue();
    const [isMenu, setIsMenu] = useState(false);
    const navigate = useNavigate();

    const logOut = () => {
        const firebaseAuth = getAuth(app);
        firebaseAuth.signOut().then(() => {
            window.localStorage.setItem("auth", "false");
        }).catch((e) => console.log(e));
        navigate("/jwtVerification", { replace: true })
    }
    return (
        <header className='flex items-center w-full p-4 md:py-2 md:px-6 bg-white dark:bg-gray-900 transition-colors duration-300'>
        <NavLink to={"/"}>
            <img src={Logo} alt='Logo' className='w-16' />
        </NavLink>
        <ul className='flex items-center justify-center ml-7 dark:text-white text-white'>
            <li className='mx-5 text-lg' sx={{color: 'white'}}>
                <NavLink 
                    to={'/home'} 
                    className={({ isActive }) => 
                        isActive ? isActiveStyle : isNotActiveStyle
                    }>
                    Home
                </NavLink>
            </li>
            <li className='mx-5 text-lg'>
                <NavLink 
                    to={'/aboutus'} 
                    className={({ isActive }) => 
                        isActive ? isActiveStyle : isNotActiveStyle
                    }>
                    About Us
                </NavLink>
            </li>
        </ul>
    
        <div
            onMouseEnter={() => setIsMenu(true)}
            onMouseLeave={() => setIsMenu(false)}
            className='flex items-center ml-auto cursor-pointer gap-2 relative'>
            <img 
                src={user?.user.imageURL} 
                className='w-12 h-12 min-w-[44px] object-cover rounded-full shadow-lg' 
                alt="" 
                referrerPolicy="no-referrer" 
            />
            <div className='flex flex-col'>
                <p className='text-textColor dark:text-white text-lg hover:text-headingColor dark:hover:text-gray-300 font-semibold'>
                    {user?.user?.name}
                </p>
                <p className='flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 font-normal'>
                    {user?.user?.role === "admin" ? "Admin" : "Member"}
                    <FaCrown className='text-sm -ml-1 text-yellow-500' />
                </p>
            </div>
            {isMenu && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    className='absolute z-10 flex flex-col top-12 p-3 right-0 w-275 gap-3 bg-card dark:bg-gray-800 shadow-lg rounded-lg backdrop-blur-sm transition-colors duration-300'>
                    <NavLink to={'/userProfile'}>
                        <p className='text-base text-textColor dark:text-white hover:font-semibold duration-150 transition-all ease-in-out'>
                            Profile
                        </p>
                    </NavLink>
                    <p className='text-base text-textColor dark:text-white hover:font-semibold duration-150 transition-all ease-in-out'>
                        My Favorites
                    </p>
                    <hr className="dark:border-gray-600" />
    
                    {user?.user?.role === "admin" && (
                        <>
                            <NavLink to={"/management"}>
                                <p className='text-base text-textColor dark:text-white hover:font-semibold duration-150 transition-all ease-in-out'>
                                    Management
                                </p>
                            </NavLink>
                            <hr className="dark:border-gray-600" />
                        </>
                    )}
    
                    <p 
                        className='text-base text-textColor dark:text-white hover:font-semibold duration-150 transition-all ease-in-out' 
                        onClick={logOut}>
                        Sign Out
                    </p>
                </motion.div>
            )}
        </div>
    </header>
    )
}

export default Header