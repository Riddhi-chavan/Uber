import React from 'react'
import car from "../assets/car.png"
import bike from "../assets/bike.png"
import auto from "../assets/auto.png"

const VehiclePanel = (props) => {
    return (
        <div>
            <h5
                onClick={() => {
                    props.setVehiclePanel(false)
                }}
                className='p-1 text-center absolute top-0 w-[93%] ' >
                <i className="text-3xl text-gray-200  ri-arrow-down-wide-line"></i>
            </h5>
            <h3 className='text-2xl font-semibold mb-5'>Choose a Vehicle</h3>

            <div onClick={() => {
                props.setConfirmedRidePanel(true)
                props.selectVehicle('car')
            }} className='flex  border-2 active:border-black rounded-xl p-3 mb-2  items-center justify-between'>
                <div className='flex  gap-6 items-center'>
                    <img className='h-10 ' src={car} alt="car" />
                    <div className='w-full ml-2'>
                        <h4 className='font-medium text-base'>UberGo <span><i className="ri-user-3-fill"></i>4</span></h4>
                        <h5 className='font-medium text-sm'>2 min away</h5>
                        <p className='font-normal text-xs text-gray-600'>Affortable , compact rides</p>
                    </div>
                </div>
                <h2 className='text-lg font-semibold'>₹{props.fare.car}</h2>

            </div>
            <div onClick={() => {
                props.setConfirmedRidePanel(true)
                props.selectVehicle('moto')
            }} className='flex  border-2 active:border-black rounded-xl p-3 mb-2  items-center justify-between'>
                <div className='flex gap-6 items-center w-[90%]' >
                    <img className='h-12 ' src={bike} alt="bike" />
                    <div className='w-full max-w-3xl '>
                        <h4 className='font-medium text-base'>Moto <span><i className="ri-user-3-fill"></i>1</span></h4>
                        <h5 className='font-medium text-sm'>3 min away</h5>
                        <p className='font-normal text-xs text-gray-600'>Affortable motorcycle rides</p>
                    </div>
                </div>
                <h2 className='text-lg font-semibold w-[10%] flex justify-end'>₹{props.fare.moto}</h2>

            </div>
            <div onClick={() => {
                props.setConfirmedRidePanel(true)
                props.selectVehicle('auto')
            }} className='flex  border-2 active:border-black rounded-xl p-3 mb-2  items-center justify-between'>
                <div className='flex gap-6 items-center'>
                    <img className='h-12' src={auto} alt="auto" />
                    <div className='w-full'>
                        <h4 className='font-medium text-base'>UberAuto <span><i className="ri-user-3-fill"></i>3</span></h4>
                        <h5 className='font-medium text-sm'>3 min away</h5>
                        <p className='font-normal text-xs text-gray-600'>Affortable auto rides</p>
                    </div>
                </div>

                <h2 className='text-lg font-semibold'>₹{props.fare.auto}</h2>

            </div>
        </div>
    )
}

export default VehiclePanel