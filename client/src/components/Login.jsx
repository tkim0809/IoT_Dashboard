import React from 'react'
import { LoginBg } from "../assets"

const Login = () => {
    return (
        <div className='w-screen h-screen relative overflow-hidden flex'>

            {/* background image */}
            <img src={LoginBg} className='w-full h-full object-cover absolute' alt='' />
        </div>
    )
}

export default Login