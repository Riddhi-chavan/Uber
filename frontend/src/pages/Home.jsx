import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div>
      <div className='bg-contain   bg-[url(https://images.unsplash.com/photo-1647424825116-fbf8b9415fc5?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)] h-screen flex pt-8   flex-col justify-between  w-full bg-red-400'>
        <img className='w-16 ml-9' src="/uberLogo.png" alt="" />
        <div className='bg-white pb-4 p-4 px-4 flex flex-col gap-4'>
          <h2 className='text-2xl font-bold'>Get Started with Uber</h2>
          <Link  to="/login" className=' flex items-center justify-center w-full  bg-black text-white py-2.5 rounded-lg mt-4'>Continue</Link>
        </div>
      </div>
    </div>
  )
}

export default Home