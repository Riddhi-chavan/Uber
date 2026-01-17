import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const ConfirmRidePopUp = (props) => {
    const [OTP, setOTP] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const submitHandler = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
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
        } catch (err) {
            setError('Invalid OTP. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='space-y-6'>
            {/* Header */}
            <div className='flex items-center justify-between'>
                <div>
                    <h3 className='text-2xl font-bold text-gray-900'>Start Ride</h3>
                    <p className='text-gray-500 mt-1'>Enter OTP to begin the trip</p>
                </div>
                <button
                    onClick={() => props.setConfirmRidePopPanel(false)}
                    className='w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors'
                >
                    <i className="ri-close-line text-xl text-gray-600"></i>
                </button>
            </div>

            {/* User Info Card */}
            <div className='user-card'>
                <img
                    className='user-avatar'
                    src={props.ride?.user?.profilePicture || `https://ui-avatars.com/api/?name=${props.ride?.user?.fullname?.firstname}+${props.ride?.user?.fullname?.lastname}&background=random`}
                    alt="Rider"
                />
                <div className='flex-1'>
                    <h2 className='font-semibold text-gray-900 capitalize'>
                        {props.ride?.user.fullname.firstname} {props.ride?.user.fullname.lastname}
                    </h2>
                    <p className='text-sm text-gray-500'>Verified Rider</p>
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

                <div className='info-row border-b-0'>
                    <div className='info-row-icon bg-green-100'>
                        <i className="ri-money-rupee-circle-line text-green-600"></i>
                    </div>
                    <div className='flex-1'>
                        <p className='text-sm text-gray-500'>Fare ({props.ride?.paymentMode})</p>
                        <p className='font-semibold text-gray-900 text-lg'>₹{props.ride?.fare}</p>
                    </div>
                </div>
            </div>

            {/* OTP Form */}
            <form onSubmit={submitHandler} className='space-y-4'>
                <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Enter 6-digit OTP from rider
                    </label>
                    <input
                        onChange={(e) => setOTP(e.target.value)}
                        value={OTP}
                        className='otp-input'
                        type="text"
                        maxLength={6}
                        placeholder='● ● ● ● ● ●'
                    />
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm flex items-center gap-2">
                        <i className="ri-error-warning-line"></i>
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={OTP.length !== 6 || loading}
                    className='btn-success btn-full btn-lg'
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <span className="spinner"></span>
                            Verifying...
                        </span>
                    ) : (
                        'Start Ride'
                    )}
                </button>

                <button
                    type="button"
                    className='btn-danger btn-full'
                    onClick={() => {
                        props.setConfirmRidePopPanel(false)
                        props.setRidePopPanel(false)
                    }}
                >
                    Cancel
                </button>
            </form>
        </div>
    )
}

export default ConfirmRidePopUp