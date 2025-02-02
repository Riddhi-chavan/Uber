import React from 'react'

const LocationSearchPanel = (props) => {


    const location = [
        "24B Near Kapoor's cafe, Riddhi ka ghar , Chembur",
        "24A Near Kapoor's cafe, Riddhi ka ghar , Panvel",
        "26B Near chavan's cafe, Riddhi ka ghar , Chembur",
        "26B Near Kapoor's road, Riddhi ka ghar , Chembur",
        "24B Near Kapoor's cafe, scholl ka ghar , Chembur",
        "24B Near Kapoor's cafe, sai ka market , Chembur",
        "24B Near Kapoor's cafe,  office , Chembur",
        "24B Near Kapoor's cafe, home , Chembur",
    ]
    return (
        <div>
            {
                location.map(function (elem, index) {
                    return <div key={index} onClick={() => {
                        props.setVehiclePanel(true)
                        props.setPanelOpen(false)
                    }} className='flex items-center  border-2 p-3 border-gray-100 active:border-black rounded-xl my-2 justify-start gap-4'>
                        <h2 className='bg-[#eee] h-10 w-14 flex items-center justify-center  rounded-full'><i className="ri-map-pin-fill text-xl"></i></h2>
                        <h4 className='font-medium'>{elem}</h4>
                    </div>
                })
            }
        </div>
    )
}

export default LocationSearchPanel