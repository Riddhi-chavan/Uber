import React, { useState } from 'react'
import { Link, Links } from 'react-router-dom'

const CaptainLogin = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [captainData , setCaptainData] = useState({})

  const submitHandler = (e)=> {
    e.preventDefault()
    setCaptainData({
      email : email,
      password : password
    })
    console.log(captainData);
    
    setEmail("")
    setPassword("")    
  }
  return (
    <div className='p-7 h-screen flex flex-col justify-between'>
      <div>
        <img className='w-16 mb-6' src="/captain-logo.png" alt="" />
        <form onSubmit={(e) => {
          submitHandler(e)
        }}>
          <h3 className='text-lg font-medium mb-2'>What's your email</h3>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
            }}
            required
            placeholder='email@example.com'
            className='bg-[#eeeeee] mb-7 rounded px-4  py-2 border w-full text-lg placeholder:text-base'

          />
          <h3 className='text-lg font-medium mb-2'>Enter password</h3>
          <input  
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
          }} 
          type="password" 
          required 
          placeholder='password' 
          className='bg-[#eeeeee] mb-7 rounded px-4  py-2 border w-full text-lg placeholder:text-base' />
          <button className='bg-[#111] text-[#fff] font-semibold mb-3 rounded px-4  py-2  w-full text--lg placeholder:text-base' type='submit'>Login</button>
          <p className='text-center'>Join a fleet? <Link to="/captain-signup"  className='text-blue-600'>Register as a Captain</Link></p>
          
        </form>
      </div>
      <div>
        <Link  to="/login" className='bg-[#d5622d] flex items-center justify-center text-[#fff] font-semibold mb-5 rounded px-4  py-2  w-full text--lg placeholder:text-base'>Sign in as User</Link>

      </div>
    </div>
  )
}

export default CaptainLogin