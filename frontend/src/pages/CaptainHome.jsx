import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import CaptainDetails from '../components/CaptainDetails'
import RidePopUp from '../components/RidePopUp'
import ConfirmRidePopUp from '../components/ConfirmRidePopUp'
import { SocketContext } from '../context/SocketContext'
import { CaptainDataContext } from '../context/CaptainContext'
import axios from 'axios'
import LiveTracking from '../components/LiveTracking'

const CaptainHome = () => {
  const [ridePopPanel, setRidePopPanel] = useState(false)
  const [confirmRidePopPanel, setConfirmRidePopPanel] = useState(false)
  const [ride, setRide] = useState(null)

  const { socket } = useContext(SocketContext)
  const { captain } = useContext(CaptainDataContext)

  useEffect(() => {
    socket.emit("join", { userType: "captain", userId: captain._id })

    const updateLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          socket.emit("update-location-captain", {
            userId: captain._id,
            location: {
              ltd: position.coords.latitude,
              lng: position.coords.longitude
            }
          })
        })
      }
    }

    const locationInterval = setInterval(updateLocation, 10000)
    updateLocation()

    return () => clearInterval(locationInterval)
  }, [])

  socket.on("new-ride", (data) => {
    setRide(data)
    setRidePopPanel(true)
  })

  async function confirmRide() {
    await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/confirm-ride`, {
      rideId: ride._id,
      captainId: captain._id,
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('Captaintoken')}`
      }
    })
  }

  // When confirm panel opens, close the ride pop panel first
  const handleAcceptRide = () => {
    setRidePopPanel(false) // Close ride popup first
    setConfirmRidePopPanel(true) // Then open confirm panel
    confirmRide()
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='app-header'>
        <img
          className='w-20 h-auto'
          src="https://logos-world.net/wp-content/uploads/2020/05/Uber-Logo.png"
          alt="Uber"
        />
        <Link
          to="/captain-login"
          className='fab'
        >
          <i className="ri-logout-box-r-line text-gray-700"></i>
        </Link>
      </header>

      {/* Map Section */}
      <div className='h-[60vh] pt-16'>
        <LiveTracking />
      </div>

      {/* Captain Details Card */}
      <div className='bg-white rounded-t-3xl -mt-6 relative z-10 min-h-[40vh] p-6 shadow-lg'>
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4"></div>
        <CaptainDetails />
      </div>

      {/* Ride Pop Up Panel - Only show when ridePopPanel is true AND confirmRidePopPanel is false */}
      {ridePopPanel && !confirmRidePopPanel && (
        <>
          {/* Backdrop for desktop */}
          <div
            className="fixed inset-0 bg-black/30 z-40 hidden md:block"
            onClick={() => setRidePopPanel(false)}
          ></div>
          {/* Panel - bottom sheet on mobile, right sidebar on desktop */}
          <div
            className='fixed z-50 bg-white overflow-y-auto p-6 pt-3
              bottom-0 left-0 right-0 max-h-[85vh] rounded-t-3xl
              md:top-0 md:right-0 md:bottom-0 md:left-auto md:max-h-none md:h-full md:w-[420px] md:rounded-none md:shadow-[-4px_0_20px_rgba(0,0,0,0.1)] md:border-l md:border-gray-200'
          >
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4 md:hidden"></div>
            <RidePopUp
              ride={ride}
              setRidePopPanel={setRidePopPanel}
              setConfirmRidePopPanel={setConfirmRidePopPanel}
              confirmRide={handleAcceptRide}
            />
          </div>
        </>
      )}

      {/* Confirm Ride Pop Up Panel - Only show when confirmRidePopPanel is true */}
      {confirmRidePopPanel && (
        <>
          {/* Backdrop for desktop */}
          <div
            className="fixed inset-0 bg-black/30 z-40 hidden md:block"
            onClick={() => setConfirmRidePopPanel(false)}
          ></div>
          {/* Panel - full screen on mobile, right sidebar on desktop */}
          <div
            className='fixed z-50 bg-white overflow-y-auto p-6
              inset-0
              md:top-0 md:right-0 md:bottom-0 md:left-auto md:w-[420px] md:h-full md:shadow-[-4px_0_20px_rgba(0,0,0,0.1)] md:border-l md:border-gray-200'
          >
            <ConfirmRidePopUp
              ride={ride}
              setConfirmRidePopPanel={setConfirmRidePopPanel}
              setRidePopPanel={setRidePopPanel}
            />
          </div>
        </>
      )}
    </div>
  )
}

export default CaptainHome