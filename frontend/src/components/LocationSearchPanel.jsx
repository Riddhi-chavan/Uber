import React from 'react'

const LocationSearchPanel = ({ suggestions, onLocationSelect, activeField }) => {
    return (
        <div className='mt-6'>
            {suggestions.map((suggestion, index) => (
                <div
                    key={index}
                    onClick={() => onLocationSelect(suggestion.description)}
                    className='flex items-center border-2 p-3 border-gray-100 active:border-black rounded-xl my-2  justify-start gap-4'
                >
                    <h2 className='bg-[#eee] h-10 w-14 flex items-center justify-center rounded-full'>
                        <i className="ri-map-pin-fill text-xl"></i>
                    </h2>
                    <h4 className='font-medium'>{suggestion.description}</h4>
                </div>
            ))}
        </div>
    )
}

export default LocationSearchPanel