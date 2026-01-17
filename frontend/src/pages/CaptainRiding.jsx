import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import FinishRide from '../components/FinishRide'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { SocketContext } from '../context/SocketContext'
import RideTracking from '../components/RideTracking'
import { useJsApiLoader } from '@react-google-maps/api'

const CaptainRiding = () => {
    const [finishRidePanel, setFinishRidePanel] = useState(false)
    const finishRidePanelRef = useRef(null)
    const location = useLocation()
    const rideData = location.state?.ride
    const { socket } = useContext(SocketContext)
    const [showPaymentSuccess, setShowPaymentSuccess] = useState(false)

    const successOverlayRef = useRef(null)
    const successContentRef = useRef(null)

    useEffect(() => {
        if (socket) {
            socket.on("payment-completed", (data) => {
                if (data.rideId === rideData._id) {
                    setShowPaymentSuccess(true)
                }
            })
        }

        return () => {
            if (socket) {
                socket.off("payment-completed")
            }
        }
    }, [socket, rideData])

    useGSAP(function () {
        if (finishRidePanel) {
            gsap.to(finishRidePanelRef.current, {
                transform: "translateY(0)"
            })
        } else {
            gsap.to(finishRidePanelRef.current, {
                transform: "translateY(100%)"
            })
        }
    }, [finishRidePanel])

    useGSAP(() => {
        if (showPaymentSuccess) {
            gsap.set(successOverlayRef.current, { opacity: 0 })
            gsap.set(successContentRef.current, { y: 50, opacity: 0, scale: 0.9 })

            const tl = gsap.timeline({
                onComplete: () => setShowPaymentSuccess(false)
            })

            tl.to(successOverlayRef.current, { opacity: 1, duration: 0.3 })
            tl.to(successContentRef.current, {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.4,
                ease: "back.out(1.7)"
            })
            tl.to({}, { duration: 2.5 })
            tl.to(successContentRef.current, { y: -30, opacity: 0, duration: 0.3 })
            tl.to(successOverlayRef.current, { opacity: 0, duration: 0.2 }, "-=0.2")
        }
    }, [showPaymentSuccess])

    const libraries = ['places']
    const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: googleMapsApiKey,
        libraries: libraries
    })

    return (
        <div className='min-h-screen bg-gray-50 relative'>
            {/* Header */}
            <header className='app-header'>
                <img
                    className='w-20 h-auto'
                    src="https://logos-world.net/wp-content/uploads/2020/05/Uber-Logo.png"
                    alt="Uber"
                />
                <Link to="/captain-login" className='fab'>
                    <i className="ri-logout-box-r-line text-gray-700"></i>
                </Link>
            </header>

            {/* Map Section */}
            <div className='h-[75vh] pt-16'>
                <RideTracking
                    rideData={rideData}
                    googleMapsApiKey={googleMapsApiKey}
                    isLoaded={isLoaded}
                />
            </div>

            {/* Complete Ride Button */}
            <div
                className='fixed bottom-0 left-0 right-0 bg-gradient-success p-6 cursor-pointer max-w-lg mx-auto'
                onClick={() => setFinishRidePanel(true)}
            >
                <div className='flex items-center justify-between'>
                    <div>
                        <p className='text-white/80 text-sm'>Swipe up to</p>
                        <p className='text-white font-semibold text-lg'>Complete Ride</p>
                    </div>
                    <div className='w-12 h-12 bg-white/20 rounded-full flex items-center justify-center'>
                        <i className="ri-arrow-up-line text-white text-2xl animate-bounce-gentle"></i>
                    </div>
                </div>
            </div>

            {/* Finish Ride Panel */}
            <div
                ref={finishRidePanelRef}
                className='bottom-sheet translate-y-full p-6 pt-4 max-w-lg mx-auto max-h-[90vh] overflow-y-auto'
            >
                <div className="bottom-sheet-handle"></div>
                <FinishRide
                    ride={rideData}
                    setFinishRidePanel={setFinishRidePanel}
                />
            </div>

            {/* Payment Success Overlay */}
            {showPaymentSuccess && (
                <div
                    ref={successOverlayRef}
                    className='success-overlay'
                >
                    <div
                        ref={successContentRef}
                        className='text-center'
                    >
                        <div className='w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6'>
                            <i className="ri-check-line text-5xl text-green-600"></i>
                        </div>
                        <h2 className='text-2xl font-bold text-gray-900 mb-2'>Payment Received!</h2>
                        <p className='text-gray-500'>₹{rideData?.fare} has been added to your earnings</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CaptainRiding