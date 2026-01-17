import React, { useContext, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CaptainDataContext } from '../context/CaptainContext'
import axios from 'axios'

const CaptainSignup = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [vehicleColor, setVehicleColor] = useState("")
  const [vehiclePlate, setVehiclePlate] = useState("")
  const [vehicleCapacity, setVehicleCapacity] = useState("")
  const [vehicleType, setVehicleType] = useState("")
  const [profilePic, setProfilePic] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef(null)
  const { setCaptain } = useContext(CaptainDataContext)
  const navigate = useNavigate()

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      setProfilePic(file)
      const fileReader = new FileReader()
      fileReader.onload = () => setPreviewUrl(fileReader.result)
      fileReader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      setProfilePic(file)
      const fileReader = new FileReader()
      fileReader.onload = () => setPreviewUrl(fileReader.result)
      fileReader.readAsDataURL(file)
    }
  }

  const triggerFileInput = () => fileInputRef.current.click()

  const submitHandler = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData()
    formData.append('firstname', firstName)
    formData.append('lastname', lastName)
    formData.append('email', email)
    formData.append('password', password)
    formData.append('vehicleColor', vehicleColor)
    formData.append('vehiclePlate', vehiclePlate)
    formData.append('vehicleCapacity', vehicleCapacity)
    formData.append('vehicleType', vehicleType)

    if (profilePic) {
      formData.append('profilePic', profilePic)
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/captains/register`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )

      if (response.status === 201) {
        const data = response.data
        setCaptain(data.captain)
        localStorage.setItem("Captaintoken", data.token)
        navigate("/captain-home")
      }
    } catch (error) {
      console.error("Registration error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white py-8 px-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <img className='w-16 h-auto mx-auto mb-6' src="/captain-logo.png" alt="Captain" />
          <h1 className="text-2xl font-bold text-gray-900">Become a Captain</h1>
          <p className="text-gray-500 mt-2">Start earning on your own schedule</p>
        </div>

        <form onSubmit={submitHandler} className="space-y-6">
          {/* Profile Picture Upload */}
          <div className="flex flex-col items-center">
            <div
              className={`w-28 h-28 rounded-full border-2 border-dashed flex items-center justify-center cursor-pointer overflow-hidden transition-all duration-200
                ${isDragging ? 'border-black bg-gray-100 scale-105' : 'border-gray-300 hover:border-gray-400'}`}
              onClick={triggerFileInput}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {previewUrl ? (
                <img src={previewUrl} alt="Profile Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-4">
                  <i className="ri-camera-line text-3xl text-gray-400"></i>
                  <p className="text-xs text-gray-400 mt-1">Add photo</p>
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
            <p className="text-xs text-gray-400 mt-3">Tap to upload your photo</p>
          </div>

          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Personal Information</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First name</label>
                <input
                  type="text"
                  required
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last name</label>
                <input
                  type="text"
                  required
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="input"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                required
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
              />
            </div>
          </div>

          {/* Vehicle Information */}
          <div className="space-y-4 pt-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Vehicle Information</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle color</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., White"
                  value={vehicleColor}
                  onChange={(e) => setVehicleColor(e.target.value)}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">License plate</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., MH01AB1234"
                  value={vehiclePlate}
                  onChange={(e) => setVehiclePlate(e.target.value)}
                  className="input"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle type</label>
              <select
                required
                className="input cursor-pointer"
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
              >
                <option value="">Select vehicle type</option>
                <option value="car">Car</option>
                <option value="auto">Auto</option>
                <option value="moto">Motorcycle</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Seating capacity</label>
              <input
                type="number"
                required
                placeholder="Number of passengers"
                value={vehicleCapacity}
                onChange={(e) => setVehicleCapacity(e.target.value)}
                className="input"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary btn-full btn-lg mt-8"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="spinner"></span>
                Creating account...
              </span>
            ) : (
              'Create Captain Account'
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-500 mt-8">
          Already have an account?{' '}
          <Link to="/captain-login" className="text-black font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default CaptainSignup