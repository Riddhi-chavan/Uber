import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { CaptainDataContext } from '../context/CaptainContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const CaptainSignup = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [userData, setUserData] = useState({})
  const [vehicleColor, setVehicleColor] = useState("")
  const [vehiclePlate, setVehiclePlate] = useState("")
  const [vehicleCapacity, setVehicleCapacity] = useState("")
  const [vehicleType, setVehicleType] = useState("")
  const { captain, setCaptain } = useContext(CaptainDataContext)
  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault()
    const CaptainData = {
      fullname: {
        firstname: firstName,
        lastname: lastName,
      },
      email: email,
      password: password,
      vehicle: {
        color: vehicleColor,
        plate: vehiclePlate,
        capacity: vehicleCapacity,
        vehicleType: vehicleType
      }
    }

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/register`, CaptainData)
    if (response.status === 201) {
      const data = response.data
      setCaptain(data.user)
      localStorage.setItem("token", data.token)
      navigate("/captain-home")
    }
    console.log(userData);
    setEmail("")
    setFirstName("")
    setLastName("")
    setPassword("")
    setVehicleCapacity("")
    setVehicleColor("")
    setVehiclePlate("")
    setVehicleType("")
  }
  return (
    <div className='py-5 px-5 h-screen flex flex-col justify-between overflow-auto'>
      <div>
        <img className='w-16 mb-6' src="/captain-logo.png" alt="" />
        <form onSubmit={(e) => {
          submitHandler(e)
        }}>
          <h3 className='text-base font-medium mb-2'>What's Our Captain's  name</h3>
          <div className='flex gap-4 mb-6'>
            <input
              type="text"
              required
              placeholder='First name'
              className='bg-[#eeeeee] rounded px-4  py-2 border w-1/2  text-base placeholder:text-sm'
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value)
              }}
            />
            <input
              type="text"
              required
              placeholder='Last name'
              className='bg-[#eeeeee]  rounded px-4  w-1/2 py-2 border  text-base placeholder:text-sm'
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value)
              }}
            />
          </div>
          <h3 className='text-base font-medium mb-2'>What's Our Captain's email</h3>
          <input
            type="email"
            required
            placeholder='email@example.com'
            className='bg-[#eeeeee] mb-6 rounded px-4  py-2 border w-full text-base placeholder:text-sm'
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
            }}
          />
          <h3 className='text-base font-medium mb-2'>Enter password</h3>
          <input
            type="password"
            required
            placeholder='password'
            className='bg-[#eeeeee] mb-6 rounded px-4  py-2 border w-full text-base placeholder:text-base'
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
            }}
          />
          <h3 className='text-base font-medium mb-2'>Vehicle Details</h3>
          <div className='flex gap-4 mb-6'>
            <input
              type="text"
              required
              placeholder='Vehicle Color'
              className='bg-[#eeeeee] rounded px-4 py-2 border w-1/2 text-base placeholder:text-sm'
              value={vehicleColor}
              onChange={(e) => setVehicleColor(e.target.value)}
            />
            <input
              type="text"
              required
              placeholder='Vehicle Plate Number'
              className='bg-[#eeeeee] rounded px-4 py-2 border w-1/2 text-base placeholder:text-sm'
              value={vehiclePlate}
              onChange={(e) => setVehiclePlate(e.target.value)}
            />
          </div>
          <div className='flex gap-4 mb-6'>
            <select
              required
              className='bg-[#eeeeee] rounded px-4 py-2 border w-full  '
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
            >
              <option value="">Select Vehicle Type</option>
              <option value="car">Car</option>
              <option value="auto">Auto</option>
              <option value="moto">Moto</option>
            </select>

          </div>
          <div className='flex gap-4 mb-6 justify-end'>

            <input
              type="number"
              required
              placeholder='Vehicle Capacity'
              className='bg-[#eeeeee] rounded px-4 py-2 border w-1/2 text-base placeholder:text-sm'
              value={vehicleCapacity}
              onChange={(e) => setVehicleCapacity(e.target.value)}
            />
          </div>
          <button className='bg-[#111] text-[#fff] font-semibold mb-3 rounded px-4  py-2  w-full text-lg placeholder:text-sm' type='submit'>Create Captain Account</button>
          <p className='text-center'>Already have a account? <Link to="/captain-login" className='text-blue-600'>Login here</Link></p>
        </form>
      </div>
      <div className='mt-20'>
        <p className='text-[10px] leading-tight'>This site is protected by reCAPTCHA and the <span className='underline'>Google Privacy Policy</span> and <span className='underline'>Terms of Service apply</span>.</p>
      </div>
    </div>
  )
}

export default CaptainSignup