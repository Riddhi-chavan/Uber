import axios from 'axios'
import React from 'react'
import { useNavigate } from 'react-router-dom'

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

    return (
        <div className='space-y-6'>
            {/* Header */}
            <div className='flex items-center justify-between'>
                <div>
                    <h3 className='text-2xl font-bold text-gray-900'>Complete Ride</h3>
                    <p className='text-gray-500 mt-1'>Confirm trip completion</p>
                </div>
                <button
                    onClick={() => props.setFinishRidePanel(false)}
                    className='w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors'
                >
                    <i className="ri-close-line text-xl text-gray-600"></i>
                </button>
            </div>

            {/* User Info Card */}
            <div className='user-card'>
                <img
                    className='user-avatar'
                    src={props.ride?.user.profilePicture}
                    alt="Rider"
                />
                <div className='flex-1'>
                    <h2 className='font-semibold text-gray-900 capitalize'>
                        {props.ride?.user.fullname.firstname} {props.ride?.user.fullname.lastname}
                    </h2>
                    <p className='text-sm text-gray-500'>Trip completed</p>
                </div>
            </div>

            {/* Trip Details */}
            <div className='space-y-1'>
                <div className='info-row'>
                    <div className='info-row-icon bg-gray-900'>
                        <i className="ri-map-pin-line text-white"></i>
                    </div>
                    <div className='flex-1'>
                        <p className='text-sm text-gray-500'>Pickup</p>
                        <p className='font-medium text-gray-900'>{props.ride?.pickup}</p>
                    </div>
                </div>

                <div className='info-row'>
                    <div className='info-row-icon' style={{ backgroundColor: '#06C167' }}>
                        <i className="ri-map-pin-fill text-white"></i>
                    </div>
                    <div className='flex-1'>
                        <p className='text-sm text-gray-500'>Destination</p>
                        <p className='font-medium text-gray-900'>{props.ride?.destination}</p>
                    </div>
                </div>
            </div>

            {/* Fare Card */}
            <div className='bg-gray-50 rounded-2xl p-5 flex items-center justify-between'>
                <div className='flex items-center gap-4'>
                    <div className='w-12 h-12 rounded-full bg-green-100 flex items-center justify-center'>
                        <i className="ri-money-rupee-circle-line text-2xl text-green-600"></i>
                    </div>
                    <div>
                        <p className='text-sm text-gray-500'>Trip Fare</p>
                        <p className='text-2xl font-bold text-gray-900'>₹{props.ride?.fare}</p>
                    </div>
                </div>
                <span className={`badge ${props.ride?.paymentMode === 'Cash' ? 'badge-warning' : 'badge-success'}`}>
                    {props.ride?.paymentMode}
                </span>
            </div>

            {/* Complete Button */}
            <div className='space-y-3'>
                <button
                    onClick={endRide}
                    className='btn-success btn-full btn-lg'
                >
                    <i className="ri-check-line mr-2"></i>
                    Complete Ride
                </button>

                <p className='text-xs text-center text-gray-400'>
                    Only complete the ride after receiving payment from the rider
                </p>
            </div>
        </div>
    )
}

export default FinishRide