import React, { useEffect, useState } from 'react'
import { LoginBg, Logo, } from "../assets"
import { LoginInput } from '../components'
import { motion } from "framer-motion"
import { buttonClick } from '../animations'
import { FcGoogle } from 'react-icons/fc'
import { FaEnvelope, FaLock } from "../assets/icons"
import { useNavigate } from "react-router-dom"

import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { app } from "../config/firebase.config"
import { validateUserJWTToken } from '../api'
import { useStateValue } from '../context/StateProvider'
import { actionType } from '../context/reducer'

const Login = ({ setAuth }) => {

    const [userEmail, setUserEmail] = useState("")
    const [isSignUp, setIsSignUp] = useState(false)
    const [password, setPassword] = useState("")
    const [confirm_password, setConfirm_password] = useState("")

    const firebaseAuth = getAuth(app)
    const provider = new GoogleAuthProvider();
    const [{ user }, dispatch] = useStateValue();

    const navigate = useNavigate()

    const loginWithGoogle = async () => {
        await signInWithPopup(firebaseAuth, provider).then(userCred => {
            if (userCred) {
                setAuth(true)
                window.localStorage.setItem("auth", "true")

                firebaseAuth.onAuthStateChanged(userCred => {
                    if (userCred) {
                        userCred.getIdToken().then(token => {
                            validateUserJWTToken(token).then(data => {
                                dispatch({
                                    type: actionType.SET_USER,
                                    user: data
                                })
                            })
                            navigate("/", { replace: true })
                        })
                    } else {
                        setAuth(false)
                        dispatch({
                            type: actionType.SET_USER,
                            user: null
                        })
                        navigate("/login")
                    }
                }

                )
            }
        })
    }

    const signUpWithEmailPass = async () => {
        if (userEmail === '' || password === '' || confirm_password === '') {
            //Alert message

        } else {
            if (password === confirm_password) {
                setUserEmail("")
                setConfirm_password("")
                setPassword("")
                await createUserWithEmailAndPassword(firebaseAuth, userEmail, password).then(userCred => {
                    if (userCred) {
                        setAuth(true)
                        window.localStorage.setItem("auth", "true")

                        firebaseAuth.onAuthStateChanged(cred => {
                            if (cred) {
                                cred.getIdToken().then(token => {
                                    validateUserJWTToken(token).then(data => {
                                        console.log(data)
                                    })
                                    navigate("/", { replace: true })
                                })
                            } else {
                                setAuth(false)
                                navigate("/login")
                            }
                        })
                    }
                })
            } else {
                //Alert message

            }
        }
    }

    const signInWithEmailPass = async () => {
        if (userEmail !== "" && password !== "") {
            await signInWithEmailAndPassword(firebaseAuth, userEmail, password).then(userCred => {
                if (userCred) {
                    setAuth(true)
                    window.localStorage.setItem("auth", "true")

                    firebaseAuth.onAuthStateChanged(cred => {
                        if (cred) {
                            cred.getIdToken().then(token => {
                                validateUserJWTToken(token).then(data => {
                                    console.log(data)
                                })
                                navigate("/", { replace: true })
                            })
                        } else {
                            setAuth(false)
                            navigate("/login")
                        }
                    })
                }
            })
        } else {
            //Alert message
        }
    }

    useEffect(() => {
        if (window.localStorage.getItem("auth") === "true") {
            navigate("/", { replace: true })
        }
    }, [navigate])


    return (
        <div className='w-screen h-screen relative overflow-hidden flex'>

            {/* background image */}
            <img src={LoginBg} className='w-full h-full object-cover absolute top-0 left-0' alt='' />

            {/* content box */}
            <div className='flex flex-col items-center bg-lightOverlay w-[80%] md:w-508 h-full z-10 backdrop-blur-md p-4 px-4 py-12 gap-6'>
                {/* TODO: top logo section */}
                <div className='flex items-center justify-start gap-4 w-full'>
                    <img src={Logo} className="w-8" alt="" />
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
                    <LoginInput placeHolder={"User Email"} icon={<FaEnvelope className='text-xl text-cyan-200' />} inputState={userEmail} inputStateFunc={setUserEmail} type="useremail" isSignUp={isSignUp} />

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
                        <motion.button {...buttonClick} className='w-full px-4 py-2 rounded-md bg-red-400 cursor-pointer text-white text-xl hover:bg-red-500 transition-all duration-150'
                            onClick={signUpWithEmailPass}>
                            Sign Up
                        </motion.button>
                    ) : (
                        <motion.button {...buttonClick} className='w-full px-4 py-2 rounded-md bg-red-400 cursor-pointer text-white text-xl hover:bg-red-500 transition-all duration-150'
                            onClick={signInWithEmailPass}>
                            Sign In
                        </motion.button>
                    )}
                </div>

                <div className='flex items-center justify-between gap-16'>
                    <div className='w-24 h-[1px] rounded-md bg-white'></div>
                    <p className='text-white'>or</p>
                    <div className='w-24 h-[1px] rounded-md bg-white'></div>
                </div>

                <motion.div {...buttonClick} className='flex items-center justify-center px-20 py-2 bg-lightOverlay backdrop-blur-md cursor-pointer rounded-3xl gap-4'
                    onClick={loginWithGoogle}>
                    <FcGoogle className="text-3xl" />
                    <p className='text-base text-headingColor'>Sign in with Google</p>
                </motion.div>
            </div>
        </div>
    )
}

export default Login