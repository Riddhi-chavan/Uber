import React from 'react'

const RidePopUp = (props) => {
    return (
        <div className='space-y-6'>
            {/* Title */}
            <div>
                <h3 className='text-2xl font-bold text-gray-900'>New Ride Request</h3>
                <p className='text-gray-500 mt-1'>A rider is requesting a trip</p>
            </div>

            {/* User Info Card */}
            <div className='user-card'>
                <img
                    className='user-avatar'
                    src={props.ride?.user?.profilePicture || `https://ui-avatars.com/api/?name=${props.ride?.user?.fullname?.firstname}+${props.ride?.user?.fullname?.lastname}&background=random`}
                    alt="Rider"
                />
                <div className='flex-1'>
                    <h2 className='font-semibold text-gray-900'>
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

            {/* Action Buttons */}
            <div className='flex gap-4'>
                <button
                    className='flex-1 btn-secondary btn-lg'
                    onClick={() => props.setRidePopPanel(false)}
                >
                    Ignore
                </button>
                <button
                    className='flex-1 btn-success btn-lg'
                    onClick={props.confirmRide}
                >
                    Accept Ride
                </button>
            </div>
        </div>
    )
}

export default RidePopUp