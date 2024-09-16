import React, { useState } from 'react'
import { LoginBg } from "../assets"
import { LoginInput } from '../components'
import { motion } from "framer-motion"
import { buttonClick } from '../animations'

const Login = () => {

    const [userName, setUserName] = useState("")
    const [isSignUp, setIsSignUp] = useState(false)
    const [password, setPassword] = useState("")
    const [confirm_password, setConfirm_password] = useState("")

    return (
        <div className='w-screen h-screen relative overflow-hidden flex'>

            {/* background image */}
            <img src={LoginBg} className='w-full h-full object-cover absolute top-0 left-0' alt='' />

            {/* content box */}
            <div className='flex flex-col items-center bg-lightOverlay w-[80%] md:w-508 h-full z-10 backdrop-blur-md p-4 px-4 py-12'>
                {/* TODO: top logo section */}

                {/* TODO: welcome text */}

                {/* TODO: input section */}
                <div>
                    <LoginInput placeHolder={"Email Here"} icon="" inputState={userName} inputStateFunc={setUserName} type="name" isSignUp={isSignUp} />


                    {!isSignUp ? (
                        <p>
                            Doesn't have an account:{" "} <motion.button {...buttonClick} className='text-red-400 underline cursor-pointer bg-transparent' onClick={() => setIsSignUp(true)}>Create one</motion.button>
                        </p>
                    ) : (
                        <p>
                            Already have an account{" "} <motion.button {...buttonClick} className='text-red-400 underline cursor-pointer bg-transparent' onClick={() => setIsSignUp(false)}>Sign-in here</motion.button>
                        </p>
                    )}



                    {/* button section */}
                </div>
            </div>
        </div>
    )
}

export default Login