import React from 'react'

const RidePopUp = (props) => {
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
                    <img className='h-12 w-12 rounded-full object-cover' src="https://img.freepik.com/free-psd/close-up-kid-expression-portrait_23-2150193262.jpg" alt="" />
                    <h2 className='text-lg font-medium'>Riya Sharma</h2>
                </div>
                <h5 className='text-lg font-semibold'>2.2 KM</h5>
            </div>
            <div className='flex gap-2 flex-col justify-between items-center'>
                <div className='w-full mt-5'>
                    <div className='flex items-center gap-5 border-b-2 p-3'>
                        <i className=" text-lg ri-map-pin-user-fill"></i>
                        <div className=''>
                            <h3 className='text-lg font-medium'>562/11-A</h3>
                            <p className='text-sm -mt-1 text-gray-600'>Kankariya talab, Ahemdabad</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 border-b-2 p-3'>
                        <i className=" text-lg ri-map-pin-2-fill"></i>
                        <div className=''>
                            <h3 className='text-lg font-medium'>562/11-A</h3>
                            <p className='text-sm -mt-1 text-gray-600'>Kankariya talab, Ahemdabad</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5  p-3'>
                        <i className="text-lg ri-currency-line"></i>
                        <div className=''>
                            <h3 className='text-lg font-medium'>₹193.20</h3>
                            <p className='text-sm -mt-1 text-gray-600'>Cash Cash</p>
                        </div>
                    </div>


                </div>
              <div className='flex w-full items-center justify-between mt-5'>
              <button className=' bg-gray-300 text-gray-700 font-semibold p-3 px-8 rounded-lg' onClick={() => {
                    props.setRidePopPanel(false)
                }}>Ignore</button>
              <button className=' bg-green-600 text-white font-semibold p-3 px-8 rounded-lg' onClick={() => {
                    props.setConfirmRidePopPanel(true)
                }}>Accept</button>
               
              </div>
            </div>
        </div>
    )
}

export default RidePopUp