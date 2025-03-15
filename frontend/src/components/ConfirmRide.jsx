import React, { useState } from 'react'

export const ConfirmRide = (props) => {
    return (
        <div>
            <h5
                onClick={() => {
                    props.setConfirmedRidePanel(false)
                }}
                className='p-1 text-center absolute top-0 w-[93%] ' >
                <i className="text-3xl text-gray-200  ri-arrow-down-wide-line"></i>
            </h5>
            <h3 className='text-2xl font-semibold mb-5'>Confirm your Ride</h3>
            <div className='flex gap-2 flex-col justify-between items-center'>
                <img className='h-20 w-20 rounded-full object-cover' src={props.user.profilePicture
                    ? `${import.meta.env.VITE_BASE_URL}/uploads/${props.user.profilePicture.split('/').pop()}`
                    : "/pessenger.png"
                } alt="" />
                <div className='w-full mt-5'>
                    <div className='flex items-center gap-5 border-b-2 p-3'>
                        <i className=" text-lg ri-map-pin-user-fill"></i>
                        <div className=''>
                            <h3 className='text-lg font-medium'>Pickup Address</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{props.pickup}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 border-b-2 p-3'>
                        <i className=" text-lg ri-map-pin-2-fill"></i>
                        <div className=''>
                            <h3 className='text-lg font-medium'>Destination Address</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{props.destination}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3'>
                        <i className="text-lg ri-currency-line"></i>
                        <div className='relative w-full'>
                            <h3 className='text-lg font-medium'>₹{props.fare[props.vehicleType]}</h3>
                            <div className='relative'>
                                <div
                                    className='flex items-center justify-between text-sm text-gray-600 cursor-pointer bg-gray-100 px-3 py-1 rounded'
                                    onClick={props.toggleDropdown}
                                >
                                    <span>{props.paymentMode}</span>
                                    <i className={`ri-arrow-down-s-line transition-transform ${props.dropdownOpen ? 'rotate-180' : ''}`}></i>
                                </div>

                                {props.dropdownOpen && (
                                    <div className='absolute left-0 right-0 mt-1 bg-white shadow-lg rounded-md z-10 border'>
                                        <div
                                            className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${props.paymentMode === 'Cash' ? 'bg-gray-100' : ''}`}
                                            onClick={() => props.selectPaymentMethod('Cash')}
                                        >
                                            Cash
                                        </div>
                                        <div
                                            className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${props.paymentMode === 'Card' ? 'bg-gray-100' : ''}`}
                                            onClick={() => props.selectPaymentMethod('Card')}
                                        >
                                            Card
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <button onClick={() => {
                    props.setVehicleFound(true)
                    props.setConfirmedRidePanel(false)
                    props.createRide()
                }} className='w-full mt-5 bg-green-600 text-white font-semibold p-2 rounded-lg'>Confirm</button>
            </div>
        </div>
    )
}