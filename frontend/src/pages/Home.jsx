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
  const vehiclePanelRef = useRef(null)
  const vehicleFoundRef = useRef(null)
  const confirmedRidePanelRef = useRef(null)
  const waitingForDriverRef = useRef(null)
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
  const [paymentMode, setPaymentMode] = useState('Cash') // Default payment mode
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
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const fetchSuggestions = async (input) => {
    if (input.length >= 3) {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/maps/get-suggestion?input=${input}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        setSuggestions(response.data);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const debouncedFetchSuggestions = debounce(fetchSuggestions, 300);

  const handleInputChange = (e, field) => {
    const value = e.target.value;
    if (field === 'pickup') {
      setPickup(value);
    } else {
      setDestination(value);
    }
    setActiveField(field);
    debouncedFetchSuggestions(value);
  };

  const handleLocationSelect = (selectedLocation) => {
    if (activeField === 'pickup') {
      setPickup(selectedLocation);
    } else {
      setDestination(selectedLocation);
    }

  };

  const submitHandler = (e) => {
    e.preventDefault()
  }

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen)
  }

  // Select payment method
  const selectPaymentMethod = (method) => {
    setPaymentMode(method)
    setDropdownOpen(false)
  }

  useGSAP(function () {
    if (panelOpen) {
      gsap.to(panelRef.current, {
        height: "70%",
        padding: 24
      })
      gsap.to(panelCloseRef.current, {
        opacity: 1
      })

    } else {
      gsap.to(panelRef.current, {
        height: "0%",
        padding: 0
      })
      gsap.to(panelCloseRef.current, {
        opacity: 0
      })
    }
  }, [panelOpen])

  useGSAP(function () {
    if (vehiclePanel) {
      gsap.to(vehiclePanelRef.current, {
        transform: "translateY(0)"
      })
    } else {
      gsap.to(vehiclePanelRef.current, {
        transform: "translateY(100%)"
      })
    }
  }, [vehiclePanel])

  useGSAP(function () {
    if (confirmedRidePanel) {
      gsap.to(confirmedRidePanelRef.current, {
        transform: "translateY(0)"
      })
    } else {
      gsap.to(confirmedRidePanelRef.current, {
        transform: "translateY(100%)"
      })
    }
  }, [confirmedRidePanel])

  useGSAP(function () {
    if (VehicleFound) {
      gsap.to(vehicleFoundRef.current, {
        transform: "translateY(0)"
      })
    } else {
      gsap.to(vehicleFoundRef.current, {
        transform: "translateY(100%)"
      })
    }
  }, [VehicleFound])

  useGSAP(function () {
    if (waitingForDriver) {
      gsap.to(waitingForDriverRef.current, {
        transform: "translateY(0)"
      })
    } else {
      gsap.to(waitingForDriverRef.current, {
        transform: "translateY(100%)"
      })
    }
  }, [waitingForDriver])


  async function findTrip() {
    setPanelOpen(false);
    setVehiclePanel(true);
    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-fare`, {
      params: {
        pickup,
        destination
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });

    setFare(response.data);
  }

  async function createRide() {
    console.log('Creating ride');
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/create`, {
      pickup,
      destination,
      vehicleType,
      paymentMode
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })

    console.log(response.data);
  }



  return (
    <div className='h-screen relative overflow-hidden '>
      <img className='w-16 absolute left-5 top-5 mb-10' src="https://logos-world.net/wp-content/uploads/2020/05/Uber-Logo.png" alt="logo" />
      <div onClick={() => {
        setVehiclePanel(false)
      }} className='h-screen w-screen'>
        <LiveTracking />
      </div>
      <div className={`h-screen flex flex-col justify-end  absolute top-0 w-full  ${panelOpen && "bg-white"}`}>
        <div className='h-[28%] p-6 bg-white relative'>
          <h5
            onClick={() => {
              setPanelOpen(false)
            }}
            ref={panelCloseRef}
            className='absolute right-6 top-6 text-2xl opacity-0'>
            <i className="ri-arrow-down-wide-line"></i>
          </h5>
          <h4 className='text-2xl font-semibold'>Find a trip</h4>
          <form onSubmit={(e) => {
            submitHandler(e)
          }}>
            <div className="line absolute h-16 w-1 top-[47%] left-10 bg-gray-700 rounded-full"></div>
            <input
              onClick={() => {
                setPanelOpen(true);
                setActiveField('pickup');
              }}
              value={pickup}
              onChange={(e) => handleInputChange(e, 'pickup')}
              className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-5'
              type="text"
              placeholder='Add a pick-up location' />
            <input
              onClick={() => {
                setPanelOpen(true);
                setActiveField('destination');
              }}
              value={destination}
              onChange={(e) => handleInputChange(e, 'destination')}
              className='bg-[#eee] px-12 py-2 text-lg rounded-lg  w-full mt-3'
              type="text"
              placeholder='Enter your destination' />
          </form>
          <button className='bg-black text-white px-4 py-2 rounded-lg my-5 w-full' onClick={findTrip}>Find Trip</button>
        </div>
        <div ref={panelRef} className='h-0 bg-white py-2'>
          <LocationSearchPanel
            suggestions={suggestions}
            onLocationSelect={handleLocationSelect}
            activeField={activeField}
          />
        </div>

      </div>
      <div ref={vehiclePanelRef} className='fixed w-full bg-white  z-10 bottom-0  translate-y-full  px-3 py-10  pt-12 max-w-4xl mx-auto'>
        <VehiclePanel
          selectVehicle={setVehicleType}
          fare={fare} setConfirmedRidePanel={setConfirmedRidePanel} setVehiclePanel={setVehiclePanel} />
      </div>
      <div ref={confirmedRidePanelRef} className='fixed w-full bg-white  z-10 bottom-[-10px]  translate-y-full  px-3 py-6  pt-12 max-w-4xl mx-auto'>
        <ConfirmRide
          pickup={pickup}
          destination={destination}
          fare={fare}
          vehicleType={vehicleType}
          createRide={createRide}
          setConfirmedRidePanel={setConfirmedRidePanel} setVehicleFound={setVehicleFound}
          user={user}
          toggleDropdown={toggleDropdown}
          dropdownOpen={dropdownOpen}
          paymentMode={paymentMode}
          selectPaymentMethod={selectPaymentMethod}

        />
      </div>
      <div ref={vehicleFoundRef} className='fixed w-full bg-white  z-10 bottom-[-20px]  translate-y-full  px-3 py-6  pt-12 max-w-4xl mx-auto'>
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
      <div ref={waitingForDriverRef} className='fixed w-full bg-white  z-10 bottom-0 px-3 py-6  pt-12 max-w-4xl mx-auto'>
        <WaitingForDriver ride={ride} setWaitingForDriver={setWaitingForDriver} />
      </div>
    </div>
  )
}

export default Home