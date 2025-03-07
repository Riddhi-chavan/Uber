import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import FinishRide from '../components/FinishRide'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import LiveTracking from '../components/LiveTracking'
import { SocketContext } from '../context/SocketContext'


const CaptainRiding = () => {
    const [finishRidePanel, setFinishRidePanel] = useState(false)
    const finishRidePanelRef = useRef(null)
    const location = useLocation()
    const rideData = location.state?.ride
    const { socket } = useContext(SocketContext);
    const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);

    // Refs for GSAP animations
    const successOverlayRef = useRef(null);
    const successContentRef = useRef(null);


    useEffect(() => {
        if (socket) {
            socket.on("payment-completed", (data) => {
                // Handle payment completion event
                if (data.rideId === rideData._id) {
                    // Show confirmation to captain that payment was received
                    console.log("captian recevied money")
                    setShowPaymentSuccess(true)

                    // You can update ride status or UI as needed
                    // For example, you might want to update the ride status in state
                }
            });
        }

        // Clean up socket listener on component unmount
        return () => {
            if (socket) {
                socket.off("payment-completed");
            }
        };
    }, [socket, rideData]);

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
            // Initial states
            gsap.set(successOverlayRef.current, { opacity: 0 });
            gsap.set(successContentRef.current, { y: 200, opacity: 0 });

            // Create animation timeline
            const tl = gsap.timeline();

            // Animate overlay fade in
            tl.to(successOverlayRef.current, {
                opacity: 1,
                duration: 0.3
            });

            // Animate content from bottom to center
            tl.to(successContentRef.current, {
                y: 0,
                opacity: 1,
                duration: 0.4,
                ease: "power2.out"
            });

            // Hold in center
            tl.to({}, { duration: 2 });

            // Animate content up and fade out
            tl.to(successContentRef.current, {
                y: -200,
                opacity: 0,
                duration: 0.4,
                ease: "power2.in"
            });

            // Fade out overlay
            tl.to(successOverlayRef.current, {
                opacity: 0,
                duration: 0.3
            }, "-=0.3");
        }
    }, [showPaymentSuccess]);

    return (
        <div className='h-screen relative'>

            <div className='fixed p-6 top-0 flex justify-between items-center w-full'>
                <img className='w-16' src="https://logos-world.net/wp-content/uploads/2020/05/Uber-Logo.png" alt="" />
                <Link to="/captain-login" className=' h-10 w-10 bg-white flex items-center justify-center rounded-full'>
                    <i className="ri-logout-box-r-line"></i>
                </Link>
            </div>

            <div className='h-4/5'>
                <LiveTracking />
            </div>
            <div className='h-1/5 p-6 bg-yellow-400 flex items-center justify-between relative' onClick={() => {
                setFinishRidePanel(true)
            }}>
                <h5
                    className='p-1 text-center absolute top-0 w-[85%] '>
                    <i className="text-3xl text-black  ri-arrow-down-wide-line"></i>
                </h5>
                <h4 className='text-xl font-semibold'>4 KM away</h4>
                <button className=' bg-green-600 text-white font-semibold p-3 px-8 rounded-lg'>Complete Ride</button>
            </div>
            <div ref={finishRidePanelRef} className='fixed w-full bg-white translate-y-full  z-10 bottom-0   px-3 py-10  pt-12'>
                <FinishRide
                    ride={rideData}
                    setFinishRidePanel={setFinishRidePanel} />
            </div>
            {showPaymentSuccess && (
                <div
                    ref={successOverlayRef}
                    className='absolute top-0 bg-white bg-opacity-5 backdrop-blur-md w-full h-screen flex justify-center items-center'
                >
                    <div
                        ref={successContentRef}
                        className='flex flex-col items-center'
                    >
                        <img
                            src='/payement-done.png'
                            className='w-24 h-24'
                            alt="Payment Successful"
                        />
                        <h1
                            className='text-xl text-green-800 drop-shadow-md mt-2'
                        >
                            Payment Received Successfully
                        </h1>
                    </div>
                </div>
            )}


        </div>
    )
}

export default CaptainRiding