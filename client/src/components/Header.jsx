import React from 'react'
import { Logo } from '../assets'
import { NavLink } from 'react-router-dom'
import { isActiveStyle, isNotActiveStyle } from '../utils/styles'

const Header = () => {
    return (
        <header className='flex items-center w-full p-4 md:py-2 md:px-6'>
            <NavLink to={"/"}>
                <img src={Logo} alt='Logo' className='w-16' />
            </NavLink>
            <ul className='flex items-center justify-center ml-7'>
                <li className='mx-5 text-lg'><NavLink to={'/home'} className={({ isActive }) => isActive ? isActiveStyle : isNotActiveStyle}>Home</NavLink></li>
                <li className='mx-5 text-lg'><NavLink to={'/aboutus'} className={({ isActive }) => isActive ? isActiveStyle : isNotActiveStyle}>About Us</NavLink></li>
            </ul>
        </header>
    )
}

export default Header