import React, { useContext, useState, useRef } from 'react'
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
  const [profilePic, setProfilePic] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)
  const { captain, setCaptain } = useContext(CaptainDataContext)
  const navigate = useNavigate()

  // Handle file selection from input
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      setProfilePic(file)
      const fileReader = new FileReader()
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result)
      }
      fileReader.readAsDataURL(file)
    }
  }

  // Handle drag over event
  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  // Handle drag leave event
  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  // Handle drop event
  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      setProfilePic(file)
      const fileReader = new FileReader()
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result)
      }
      fileReader.readAsDataURL(file)
    }
  }

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current.click()
  }

  const submitHandler = async (e) => {
    e.preventDefault()

    // Create FormData to handle file upload
    const formData = new FormData()

    // Add all captain data to the FormData
    formData.append('firstname', firstName)
    formData.append('lastname', lastName)
    formData.append('email', email)
    formData.append('password', password)
    formData.append('vehicleColor', vehicleColor)
    formData.append('vehiclePlate', vehiclePlate)
    formData.append('vehicleCapacity', vehicleCapacity)
    formData.append('vehicleType', vehicleType)

    // Append profile picture if it exists
    if (profilePic) {
      formData.append('profilePic', profilePic)
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/captains/register`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      if (response.status === 201) {
        const data = response.data
        setCaptain(data.captain)
        localStorage.setItem("Captaintoken", data.token)
        navigate("/captain-home")
      }
    } catch (error) {
      console.error("Registration error:", error)
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
    setProfilePic(null)
    setPreviewUrl(null)
  }

  return (
    <div className="bg-white text-black flex min-h-screen flex-col items-center pt-16 sm:justify-center sm:pt-0">
      <div className="text-foreground font-semibold text-2xl tracking-tighter mx-auto flex items-center">
        <div>
          <img className='w-20' src="/captain-logo.png" alt="" />
        </div>
      </div>

      <div className="relative my-12 w-full max-w-lg sm:mt-10">
        <div className="relative -mb-px h-px w-full bg-gradient-to-r from-transparent via-sky-300 to-transparent"></div>
        <div className="mx-5 border border-b-black/50 border-t-black/50 sm:border-t-black/20 shadow-black/20 rounded-lg border-black/20 border-l-black/20 border-r-black/20 sm:shadow-sm lg:rounded-xl lg:shadow-none">
          <div className="flex flex-col p-6">
            <h3 className="text-xl font-semibold leading-6 tracking-tighter">Captain Register</h3>
            <p className="mt-1.5 text-sm font-medium text-black/50">Welcome Captain, enter your credentials to continue.</p>
          </div>
          <div className="p-6 pt-0">
            <form onSubmit={submitHandler}>
              {/* Profile Picture Upload */}
              <div className="mb-6 flex flex-col items-center">
                <div
                  className={`w-32 h-32 rounded-full border-2 border-dashed flex items-center justify-center cursor-pointer mb-2 overflow-hidden ${isDragging ? 'border-sky-400 bg-sky-50' : 'border-gray-300'}`}
                  onClick={triggerFileInput}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {previewUrl ? (
                    <img src={previewUrl} alt="Profile Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <p className="text-xs mt-1">Add photo</p>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <p className="text-xs text-gray-500">Drag & drop or click to upload</p>
              </div>

              <div className='flex gap-4 items-center'>
                <div className='w-[50%]'>
                  <div>
                    <div className="group relative rounded-lg border focus-within:border-sky-200 px-3 duration-200 focus-within:ring focus-within:ring-sky-300/30">
                      <input
                        name="firstname"
                        type="text"
                        required
                        placeholder='First name'
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        autoComplete="off"
                        className="block w-full border-0 bg-transparent p-0 text-sm file:my-1 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:font-medium placeholder:text-muted-foreground/90 focus:outline-none focus:ring-0 sm:leading-7 text-foreground py-2"
                      />
                    </div>
                  </div>
                </div>
                <div className='w-[50%]'>
                  <div>
                    <div className="group relative rounded-lg border focus-within:border-sky-200 px-3 duration-200 focus-within:ring focus-within:ring-sky-300/30">
                      <input
                        name="lastname"
                        type="text"
                        required
                        placeholder='Last name'
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        autoComplete="off"
                        className="block w-full border-0 bg-transparent p-0 text-sm file:my-1 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:font-medium placeholder:text-muted-foreground/90 focus:outline-none focus:ring-0 sm:leading-7 text-foreground py-2"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className='flex gap-4 items-center mt-4'>
                <div className='w-full'>
                  <div>
                    <div className="group relative rounded-lg border focus-within:border-sky-200 px-3 duration-200 focus-within:ring focus-within:ring-sky-300/30">
                      <input
                        name="email"
                        type="email"
                        required
                        placeholder='email@example.com'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="off"
                        className="block w-full border-0 bg-transparent p-0 text-sm file:my-1 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:font-medium placeholder:text-muted-foreground/90 focus:outline-none focus:ring-0 sm:leading-7 text-foreground py-2"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <div>
                  <div className="group relative rounded-lg border focus-within:border-sky-200 px-3 duration-200 focus-within:ring focus-within:ring-sky-300/30">
                    <input
                      type="password"
                      name="password"
                      required
                      placeholder='password'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full border-0 bg-transparent p-0 text-sm file:my-1 placeholder:text-muted-foreground/90 focus:outline-none focus:ring-0 focus:ring-teal-500 sm:leading-7 text-foreground py-2.5"
                    />
                  </div>
                </div>
              </div>
              <p className='text-left mt-4 text-sm ml-1'>Vehicle Details</p>
              <div className='flex gap-4 items-center mt-2'>
                <div className='w-[50%]'>
                  <div>
                    <div className="group relative rounded-lg border focus-within:border-sky-200 px-3 duration-200 focus-within:ring focus-within:ring-sky-300/30">
                      <input
                        name="vehicleColor"
                        type="text"
                        required
                        placeholder='Vehicle Color'
                        value={vehicleColor}
                        onChange={(e) => setVehicleColor(e.target.value)}
                        autoComplete="off"
                        className="block w-full border-0 bg-transparent p-0 text-sm file:my-1 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:font-medium placeholder:text-muted-foreground/90 focus:outline-none focus:ring-0 sm:leading-7 text-foreground py-2"
                      />
                    </div>
                  </div>
                </div>
                <div className='w-[50%]'>
                  <div>
                    <div className="group relative rounded-lg border focus-within:border-sky-200 px-3 duration-200 focus-within:ring focus-within:ring-sky-300/30">
                      <input
                        name="vehiclePlate"
                        type="text"
                        required
                        placeholder='Vehicle Plate Number'
                        value={vehiclePlate}
                        onChange={(e) => setVehiclePlate(e.target.value)}
                        autoComplete="off"
                        className="block w-full border-0 bg-transparent p-0 text-sm file:my-1 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:font-medium placeholder:text-muted-foreground/90 focus:outline-none focus:ring-0 sm:leading-7 text-foreground py-2"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <select
                required
                className='bg-[#ff] rounded-lg px-4 py-2 border w-full text-gray-400 mt-4'
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
              >
                <option value="">Select Vehicle Type</option>
                <option value="car">Car</option>
                <option value="auto">Auto</option>
                <option value="moto">Moto</option>
              </select>
              <div className='flex gap-4 items-center mt-4'>
                <div className='w-full'>
                  <div>
                    <div className="group relative rounded-lg border focus-within:border-sky-200 px-3 duration-200 focus-within:ring focus-within:ring-sky-300/30">
                      <input
                        name="vehicleCapacity"
                        type="number"
                        required
                        placeholder='Vehicle Capacity'
                        value={vehicleCapacity}
                        onChange={(e) => setVehicleCapacity(e.target.value)}
                        autoComplete="off"
                        className="block w-full border-0 bg-transparent p-0 text-sm file:my-1 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:font-medium placeholder:text-muted-foreground/90 focus:outline-none focus:ring-0 sm:leading-7 text-foreground py-2"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <p className='text-left mt-2 text-sm ml-1'>Already have an account? <Link to="/captain-login" className='text-gray-400'>Login here</Link></p>
              <div className="mt-4 flex items-center justify-end gap-x-2">
                <button
                  className="font-semibold bg-black text-white hover:ring hover:ring-white transition duration-300 inline-flex items-center justify-center rounded-md text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2"
                  type="submit">Register</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CaptainSignup