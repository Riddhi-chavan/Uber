import React, { useContext, useState } from 'react'
import { Link , useNavigate } from 'react-router-dom'
import axios from "axios"
import { UserDataContext } from '../context/UserContext' 

const UserSignup = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [userData, setUserData] = useState({})


  const { user, setUser} = useContext(UserDataContext)

  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault()
    const newUser = {
      fullname: {
        firstname: firstName,
        lastname: lastName,
      },
      email: email,
      password: password
    }

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register` , newUser)
    if(response.status === 201){
      const data = response.data
      setUser(data.user)
      navigate("/home")
    }
    console.log(userData);
    setEmail("")
    setFirstName("")
    setLastName("")
    setPassword("")
  }
  return (
    <div className='p-7 h-screen flex flex-col justify-between'>
      <div>
        <img className='w-16 mb-10' src="https://logos-world.net/wp-content/uploads/2020/05/Uber-Logo.png" alt="" />
        <form onSubmit={(e) => {
          submitHandler(e)
        }}>
          <h3 className='text-base font-medium mb-2'>What's your name</h3>
          <div className='flex gap-4 mb-6'>
            <input
              type="text"
              required
              placeholder='First name'
              className='bg-[#eeeeee] rounded px-4  py-2 border w-1/2  text-base placeholder:text-sm'
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value)
              }}
            />
            <input
              type="text"
              required
              placeholder='Last name'
              className='bg-[#eeeeee]  rounded px-4  w-1/2 py-2 border  text-base placeholder:text-sm'
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value)
              }}
            />
          </div>
          <h3 className='text-base font-medium mb-2'>What's your email</h3>
          <input
            type="email"
            required
            placeholder='email@example.com'
            className='bg-[#eeeeee] mb-6 rounded px-4  py-2 border w-full text-base placeholder:text-sm'
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
            }}
          />
          <h3 className='text-base font-medium mb-2'>Enter password</h3>
          <input
            type="password"
            required
            placeholder='password'
            className='bg-[#eeeeee] mb-6 rounded px-4  py-2 border w-full text-base placeholder:text-base'
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
            }}
          />
          <button className='bg-[#111] text-[#fff] font-semibold mb-3 rounded px-4  py-2  w-full text-lg placeholder:text-sm' type='submit'>Create account</button>
          <p className='text-center'>Already have a account? <Link to="/login" className='text-blue-600'>Login here</Link></p>

        </form>
      </div>
      <div>
        <p className='text-[10px] leading-tight'>This site is protected by reCAPTCHA and the <span className='underline'>Google Privacy Policy</span> and <span className='underline'>Terms of Service apply</span>.</p>
      </div>
    </div>
  )
}

export default UserSignup