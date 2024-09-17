import React, { useState } from 'react'
import { LoginBg, } from "../assets"
import { LoginInput } from '../components'
import { motion } from "framer-motion"
import { buttonClick } from '../animations'
import { FcGoogle } from 'react-icons/fc'
import { FaEnvelope, FaLock } from "../assets/icons"

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
            <div className='flex flex-col items-center bg-lightOverlay w-[80%] md:w-508 h-full z-10 backdrop-blur-md p-4 px-4 py-12 gap-6'>
                {/* TODO: top logo section */}
                <div className='flex items-center justify-start gap-4 w-full'>
                    <p className='text-cyan-400 font-semibold text-2xl'>IdeaNova</p>
                </div>
                {/* TODO: welcome text */}
                <p className='text-3xl font-semibold text-cyan-400'>Welcome Back</p>
                {!isSignUp ? (
                    <p className='text-xl text-cyan-600 -mt-6'>Sign in with following</p>
                ) : (
                    <p className='text-xl text-cyan-600 -mt-6'>Sign up with following</p>
                )}
                {/* TODO: input section */}
                <div className='w-full flex flex-col items-center justify-center gap-6 px-4 md:px-12 py-4'>
                    <LoginInput placeHolder={"User Name"} icon={<FaEnvelope className='text-xl text-cyan-200' />} inputState={userName} inputStateFunc={setUserName} type="username" isSignUp={isSignUp} />

                    <LoginInput placeHolder={"Password"} icon={<FaLock className='text-xl text-cyan-200' />} inputState={password} inputStateFunc={setPassword} type="password" isSignUp={isSignUp} />

                    {isSignUp && (
                        <LoginInput placeHolder={"Confirm Password"} icon={<FaLock className='text-xl text-cyan-200' />} inputState={confirm_password} inputStateFunc={setConfirm_password} type="password" isSignUp={isSignUp} />
                    )}

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
                    {isSignUp ? (
                        <motion.button {...buttonClick} className='w-full px-4 py-2 rounded-md bg-red-400 cursor-pointer text-white text-xl hover:bg-red-500 transition-all duration-150'>
                            Sign Up
                        </motion.button>
                    ) : (
                        <motion.button {...buttonClick} className='w-full px-4 py-2 rounded-md bg-red-400 cursor-pointer text-white text-xl hover:bg-red-500 transition-all duration-150'>
                            Sign In
                        </motion.button>
                    )}
                </div>

                <div className='flex items-center justify-between gap-16'>
                    <div className='w-24 h-[1px] rounded-md bg-white'></div>
                    <p className='text-white'>or</p>
                    <div className='w-24 h-[1px] rounded-md bg-white'></div>
                </div>

                <motion.div {...buttonClick} className='flex items-center justify-center px-20 py-2 bg-lightOverlay backdrop-blur-md cursor-pointer rounded-3xl gap-4'>
                    <FcGoogle className="text-3xl" />
                    <p className='text-base text-headingColor'>Sign in with Google</p>
                </motion.div>
            </div>
        </div>
    )
}

export default Login