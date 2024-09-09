import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Home, Login, GroupView } from './components'

const App = () => {
    return (
        <div className='w-screen h-screen bg-blue-400 flex justify-center items-center'>
            <Routes>
                <Route path='/login' element={<Login />} />
                <Route path='/*' element={<Home />} />
                <Route path='/Group' element= {<GroupView />} />
            </Routes>
        </div>
    )
}

export default App