import React from 'react'
import car from '../assets/car.png'
import bike from '../assets/bike.png'
import auto from '../assets/auto.png'

const LookingForDriver = ({
    pickup,
    destination,
    fare,
    vehicleType,
    setVehicleFound
}) => {
    const getVehicleImage = () => {
        switch (vehicleType) {
            case 'car': return car
            case 'moto': return bike
            case 'auto': return auto
            default: return car
        }
    }

    return (
        <div className='space-y-6'>
            {/* Header with Cancel */}
            <div className='flex items-center justify-between'>
                <div>
                    <h3 className='text-2xl font-bold text-gray-900'>Finding your driver</h3>
                    <p className='text-gray-500 mt-1'>Please wait while we match you</p>
                </div>
                <button
                    onClick={() => setVehicleFound(false)}
                    className='w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors'
                >
                    <i className="ri-close-line text-xl text-gray-600"></i>
                </button>
            </div>

            {/* Loading Animation */}
            <div className='flex flex-col items-center py-8'>
                <div className='relative'>
                    <div className='w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center'>
                        <img src={getVehicleImage()} alt="Vehicle" className='w-16 h-auto object-contain' />
                    </div>
                    {/* Pulse rings */}
                    <div className='absolute inset-0 rounded-full border-2 border-gray-200 animate-ping opacity-30'></div>
                    <div className='absolute inset-0 rounded-full border-2 border-gray-300 animate-ping opacity-20' style={{ animationDelay: '0.5s' }}></div>
                </div>
                <p className='text-gray-500 mt-6 animate-pulse'>Connecting you with nearby drivers...</p>
            </div>

            {/* Trip Summary */}
            <div className='bg-gray-50 rounded-2xl p-4 space-y-3'>
                <div className='flex items-center gap-3'>
                    <div className='w-3 h-3 bg-gray-900 rounded-full'></div>
                    <p className='text-gray-700 flex-1 truncate'>{pickup}</p>
                </div>
                <div className='flex items-center gap-3'>
                    <div className='w-3 h-3 bg-green-600 rounded-full'></div>
                    <p className='text-gray-700 flex-1 truncate'>{destination}</p>
                </div>
            </div>

            {/* Fare Display */}
            <div className='flex items-center justify-between bg-gray-900 rounded-2xl p-5'>
                <div>
                    <p className='text-gray-400 text-sm'>Estimated fare</p>
                    <p className='text-2xl font-bold text-white'>₹{fare[vehicleType] || '--'}</p>
                </div>
                <div className='h-12 w-12 rounded-full bg-white/10 flex items-center justify-center'>
                    <i className="ri-money-rupee-circle-line text-2xl text-white"></i>
                </div>
            </div>

            {/* Cancel Button */}
            <button
                onClick={() => setVehicleFound(false)}
                className='btn-ghost btn-full'
            >
                Cancel search
            </button>
        </div>
    )
}

export default LookingForDriver
