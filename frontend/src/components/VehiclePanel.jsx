import React, { useState } from 'react'
import car from '../assets/car.png'
import bike from '../assets/bike.png'
import auto from '../assets/auto.png'

const VehiclePanel = ({ selectVehicle, fare, setConfirmedRidePanel, setVehiclePanel }) => {
    const [selectedVehicle, setSelectedVehicle] = useState(null)

    const vehicles = [
        {
            id: 'car',
            name: 'UberGo',
            description: 'Affordable, compact rides',
            image: car,
            capacity: 4,
            time: '2 min away'
        },
        {
            id: 'moto',
            name: 'Moto',
            description: 'Affordable motorcycle rides',
            image: bike,
            capacity: 1,
            time: '3 min away'
        },
        {
            id: 'auto',
            name: 'UberAuto',
            description: 'No bargaining, doorstep pickup',
            image: auto,
            capacity: 3,
            time: '5 min away'
        }
    ]

    const handleVehicleSelect = (vehicleId) => {
        setSelectedVehicle(vehicleId)
        selectVehicle(vehicleId)
    }

    const handleConfirm = () => {
        if (selectedVehicle) {
            setVehiclePanel(false)
            setConfirmedRidePanel(true)
        }
    }

    return (
        <div className='space-y-6'>
            <div>
                <h3 className='text-2xl font-bold text-gray-900'>Choose a ride</h3>
                <p className='text-gray-500 mt-1'>Select your preferred vehicle type</p>
            </div>

            <div className='space-y-3'>
                {vehicles.map((vehicle) => (
                    <div
                        key={vehicle.id}
                        onClick={() => handleVehicleSelect(vehicle.id)}
                        className={`vehicle-option ${selectedVehicle === vehicle.id ? 'selected' : ''}`}
                    >
                        <div className='w-20 h-16 flex items-center justify-center flex-shrink-0'>
                            <img
                                src={vehicle.image}
                                alt={vehicle.name}
                                className='max-w-full max-h-full object-contain'
                            />
                        </div>

                        <div className='flex-1 min-w-0'>
                            <div className='flex items-center gap-2'>
                                <h4 className='font-semibold text-gray-900'>{vehicle.name}</h4>
                                <span className='text-xs text-gray-400 flex items-center gap-1'>
                                    <i className="ri-user-line"></i>
                                    {vehicle.capacity}
                                </span>
                            </div>
                            <p className='text-sm text-gray-500'>{vehicle.description}</p>
                            <p className='text-xs text-gray-400 mt-1'>{vehicle.time}</p>
                        </div>

                        <div className='text-right flex-shrink-0'>
                            <p className='text-lg font-bold text-gray-900'>
                                ₹{fare[vehicle.id] || '--'}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={handleConfirm}
                disabled={!selectedVehicle}
                className='btn-primary btn-full btn-lg'
            >
                {selectedVehicle ? 'Confirm Ride' : 'Select a vehicle'}
            </button>
        </div>
    )
}

export default VehiclePanel
