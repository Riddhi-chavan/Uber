import React, { useRef, useState, useEffect, useContext } from 'react'
import { useGSAP } from "@gsap/react"
import gsap from 'gsap'
import axios from 'axios'
import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from '../components/LocationSearchPanel'
import VehiclePanel from '../components/VehiclePanel'
import { ConfirmRide } from '../components/ConfirmRide'
import LookingForDriver from '../components/LookingForDriver'
import WaitingForDriver from '../components/WaitingForDriver'
import { SocketContext } from '../context/SocketContext'
import { UserDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import LiveTracking from '../components/LiveTracking'

const Home = () => {
  const [pickup, setPickup] = useState('')
  const [destination, setDestination] = useState('')
  const [panelOpen, setPanelOpen] = useState(false)
  const panelRef = useRef(null)
  const panelCloseRef = useRef(null)
  const [vehiclePanel, setVehiclePanel] = useState(false)
  const [confirmedRidePanel, setConfirmedRidePanel] = useState(false)
  const [VehicleFound, setVehicleFound] = useState(false)
  const [waitingForDriver, setWaitingForDriver] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [activeField, setActiveField] = useState(null)
  const [fare, setFare] = useState({})
  const [vehicleType, setVehicleType] = useState(null)
  const [ride, setRide] = useState(null)
  const { socket } = useContext(SocketContext)
  const { user } = useContext(UserDataContext)
  const [paymentMode, setPaymentMode] = useState('Cash')
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    socket.emit("join", { userType: "user", userId: user._id })
  }, [])

  socket.on("ride-confirmed", ride => {
    setVehicleFound(false)
    setWaitingForDriver(true)
    setRide(ride)
  })

  socket.on("ride-started", ride => {
    setWaitingForDriver(false)
    navigate('/riding', { state: { ride } })
  })

  const debounce = (func, delay) => {
    let timeoutId
    return (...args) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => func(...args), delay)
    }
  }

  const fetchSuggestions = async (input) => {
    if (input.length >= 3) {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/maps/get-suggestion?input=${input}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        )
        setSuggestions(response.data)
      } catch (error) {
        console.error('Error fetching suggestions:', error)
        setSuggestions([])
      }
    } else {
      setSuggestions([])
    }
  }

  const debouncedFetchSuggestions = debounce(fetchSuggestions, 300)

  const handleInputChange = (e, field) => {
    const value = e.target.value
    if (field === 'pickup') {
      setPickup(value)
    } else {
      setDestination(value)
    }
    setActiveField(field)
    debouncedFetchSuggestions(value)
  }

  const handleLocationSelect = (selectedLocation) => {
    if (activeField === 'pickup') {
      setPickup(selectedLocation)
    } else {
      setDestination(selectedLocation)
    }
  }

  const submitHandler = (e) => e.preventDefault()

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen)

  const selectPaymentMethod = (method) => {
    setPaymentMode(method)
    setDropdownOpen(false)
  }

  useGSAP(function () {
    if (panelOpen) {
      gsap.to(panelRef.current, { height: "70%", padding: 24 })
      gsap.to(panelCloseRef.current, { opacity: 1 })
    } else {
      gsap.to(panelRef.current, { height: "0%", padding: 0 })
      gsap.to(panelCloseRef.current, { opacity: 0 })
    }
  }, [panelOpen])

  async function findTrip() {
    if (!pickup || !destination) return
    setPanelOpen(false)
    setVehiclePanel(true)
    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-fare`, {
      params: { pickup, destination },
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    setFare(response.data)
  }

  async function createRide() {
    await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/create`, {
      pickup,
      destination,
      vehicleType,
      paymentMode
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
  }

  return (
    <div className='min-h-screen relative overflow-hidden bg-gray-50'>
      {/* Header */}
      <header className='app-header'>
        <img
          className='w-20 h-auto'
          src="https://logos-world.net/wp-content/uploads/2020/05/Uber-Logo.png"
          alt="Uber"
        />
      </header>

      {/* Map Section */}
      <div
        onClick={() => setVehiclePanel(false)}
        className='h-screen w-full'
      >
        <LiveTracking />
      </div>

      {/* Search Panel */}
      <div className={`fixed inset-0 flex flex-col justify-end pointer-events-none ${panelOpen && "bg-white pointer-events-auto"}`}>
        {/* Search Form */}
        <div className='bg-white p-6 pt-8 rounded-t-3xl shadow-lg pointer-events-auto relative'>
          {/* Close Button */}
          <button
            onClick={() => setPanelOpen(false)}
            ref={panelCloseRef}
            className='absolute right-6 top-6 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center opacity-0 hover:bg-gray-200 transition-colors'
          >
            <i className="ri-arrow-down-s-line text-xl text-gray-600"></i>
          </button>

          <h2 className='text-2xl font-bold text-gray-900 mb-6'>Where to?</h2>

          <form onSubmit={submitHandler} className="space-y-4">
            {/* Location Inputs with Line */}
            <div className='relative'>
              {/* Vertical Line */}
              <div className="absolute left-[19px] top-6 w-0.5 h-16 bg-gray-300"></div>

              {/* Pickup Dot */}
              <div className="absolute left-3.5 top-4 w-3 h-3 bg-gray-900 rounded-full"></div>

              {/* Destination Dot */}
              <div className="absolute left-3.5 bottom-4 w-3 h-3 bg-green-600 rounded-full"></div>

              <input
                onClick={() => {
                  setPanelOpen(true)
                  setActiveField('pickup')
                }}
                value={pickup}
                onChange={(e) => handleInputChange(e, 'pickup')}
                className='input pl-10 mb-3'
                type="text"
                placeholder='Pickup location'
              />

              <input
                onClick={() => {
                  setPanelOpen(true)
                  setActiveField('destination')
                }}
                value={destination}
                onChange={(e) => handleInputChange(e, 'destination')}
                className='input pl-10'
                type="text"
                placeholder='Where to?'
              />
            </div>
          </form>

          <button
            className='btn-primary btn-full btn-lg mt-6'
            onClick={findTrip}
            disabled={!pickup || !destination}
          >
            Find Trip
          </button>
        </div>

        {/* Suggestions Panel */}
        <div ref={panelRef} className='h-0 bg-white overflow-y-auto pointer-events-auto'>
          <LocationSearchPanel
            suggestions={suggestions}
            onLocationSelect={handleLocationSelect}
            activeField={activeField}
          />
        </div>
      </div>

      {/* Vehicle Panel */}
      {vehiclePanel && (
        <>
          {/* Backdrop for desktop */}
          <div
            className="fixed inset-0 bg-black/30 z-40 hidden md:block"
            onClick={() => setVehiclePanel(false)}
          ></div>
          {/* Panel - bottom sheet on mobile, right sidebar on desktop */}
          <div
            className='fixed z-50 bg-white overflow-y-auto p-6 pt-3
              bottom-0 left-0 right-0 max-h-[85vh] rounded-t-3xl
              md:top-0 md:right-0 md:bottom-0 md:left-auto md:max-h-none md:h-full md:w-[420px] md:rounded-none md:shadow-[-4px_0_20px_rgba(0,0,0,0.1)] md:border-l md:border-gray-200'
          >
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4 md:hidden"></div>
            <VehiclePanel
              selectVehicle={setVehicleType}
              fare={fare}
              setConfirmedRidePanel={setConfirmedRidePanel}
              setVehiclePanel={setVehiclePanel}
            />
          </div>
        </>
      )}

      {/* Confirm Ride Panel */}
      {confirmedRidePanel && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40 hidden md:block"
            onClick={() => setConfirmedRidePanel(false)}
          ></div>
          <div
            className='fixed z-50 bg-white overflow-y-auto p-6
              inset-0
              md:top-0 md:right-0 md:bottom-0 md:left-auto md:w-[420px] md:h-full md:shadow-[-4px_0_20px_rgba(0,0,0,0.1)] md:border-l md:border-gray-200'
          >
            <ConfirmRide
              pickup={pickup}
              destination={destination}
              fare={fare}
              vehicleType={vehicleType}
              createRide={createRide}
              setConfirmedRidePanel={setConfirmedRidePanel}
              setVehicleFound={setVehicleFound}
              user={user}
              toggleDropdown={toggleDropdown}
              dropdownOpen={dropdownOpen}
              paymentMode={paymentMode}
              selectPaymentMethod={selectPaymentMethod}
            />
          </div>
        </>
      )}

      {/* Looking for Driver Panel */}
      {VehicleFound && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40 hidden md:block"
            onClick={() => setVehicleFound(false)}
          ></div>
          <div
            className='fixed z-50 bg-white overflow-y-auto p-6
              inset-0
              md:top-0 md:right-0 md:bottom-0 md:left-auto md:w-[420px] md:h-full md:shadow-[-4px_0_20px_rgba(0,0,0,0.1)] md:border-l md:border-gray-200'
          >
            <LookingForDriver
              pickup={pickup}
              destination={destination}
              fare={fare}
              vehicleType={vehicleType}
              createRide={createRide}
              setVehicleFound={setVehicleFound}
              ride={ride}
            />
          </div>
        </>
      )}

      {/* Waiting for Driver Panel */}
      {waitingForDriver && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40 hidden md:block"></div>
          <div
            className='fixed z-50 bg-white overflow-y-auto p-6
              inset-0
              md:top-0 md:right-0 md:bottom-0 md:left-auto md:w-[420px] md:h-full md:shadow-[-4px_0_20px_rgba(0,0,0,0.1)] md:border-l md:border-gray-200'
          >
            <WaitingForDriver ride={ride} setWaitingForDriver={setWaitingForDriver} />
          </div>
        </>
      )}
    </div>
  )
}

export default Home