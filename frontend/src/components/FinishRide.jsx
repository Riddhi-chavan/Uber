import axios from 'axios'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const FinishRide = (props) => {
    const navigate = useNavigate()
    async function endRide() {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/end-ride`, {
            rideId: props.ride._id,
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('Captaintoken')}`
            }
        })

        if (response.status === 200) {
            props.setFinishRidePanel(false)
            navigate('/captain-home')
        }
    }

    console.log('pfp', `${import.meta.env.VITE_BASE_URL}/uploads/${props.ride?.user.profilePicture.split('/').pop()}`)
    return (
        <div >
            <h5
                className='p-1 text-center absolute top-0 w-[93%] ' onClick={() => {
                    props.setFinishRidePanel(false)
                }} >
                <i className="text-3xl text-gray-200  ri-arrow-down-wide-line"></i>
            </h5>
            <h3 className='text-2xl font-semibold mb-5'>Finish this Ride</h3>
            <div className='flex items-center justify-between mt-4 p-4 border-yellow-300 border-2 rounded-lg'>
                <div className='flex items-center gap-3 '>
                    <img className='h-12 w-12 rounded-full object-cover' src={props.ride?.user.profilePicture
                        ? `${import.meta.env.VITE_BASE_URL}/uploads/${props.ride?.user.profilePicture.split('/').pop()}`
                        : "/pessenger.png"} alt="" />
                    <h2 className='text-lg font-medium'>{props.ride?.user.fullname.firstname}</h2>
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

                <div className='mt-10 w-full'>
                    <button
                        onClick={endRide}
                        className='w-full flex justify-center text-lg mt-5 bg-green-600 text-white font-semibold p-3 rounded-lg'>Finish Ride</button>
                    <p className=' mt-10 text-xs text-center'>Click on finish ride buttom if you have received the payment</p>
                </div>
            </div>
        </div>
    )
}

export default FinishRide