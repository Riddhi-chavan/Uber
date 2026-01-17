import React from 'react'
import car from '../assets/car.png'
import bike from '../assets/bike.png'
import auto from '../assets/auto.png'

export const ConfirmRide = ({
    pickup,
    destination,
    fare,
    vehicleType,
    createRide,
    setConfirmedRidePanel,
    setVehicleFound,
    user,
    toggleDropdown,
    dropdownOpen,
    paymentMode,
    selectPaymentMethod
}) => {
    const getVehicleImage = () => {
        switch (vehicleType) {
            case 'car': return car
            case 'moto': return bike
            case 'auto': return auto
            default: return car
        }
    }

    const getVehicleName = () => {
        switch (vehicleType) {
            case 'car': return 'UberGo'
            case 'moto': return 'Moto'
            case 'auto': return 'UberAuto'
            default: return 'Ride'
        }
    }

    const handleConfirm = () => {
        setConfirmedRidePanel(false)
        setVehicleFound(true)
        createRide()
    }

    return (
        <div className='space-y-6'>
            {/* Header */}
            <div className='flex items-center justify-between'>
                <div>
                    <h3 className='text-2xl font-bold text-gray-900'>Confirm your ride</h3>
                    <p className='text-gray-500 mt-1'>Review trip details</p>
                </div>
                <button
                    onClick={() => setConfirmedRidePanel(false)}
                    className='w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors'
                >
                    <i className="ri-close-line text-xl text-gray-600"></i>
                </button>
            </div>

            {/* Vehicle Info */}
            <div className='flex items-center gap-4 bg-gray-50 rounded-2xl p-4'>
                <div className='w-20 h-16 flex items-center justify-center'>
                    <img src={getVehicleImage()} alt={getVehicleName()} className='max-w-full max-h-full object-contain' />
                </div>
                <div>
                    <h4 className='font-semibold text-gray-900'>{getVehicleName()}</h4>
                    <p className='text-sm text-gray-500'>2 min away</p>
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
                        <p className='font-medium text-gray-900'>{pickup}</p>
                    </div>
                </div>

                <div className='info-row border-b-0'>
                    <div className='info-row-icon' style={{ backgroundColor: '#06C167' }}>
                        <i className="ri-map-pin-fill text-white"></i>
                    </div>
                    <div className='flex-1'>
                        <p className='text-sm text-gray-500'>Destination</p>
                        <p className='font-medium text-gray-900'>{destination}</p>
                    </div>
                </div>
            </div>

            {/* Payment Method */}
            <div className='relative'>
                <div
                    onClick={toggleDropdown}
                    className='payment-method'
                >
                    <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center'>
                            {paymentMode === 'Cash' ? (
                                <i className="ri-money-rupee-circle-line text-gray-700"></i>
                            ) : (
                                <i className="ri-bank-card-line text-gray-700"></i>
                            )}
                        </div>
                        <div>
                            <p className='font-medium text-gray-900'>{paymentMode}</p>
                            <p className='text-sm text-gray-500'>Payment method</p>
                        </div>
                    </div>
                    <i className={`ri-arrow-${dropdownOpen ? 'up' : 'down'}-s-line text-gray-400`}></i>
                </div>

                {dropdownOpen && (
                    <div className='absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-10'>
                        <button
                            onClick={() => selectPaymentMethod('Cash')}
                            className={`w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors ${paymentMode === 'Cash' ? 'bg-gray-50' : ''}`}
                        >
                            <i className="ri-money-rupee-circle-line text-gray-700"></i>
                            <span className='font-medium'>Cash</span>
                            {paymentMode === 'Cash' && <i className="ri-check-line text-green-600 ml-auto"></i>}
                        </button>
                        <button
                            onClick={() => selectPaymentMethod('Card')}
                            className={`w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors ${paymentMode === 'Card' ? 'bg-gray-50' : ''}`}
                        >
                            <i className="ri-bank-card-line text-gray-700"></i>
                            <span className='font-medium'>Card</span>
                            {paymentMode === 'Card' && <i className="ri-check-line text-green-600 ml-auto"></i>}
                        </button>
                    </div>
                )}
            </div>

            {/* Total Fare */}
            <div className='bg-gray-900 rounded-2xl p-5 flex items-center justify-between'>
                <div>
                    <p className='text-gray-400 text-sm'>Total Fare</p>
                    <p className='text-3xl font-bold text-white'>₹{fare[vehicleType] || '--'}</p>
                </div>
                <div className='text-right'>
                    <p className='text-gray-400 text-sm'>Paying by</p>
                    <p className='text-white font-medium'>{paymentMode}</p>
                </div>
            </div>

            {/* Confirm Button */}
            <button
                onClick={handleConfirm}
                className='btn-success btn-full btn-lg'
            >
                Confirm Ride
            </button>
        </div>
    )
}

export default ConfirmRide
