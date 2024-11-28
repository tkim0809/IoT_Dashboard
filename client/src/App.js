import React, { useEffect, useState } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { Home, Login, GroupView, Management, GroupList } from './components'
import { AnimatePresence } from 'framer-motion'
import { getAuth } from 'firebase/auth'
import { app } from './config/firebase.config'
import { validateUserJWTToken } from '../src/api'
import { useStateValue } from "./context/StateProvider";
import { actionType } from './context/reducer'
// import (useStateValue)

const App = () => {
    const firebaseAuth = getAuth(app)
    const navigate = useNavigate();

    const [{ user }, dispatch] = useStateValue();

    const [auth, setAuth] = useState(false || window.localStorage.getItem("auth") === "true")

    useEffect(() => {
        firebaseAuth.onAuthStateChanged(cred => {
            if (cred) {
                cred.getIdToken().then(token => {
                    validateUserJWTToken(token).then(data => {
                        dispatch({
                            type: actionType.SET_USER,
                            user: data
                        })
                    })
                })
            } else {
                setAuth(false)
                window.localStorage.setItem("auth", "false")
                dispatch({
                    type: actionType.SET_USER,
                    user: null,
                })
                navigate("/login")
            }
        })
    }, [firebaseAuth, navigate, setAuth])

    return (
        <AnimatePresence mode="wait">
            <div className='h-auto min-w-[680px] bg-primary flex justify-center items-center'>
                <Routes>
                    <Route path='/login' element={<Login setAuth={setAuth} />} />
                    <Route path='/home' element={<Home />} />
                    <Route path='/*' element={<GroupView />} />
                    <Route path='/Group-list' element={<GroupList />} />
                    <Route path='/management' element={<Management />} />

                </Routes>
            </div>
        </AnimatePresence>

    )
}

export default App