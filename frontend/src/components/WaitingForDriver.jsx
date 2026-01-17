import React from 'react'

const WaitingForDriver = ({ ride, setWaitingForDriver }) => {
    return (
        <div className='space-y-6'>
            {/* Header */}
            <div className='text-center'>
                <div className='inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full mb-4'>
                    <i className="ri-check-line"></i>
                    <span className='font-medium'>Driver Found!</span>
                </div>
                <h3 className='text-2xl font-bold text-gray-900'>Your driver is on the way</h3>
                <p className='text-gray-500 mt-1'>Meet at the pickup location</p>
            </div>

            {/* Driver Info Card */}
            <div className='bg-gray-50 rounded-2xl p-5'>
                <div className='flex items-center gap-4'>
                    <div className='relative'>
                        <img
                            className='w-16 h-16 rounded-full object-cover ring-2 ring-white shadow-md'
                            src={ride?.captain?.profilePicture || 'https://cdn-icons-png.flaticon.com/512/190/190659.png'}
                            alt="Driver"
                            onError={(e) => {
                                e.target.src = "https://cdn-icons-png.flaticon.com/512/190/190659.png"
                            }}
                        />
                        <div className='absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white'></div>
                    </div>
                    <div className='flex-1'>
                        <h4 className='font-semibold text-gray-900 capitalize'>
                            {ride?.captain?.fullname?.firstname} {ride?.captain?.fullname?.lastname}
                        </h4>
                        <div className='flex items-center gap-2 mt-1'>
                            <span className='text-yellow-500'>★</span>
                            <span className='text-sm text-gray-600'>4.9</span>
                            <span className='text-gray-300'>•</span>
                            <span className='text-sm text-gray-600'>1,234 rides</span>
                        </div>
                    </div>
                </div>

                {/* Vehicle Details */}
                <div className='mt-4 pt-4 border-t border-gray-200'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <p className='text-sm text-gray-500'>Vehicle</p>
                            <p className='font-semibold text-gray-900 uppercase tracking-wide'>
                                {ride?.captain?.vehicle?.plate}
                            </p>
                        </div>
                        <div className='text-right'>
                            <p className='text-sm text-gray-500'>Color</p>
                            <p className='font-medium text-gray-900 capitalize'>
                                {ride?.captain?.vehicle?.color || 'White'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* OTP Display */}
            <div className='bg-gray-900 rounded-2xl p-5 text-center'>
                <p className='text-gray-400 text-sm mb-2'>Share this OTP with your driver</p>
                <div className='flex justify-center gap-3'>
                    {(ride?.otp || '------').split('').map((digit, index) => (
                        <div key={index} className='w-10 h-12 bg-white/10 rounded-lg flex items-center justify-center'>
                            <span className='text-2xl font-bold text-white'>{digit}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Trip Summary */}
            <div className='space-y-3'>
                <div className='flex items-center gap-4'>
                    <div className='w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center'>
                        <i className="ri-map-pin-line text-gray-700"></i>
                    </div>
                    <div className='flex-1'>
                        <p className='text-sm text-gray-500'>Pickup</p>
                        <p className='font-medium text-gray-900'>{ride?.pickup}</p>
                    </div>
                </div>
                <div className='flex items-center gap-4'>
                    <div className='w-10 h-10 rounded-full flex items-center justify-center' style={{ backgroundColor: '#E8F8EE' }}>
                        <i className="ri-map-pin-fill" style={{ color: '#06C167' }}></i>
                    </div>
                    <div className='flex-1'>
                        <p className='text-sm text-gray-500'>Destination</p>
                        <p className='font-medium text-gray-900'>{ride?.destination}</p>
                    </div>
                </div>
            </div>

            {/* Fare */}
            <div className='flex items-center justify-between bg-gray-50 rounded-xl p-4'>
                <div>
                    <p className='text-sm text-gray-500'>Trip fare</p>
                    <p className='text-xl font-bold text-gray-900'>₹{ride?.fare}</p>
                </div>
                <span className={`badge ${ride?.paymentMode === 'Cash' ? 'badge-warning' : 'badge-success'}`}>
                    {ride?.paymentMode}
                </span>
            </div>

            {/* Contact Buttons */}
            <div className='flex gap-4'>
                <button className='flex-1 btn-secondary flex items-center justify-center gap-2'>
                    <i className="ri-phone-line"></i>
                    Call
                </button>
                <button className='flex-1 btn-secondary flex items-center justify-center gap-2'>
                    <i className="ri-message-3-line"></i>
                    Message
                </button>
            </div>
        </div>
    )
}

export default WaitingForDriver
