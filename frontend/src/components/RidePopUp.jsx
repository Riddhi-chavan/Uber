import React from 'react'

const RidePopUp = (props) => {
    console.log("props.ride?.user.profilePicture", `${import.meta.env.VITE_BASE_URL}/uploads/${props.ride?.user.profilePicture.split('/').pop()}`)
    return (
        <div>
            <h5
                className='p-1 text-center absolute top-0 w-[93%] ' onClick={() => {
                    props.setRidePopPanel(false)
                }} >
                <i className="text-3xl text-gray-200  ri-arrow-down-wide-line"></i>
            </h5>
            <h3 className='text-2xl font-semibold mb-5'>New Ride Available!</h3>
            <div className='flex items-center justify-between mt-4 p-3 bg-yellow-300 rounded-lg'>
                <div className='flex items-center gap-3 '>
                    <img className='h-12 w-12 rounded-full object-cover' src={props.ride?.user.profilePicture} alt="" />
                    <h2 className='text-lg font-medium'>{props.ride?.user.fullname.firstname + " " + props.ride?.user.fullname.lastname}</h2>
                </div>

            </div>
            <div className='flex gap-2 flex-col justify-between items-center'>
                <div className='w-full mt-5'>
                    <div className='flex items-center gap-5 border-b-2 p-3'>
                        <i className=" text-lg ri-map-pin-user-fill"></i>
                        <div className=''>
                            <h3 className='text-lg font-medium'>Pickup</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{props.ride?.pickup}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 border-b-2 p-3'>
                        <i className=" text-lg ri-map-pin-2-fill"></i>
                        <div className=''>
                            <h3 className='text-lg font-medium'>Destination</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{props.ride?.destination}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5  p-3'>
                        <i className="text-lg ri-currency-line"></i>
                        <div className=''>
                            <h3 className='text-lg font-medium'>₹{props.ride?.fare}</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{props.ride?.paymentMode}</p>
                        </div>
                    </div>


                </div>
                <div className='flex w-full items-center justify-between mt-5'>
                    <button className=' bg-gray-300 text-gray-700 font-semibold p-3 px-8 rounded-lg' onClick={() => {
                        props.setRidePopPanel(false)
                    }}>Ignore</button>
                    <button className=' bg-green-600 text-white font-semibold p-3 px-8 rounded-lg' onClick={() => {
                        props.setConfirmRidePopPanel(true)
                        props.confirmRide()
                    }}>Accept</button>

                </div>
            </div>
        </div>
    )
}

export default RidePopUp