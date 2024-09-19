import React, { useState } from 'react'

const LoginInput = ({ placeHolder, icon, inputState, inputStateFunc, type, isSignUp }) => {

    const [isFocus, setIsFocus] = useState(false);
    return (
        <div className={`flex items-center justify-center gap-4 bg-lightOverlay backdrop-blur-md rounded-md w-full px-4 py-2 ${isFocus ? "shadow-md shadow-red-400" : "shadow-none"}`}>
            {icon}
            <input type={type} placeholder={placeHolder} className='w-full h-full bg-transparent text-headingColor text-lg font-semibold border-none outline-none placeholder:text-cyan-950 placeholder:opacity-50'
                value={inputState}
                onChange={(e) => inputStateFunc(e.target.value)}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
            />
        </div>
    )
}

export default LoginInput