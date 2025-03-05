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
      setCaptain(data.captain)
      localStorage.setItem("Captaintoken", data.token)
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
    <div class="bg-black text-white flex min-h-screen  flex-col items-center pt-16 sm:justify-center sm:pt-0">
      <div class="text-foreground font-semibold text-2xl tracking-tighter mx-auto flex items-center">
        <div>
          <img className='w-20' src="/captain-logo.png" alt="" />
        </div>
      </div>

      <div class="relative my-12 w-full max-w-lg sm:mt-10">
        <div class="relative -mb-px h-px w-full bg-gradient-to-r from-transparent via-sky-300 to-transparent"
          bis_skin_checked="1"></div>
        <div
          class="mx-5 border dark:border-b-white/50 dark:border-t-white/50 border-b-white/20 sm:border-t-white/20  dark:shadow-white/20 rounded-lg border-white/20 border-l-white/20 border-r-white/20 sm:shadow-sm lg:rounded-xl shadow-none">
          <div class="flex flex-col p-6">
            <h3 class="text-xl font-semibold leading-6 tracking-tighter">Captain Register</h3>
            <p class="mt-1.5 text-sm font-medium text-white/50">Welcome Captain, enter your credentials to continue.
            </p>
          </div>
          <div class="p-6  pt-0">
            <form onSubmit={(e) => {
              submitHandler(e)
            }}>
              <div className='flex gap-4 items-center'>
                <div className='w-[50%]'>
                  <div>
                    <div
                      class="group relative rounded-lg border focus-within:border-sky-200 px-3   duration-200 focus-within:ring focus-within:ring-sky-300/30">
                      <div class="flex justify-between">
                      </div>
                      <input name="username"
                        type="text"
                        required
                        placeholder='First name'
                        value={firstName}
                        onChange={(e) => {
                          setFirstName(e.target.value)
                        }}
                        autocomplete="off"
                        class="block w-full border-0 bg-transparent p-0 text-sm file:my-1 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:font-medium placeholder:text-muted-foreground/90 focus:outline-none focus:ring-0 sm:leading-7 text-foreground py-2" />
                    </div>
                  </div>
                </div>
                <div className='w-[50%]'>
                  <div>
                    <div
                      class="group relative rounded-lg border focus-within:border-sky-200 px-3  duration-200 focus-within:ring focus-within:ring-sky-300/30">
                      <div class="flex justify-between">


                      </div>
                      <input name="username"
                        type="text"
                        required
                        placeholder='Last name'
                        value={lastName}
                        onChange={(e) => {
                          setLastName(e.target.value)
                        }}
                        autocomplete="off"
                        class="block w-full border-0 bg-transparent p-0 text-sm file:my-1 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:font-medium placeholder:text-muted-foreground/90 focus:outline-none focus:ring-0 sm:leading-7 text-foreground py-2" />
                    </div>
                  </div>
                </div>
              </div>
              <div className='flex gap-4 items-center mt-4'>
                <div className='w-[1000%]'>
                  <div>
                    <div
                      class="group relative rounded-lg border focus-within:border-sky-200 px-3   duration-200 focus-within:ring focus-within:ring-sky-300/30">
                      <div class="flex justify-between">
                      </div>
                      <input name="username"
                        type="email"
                        required
                        placeholder='email@example.com'

                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value)
                        }}
                        autocomplete="off"
                        class="block w-full border-0 bg-transparent p-0 text-sm file:my-1 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:font-medium placeholder:text-muted-foreground/90 focus:outline-none focus:ring-0 sm:leading-7 text-foreground py-2" />
                    </div>
                  </div>
                </div>
              </div>
              <div class="mt-4">
                <div>
                  <div
                    class="group relative rounded-lg border focus-within:border-sky-200 px-3 duration-200 focus-within:ring focus-within:ring-sky-300/30">
                    <div class="flex items-center">
                      <input type="password" name="password"
                        required
                        placeholder='password'
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value)
                        }}
                        class="block w-full border-0 bg-transparent p-0 text-sm file:my-1 placeholder:text-muted-foreground/90 focus:outline-none focus:ring-0 focus:ring-teal-500 sm:leading-7 text-foreground py-2.5" />
                    </div>
                  </div>
                </div>
              </div>
              <p className='text-left mt-4 text-sm ml-1'>Vehicle Details</p>
              <div className='flex gap-4 items-center mt-2'>
                <div className='w-[50%]'>
                  <div>
                    <div
                      class="group relative rounded-lg border focus-within:border-sky-200 px-3   duration-200 focus-within:ring focus-within:ring-sky-300/30">
                      <div class="flex justify-between">
                      </div>
                      <input name="username"
                        type="text"
                        required
                        placeholder='Vehicle Color'

                        value={vehicleColor}
                        onChange={(e) => setVehicleColor(e.target.value)}
                        autocomplete="off"
                        class="block w-full border-0 bg-transparent p-0 text-sm file:my-1 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:font-medium placeholder:text-muted-foreground/90 focus:outline-none focus:ring-0 sm:leading-7 text-foreground py-2" />
                    </div>
                  </div>
                </div>
                <div className='w-[50%]'>
                  <div>
                    <div
                      class="group relative rounded-lg border focus-within:border-sky-200 px-3  duration-200 focus-within:ring focus-within:ring-sky-300/30">
                      <div class="flex justify-between">


                      </div>
                      <input name="username"
                        type="text"
                        required
                        placeholder='Vehicle Plate Number'

                        value={vehiclePlate}
                        onChange={(e) => setVehiclePlate(e.target.value)}
                        autocomplete="off"
                        class="block w-full border-0 bg-transparent p-0 text-sm file:my-1 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:font-medium placeholder:text-muted-foreground/90 focus:outline-none focus:ring-0 sm:leading-7 text-foreground py-2" />
                    </div>
                  </div>
                </div>
              </div>
              <select
                required
                className='bg-[#000] rounded-lg px-4 py-2 border w-full text-white mt-4 '
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
              >
                <option value="">Select Vehicle Type</option>
                <option value="car">Car</option>
                <option value="auto">Auto</option>
                <option value="moto">Moto</option>
              </select>
              <div className='flex gap-4 items-center mt-4'>
                <div className='w-[1000%]'>
                  <div>
                    <div
                      class="group relative rounded-lg border focus-within:border-sky-200 px-3   duration-200 focus-within:ring focus-within:ring-sky-300/30">
                      <div class="flex justify-between">
                      </div>
                      <input name="username"
                        type="number"
                        required
                        placeholder='Vehicle Capacity'
                        value={vehicleCapacity}
                        onChange={(e) => setVehicleCapacity(e.target.value)}
                        autocomplete="off"
                        class="block w-full border-0 bg-transparent p-0 text-sm file:my-1 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:font-medium placeholder:text-muted-foreground/90 focus:outline-none focus:ring-0 sm:leading-7 text-foreground py-2" />
                    </div>
                  </div>
                </div>
              </div>
              <p className='text-left mt-2 text-sm ml-1'>Already have a account? <Link to="/captain-login" className='text-gray-400'>Login here</Link></p>
              <div class="mt-4 flex items-center justify-end gap-x-2">
                <button
                  class="font-semibold hover:bg-black hover:text-white hover:ring hover:ring-white transition duration-300 inline-flex items-center justify-center rounded-md text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-white text-black h-10 px-4 py-2"
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