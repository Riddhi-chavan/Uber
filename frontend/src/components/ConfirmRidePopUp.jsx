import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'


const ConfirmRidePopUp = (props) => {
    const [OTP, setOTP] = useState('')
    const navigate = useNavigate()

    const submitHandler = async (e) => {
        e.preventDefault()
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/start-ride`, {
            params: {
                rideId: props.ride._id,
                otp: OTP
            },
            headers: {
                Authorization: `Bearer ${localStorage.getItem('Captaintoken')}`
            }
        })

        if (response.status === 200) {
            props.setConfirmRidePopPanel(false)
            props.setRidePopPanel(false)
            navigate('/captain-riding', { state: { ride: props.ride } })
        }
    }
    return (
        <div >
            <h5
                className='p-1 text-center absolute top-0 w-[93%] ' onClick={() => {
                    props.setConfirmRidePopPanel(false)
                }} >
                <i className="text-3xl text-gray-200  ri-arrow-down-wide-line"></i>
            </h5>
            <h3 className='text-2xl font-semibold mb-5'>Confirm this ride to Start</h3>
            <div className='flex items-center justify-between mt-4 p-3 bg-yellow-300 rounded-lg'>
                <div className='flex items-center gap-3 '>
                    <img className='h-12 w-12 rounded-full object-cover' src={props.ride?.user.profilePicture
                        ? `${import.meta.env.VITE_BASE_URL}/uploads/${props.ride?.user.profilePicture.split('/').pop()}`
                        : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7fhZviOpkU0AhT-Xc6odz6OK1asyriViVEw&s"
                    } alt="" />
                    <h2 className='text-lg font-medium capitalize'>{props.ride?.user.fullname.firstname}</h2>
                </div>
            </div>
            <div className='flex gap-2 flex-col justify-between items-center'>
                <div className='w-full mt-5'>
                    <div className='flex items-center gap-5 border-b-2 p-3'>
                        <i className=" text-lg ri-map-pin-user-fill"></i>
                        <div className=''>
                            <h3 className='text-lg font-medium'>562/11-A</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{props.ride?.pickup}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 border-b-2 p-3'>
                        <i className=" text-lg ri-map-pin-2-fill"></i>
                        <div className=''>
                            <h3 className='text-lg font-medium'>562/11-A</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{props.ride?.destination}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5  p-3'>
                        <i className="text-lg ri-currency-line"></i>
                        <div className=''>
                            <h3 className='text-lg font-medium'>₹{props.ride?.fare}</h3>
                            <p className='text-sm -mt-1 text-gray-600'>Cash Cash</p>
                        </div>
                    </div>


                </div>
                <div className='mt-6 w-full'>
                    <form onSubmit={submitHandler}>
                        <input
                            onChange={(e) => setOTP(e.target.value)}
                            value={OTP}
                            className='bg-[#eee] px-6 py-4 font-mono  text-lg rounded-lg  w-full mt-3'
                            type="text"
                            placeholder='Enter OTP' />
                        <button className='w-full text-lg flex justify-center mt-5 bg-green-600 text-white font-semibold p-3 rounded-lg'>Confirm</button>
                        <button className='w-full mt-2 bg-red-600 text-white font-semibold p-3 rounded-lg' onClick={() => {
                            props.setConfirmRidePopPanel(false)
                            props.setRidePopPanel(false)
                        }}>Cancel</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ConfirmRidePopUp