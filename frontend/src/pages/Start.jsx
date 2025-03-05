import React from 'react'
import { Link } from 'react-router-dom'

const Start = () => {
  return (
    <div className="bg-black min-h-screen w-full md:flex items-center justify-center h-screen">
      <div className='md:hidden bg-cover bg-[url(/getstarted.webp)] h-screen flex pt-8   flex-col justify-between  w-full '>
        <img className='w-16 ml-9' src="/uberLogo.png" alt="" />
        <div className='bg-white pb-4 p-4 px-4 flex flex-col gap-4'>
          <h2 className='text-[30px] font-bold'>Get Started with Uber</h2>
          <Link to="/login" className=' flex items-center justify-center w-full  bg-black text-white py-2.5 rounded-lg mt-4'>Continue</Link>
        </div>
      </div>

      <div className='hidden  md:block w-full h-screen max-w-6xl'>
        <img className='w-16 ' src="/uberLogo.png" alt="" />
        <div className="hidden md:flex max-w-6xl w-full mx-4 lg:mx-auto h-3/4 items-center  overflow-hidden">
          <div className='w-[50%] '>

            <div>
              <p className='text-[44px] text-white'>Get Started with Uber</p>
            </div>
            <div>
              <Link to="/login" className=' flex items-center justify-center w-full max-w-64  bg-white
             text-black py-2.5 rounded-lg mt-4'>Continue</Link>
            </div>
          </div>
          <div className=' w-[50%] rounded-xl'>
              <img src='/getstarted.webp'/>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Start