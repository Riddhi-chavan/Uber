import axios from 'axios'
import React, { useContext, useState } from 'react'
import { Link, Links, useNavigate } from 'react-router-dom'
import { CaptainDataContext } from '../context/CaptainContext'

const CaptainLogin = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [captainData, setCaptainData] = useState({})
  const { captain, setCaptain } = useContext(CaptainDataContext)
  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault()
    const CaptainData = {
      email: email,
      password: password
    }

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/login`, CaptainData)
    if (response.status === 200) {
      const data = response.data
      setCaptain(data.captain)
      localStorage.setItem("Captaintoken", data.token)
      navigate('/captain-home')
    }
    console.log(captainData);

    setEmail("")
    setPassword("")
  }
  return (
    <div class="bg-white text-black flex min-h-screen flex-col items-center pt-16 sm:justify-center sm:pt-0">

      <div class="text-foreground font-semibold text-2xl tracking-tighter mx-auto flex items-center">
        <div>
          <img className='w-20' src="/captain-logo.png" alt="" />
        </div>
      </div>

      <div class="relative mt-12 w-full max-w-lg sm:mt-10">
        <div class="relative -mb-px h-px w-full bg-gradient-to-r from-transparent via-sky-300 to-transparent"
          bis_skin_checked="1"></div>
        <div
          class="mx-5 border border-b-black/50 border-t-black/50  sm:border-t-black/20 shadow-black/20 rounded-lg border-black/20 border-l-black/20 border-r-black/20 sm:shadow-sm lg:rounded-xl lg:shadow-none">
          <div class="flex flex-col p-6">
            <h3 class="text-xl font-semibold leading-6 tracking-tighter">Captain Login</h3>
            <p class="mt-1.5 text-sm font-medium text-black/50">Welcome back Captain, enter your credentials to continue.
            </p>
          </div>
          <div class="p-6 py-10 pt-0">
            <form onSubmit={(e) => {
              submitHandler(e)
            }}>
              <div>
                <div>
                  <div
                    class="group relative rounded-lg border focus-within:border-sky-200 px-3  duration-200 focus-within:ring focus-within:ring-sky-300/30">

                    <input name="username"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                      }}
                      required
                      placeholder='email@example.com'
                      autocomplete="off"
                      class="block w-full border-0 bg-transparent p-0 text-sm file:my-1 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:font-medium placeholder:text-muted-foreground/90 focus:outline-none focus:ring-0 sm:leading-7 text-foreground py-2" />
                  </div>
                </div>
              </div>
              <div class="mt-4">
                <div>
                  <div
                    class="group relative rounded-lg border focus-within:border-sky-200 px-3  duration-200 focus-within:ring focus-within:ring-sky-300/30">

                    <div class="flex items-center">
                      <input type="password" name="password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value)
                        }}

                        required
                        placeholder='password'
                        class="block w-full border-0 bg-transparent p-0 text-sm file:my-1 placeholder:text-muted-foreground/90 focus:outline-none focus:ring-0 focus:ring-teal-500 sm:leading-7 text-foreground py-2" />
                    </div>
                  </div>
                </div>
              </div>
              <p className='text-left mt-2 text-sm ml-1'>Join a fleet?<Link to="/captain-signup" className='text-gray-400'> Register as a Captain</Link></p>
              <div class="mt-4 flex items-center justify-end gap-x-2">

                <button
                  class="font-semibold bg-black text-white hover:ring hover:ring-white transition duration-300 inline-flex items-center justify-center rounded-md text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50   h-10 px-4 py-2"
                  type="submit">Login</button>
              </div>
            </form>
            <Link class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:ring hover:ring-black h-10 px-4 py-2 duration-200 w-full mt-6"
              to="/login">Sign in as User</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CaptainLogin