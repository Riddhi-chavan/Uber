import React from 'react'

export const ConfirmRide = (props) => {
    console.log("props.ride?.user.profilePicture", `${import.meta.env.VITE_BASE_URL}/uploads/${props.ride?.user.profilePicture.split('/').pop()}`)
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
                <img className='h-20 w-20 rounded-full' src={props.user.profilePicture
                    ? `${import.meta.env.VITE_BASE_URL}/uploads/${props.user.profilePicture.split('/').pop()}`
                    : "/pessenger.png"
                } alt="" />
                <div className='w-full mt-5'>
                    <div className='flex items-center gap-5 border-b-2 p-3'>
                        <i className=" text-lg ri-map-pin-user-fill"></i>
                        <div className=''>
                            <h3 className='text-lg font-medium'>562/11-A</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{props.pickup}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 border-b-2 p-3'>
                        <i className=" text-lg ri-map-pin-2-fill"></i>
                        <div className=''>
                            <h3 className='text-lg font-medium'>562/11-A</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{props.destination}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5  p-3'>
                        <i className="text-lg ri-currency-line"></i>
                        <div className=''>
                            <h3 className='text-lg font-medium'>₹{props.fare[props.vehicleType]}</h3>
                            <p className='text-sm -mt-1 text-gray-600'>Cash Cash</p>
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
