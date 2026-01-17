import React from 'react'
import { Link } from 'react-router-dom'

const Start = () => {
    return (
        <div className='min-h-screen flex flex-col bg-white'>
            {/* Hero Section */}
            <div className='flex-1 relative overflow-hidden'>
                {/* Background Pattern */}
                <div className='absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100'>
                    <div className='absolute inset-0 opacity-5'>
                        <div className='absolute top-20 left-10 w-64 h-64 bg-black rounded-full blur-3xl'></div>
                        <div className='absolute bottom-20 right-10 w-96 h-96 bg-black rounded-full blur-3xl'></div>
                    </div>
                </div>

                {/* Content */}
                <div className='relative z-10 flex flex-col items-center justify-center h-full px-8 py-16'>
                    {/* Logo */}
                    <img
                        className='w-32 h-auto mb-8'
                        src="https://logos-world.net/wp-content/uploads/2020/05/Uber-Logo.png"
                        alt="Uber"
                    />

                    {/* Headline */}
                    <h1 className='text-4xl md:text-5xl font-bold text-gray-900 text-center mb-4'>
                        Move the way<br />you want
                    </h1>
                    <p className='text-lg text-gray-500 text-center max-w-md'>
                        Request a ride, hop in, and go. It's that simple.
                    </p>

                    {/* Illustration */}
                    <div className='mt-12 w-full max-w-sm'>
                        <div className='aspect-square rounded-3xl bg-gray-100 flex items-center justify-center overflow-hidden'>
                            <img
                                src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,w_558,h_372/v1555543694/assets/db/83c9ad-ad6c-49a1-9a04-3196a93c1d0b/original/Poster+Background.png"
                                alt="Uber Ride"
                                className='w-full h-full object-cover'
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className='p-8 pb-12 bg-white'>
                <div className='space-y-4 max-w-md mx-auto'>
                    <Link
                        to="/login"
                        className='btn-primary btn-full btn-lg text-center'
                    >
                        Get Started
                    </Link>

                    <div className='flex items-center gap-4'>
                        <div className='flex-1 h-px bg-gray-200'></div>
                        <span className='text-gray-400 text-sm'>or</span>
                        <div className='flex-1 h-px bg-gray-200'></div>
                    </div>

                    <Link
                        to="/captain-login"
                        className='btn-secondary btn-full btn-lg text-center flex items-center justify-center gap-2'
                    >
                        <i className="ri-steering-2-line"></i>
                        Sign in as Driver
                    </Link>
                </div>

                {/* Footer */}
                <p className='text-center text-xs text-gray-400 mt-8'>
                    By continuing, you agree to our Terms of Service and Privacy Policy
                </p>
            </div>
        </div>
    )
}

export default Start
