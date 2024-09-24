import React, { useEffect, useState } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { Home, Login, GroupView } from './components'
import { AnimatePresence } from 'framer-motion'
import { getAuth } from 'firebase/auth'
import { app } from './config/firebase.config'
import { validateUserJWTToken } from '../src/api'

const App = () => {
    const firebaseAuth = getAuth(app)
    const navigate = useNavigate();

    const [auth, setAuth] = useState(false || window.localStorage.getItem("auth") === "true")

    useEffect(() => {
        firebaseAuth.onAuthStateChanged(cred => {
            if (cred) {
                cred.getIdToken().then(token => {
                    validateUserJWTToken(token).then(data => {
                        console.log(data)
                    })
                })
            } else {
                setAuth(false)
                window.localStorage.setItem("auth", "false")
                navigate("/login")
            }
        })
    }, [firebaseAuth, navigate, setAuth])

    return (
        <AnimatePresence mode="wait">
            <div className='h-auto min-w-[680px] bg-primary flex justify-center items-center'>
                <Routes>
                    <Route path='/login' element={<Login setAuth={setAuth} />} />
                    <Route path='/*' element={<Home />} />
                    <Route path='/Group' element={<GroupView />} />
                </Routes>
            </div>
        </AnimatePresence>

    )
}

export default App