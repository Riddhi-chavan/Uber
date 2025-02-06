import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import CaptainDetails from '../components/CaptainDetails'
import RidePopUp from '../components/RidePopUp'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ConfirmRidePopUp from '../components/ConfirmRidePopUp'

const CaptainHome = () => {
    const [ridePopPanel, setRidePopPanel] = useState(true)
    const [confirmRidePopPanel, setConfirmRidePopPanel] = useState(false)
    const ridePopPanelRef = useRef(null)
    const confirmRidePopPanelRef = useRef(null)


    useGSAP(function () {
        if (ridePopPanel) {
          gsap.to(ridePopPanelRef.current, {
            transform: "translateY(0)"
          })
        } else {
          gsap.to(ridePopPanelRef.current, {
            transform: "translateY(100%)"
          })
        }
      }, [ridePopPanel])
      
    useGSAP(function () {
        if (confirmRidePopPanel) {
          gsap.to(confirmRidePopPanelRef.current, {
            transform: "translateY(0)"
          })
        } else {
          gsap.to(confirmRidePopPanelRef.current, {
            transform: "translateY(100%)"
          })
        }
      }, [confirmRidePopPanel])
    return (
        <div className='h-screen'>
            <div className='fixed p-6 top-0 flex justify-between items-center w-full'>
                <img className='w-16' src="https://logos-world.net/wp-content/uploads/2020/05/Uber-Logo.png" alt="" />
                <Link to="/captain-login" className=' h-10 w-10 bg-white flex items-center justify-center rounded-full'>
                    <i className="ri-logout-box-r-line"></i>
                </Link>
            </div>

            <div className='h-3/5'>
                <img className='h-full w-full object-cover' src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif" alt="" />
            </div>
            <div className='h-2/5 p-6'>
                <CaptainDetails />
            </div>
            <div ref={ridePopPanelRef} className='fixed w-full bg-white translate-y-full  z-10 bottom-0   px-3 py-10  pt-12'>
                <RidePopUp setRidePopPanel={setRidePopPanel} setConfirmRidePopPanel={setConfirmRidePopPanel}/>
            </div>
            <div ref={confirmRidePopPanelRef} className='fixed w-full bg-white  h-screen translate-y-full  z-10 bottom-0   px-3 py-10  pt-12'>
                <ConfirmRidePopUp setConfirmRidePopPanel={setConfirmRidePopPanel} setRidePopPanel={setRidePopPanel}/>
            </div>
        </div>
    )
}

export default CaptainHome