import React, { useRef, useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import CaptainDetails from '../components/CaptainDetails'
import RidePopUp from '../components/RidePopUp'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ConfirmRidePopUp from '../components/ConfirmRidePopUp'
import { SocketContext } from '../context/SocketContext'
import { CaptainDataContext } from '../context/CaptainContext'
import axios from 'axios'
import LiveTracking from '../components/LiveTracking'

const CaptainHome = () => {
  const [ridePopPanel, setRidePopPanel] = useState(false)
  const [confirmRidePopPanel, setConfirmRidePopPanel] = useState(false)
  const ridePopPanelRef = useRef(null)
  const confirmRidePopPanelRef = useRef(null)
  const [ride, setRide] = useState(null)

  const { socket } = useContext(SocketContext)
  const { captain } = useContext(CaptainDataContext)

  useEffect(() => {
    socket.emit("join", { userType: "captain", userId: captain._id })

    const updateLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          console.log({
            userId: captain._id,
            location: {
              ltd: position.coords.latitude,
              lng: position.coords.longitude
            }
          })
          socket.emit("update-location-captain", {
            userId: captain._id,
            location: {
              ltd: position.coords.latitude,
              lng: position.coords.longitude
            }
          });
        });
      }
    };

    const locationInterval = setInterval(updateLocation, 10000);
    updateLocation();

    return () => clearInterval(locationInterval);
  }, [])

  socket.on("new-ride", (data) => {
    console.log("data", data)
    setRide(data)
    setRidePopPanel(true)
  })



  async function confirmRide() {
    console.log("confirming ride", ride._id, captain._id)
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/confirm-ride`, {
      rideId: ride._id,
      captainId: captain._id,

    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('Captaintoken')}`
      }
    })

    console.log("response", response.data)
  }


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
        <LiveTracking />
      </div>
      <div className='h-2/5 p-6'>
        <CaptainDetails />
      </div>
      <div ref={ridePopPanelRef} className='fixed w-full bg-white translate-y-full  z-10 bottom-0   px-3 py-10  pt-12 max-w-4xl mx-auto'>
        <RidePopUp
          ride={ride}
          setRidePopPanel={setRidePopPanel}
          setConfirmRidePopPanel={setConfirmRidePopPanel}
          confirmRide={confirmRide}
        />
      </div>
      <div ref={confirmRidePopPanelRef} className='fixed w-full bg-white  h-screen translate-y-full  z-10 bottom-0   px-3 py-10  pt-12 max-w-4xl mx-auto'>
        <ConfirmRidePopUp
          ride={ride}
          setConfirmRidePopPanel={setConfirmRidePopPanel} setRidePopPanel={setRidePopPanel} />
      </div>
    </div>
  )
}

export default CaptainHome