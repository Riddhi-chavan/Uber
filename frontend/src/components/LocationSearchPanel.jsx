import React from 'react'

const LocationSearchPanel = ({ suggestions, onLocationSelect, activeField }) => {
    return (
        <div className='space-y-2'>
            {suggestions.length === 0 ? (
                <div className='text-center py-8'>
                    <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                        <i className="ri-search-line text-2xl text-gray-400"></i>
                    </div>
                    <p className='text-gray-500'>
                        {activeField === 'pickup' ? 'Search for pickup location' : 'Search for destination'}
                    </p>
                    <p className='text-sm text-gray-400 mt-1'>Start typing to see suggestions</p>
                </div>
            ) : (
                <>
                    <p className='text-sm font-medium text-gray-500 mb-3 px-2'>Suggestions</p>
                    {suggestions.map((location, index) => (
                        <div
                            key={index}
                            onClick={() => onLocationSelect(location.description || location)}
                            className='flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors active:bg-gray-100'
                        >
                            <div className='w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0'>
                                <i className="ri-map-pin-line text-gray-600"></i>
                            </div>
                            <div className='flex-1 min-w-0'>
                                <p className='font-medium text-gray-900 truncate'>
                                    {typeof location === 'string' ? location : location.structured_formatting?.main_text || location.description}
                                </p>
                                {location.structured_formatting?.secondary_text && (
                                    <p className='text-sm text-gray-500 truncate'>
                                        {location.structured_formatting.secondary_text}
                                    </p>
                                )}
                            </div>
                            <i className="ri-arrow-right-s-line text-gray-400"></i>
                        </div>
                    ))}
                </>
            )}
        </div>
    )
}

export default LocationSearchPanel
