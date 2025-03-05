import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios"
import { UserDataContext } from '../context/UserContext'

const UserSignup = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [userData, setUserData] = useState({})


  const { user, setUser } = useContext(UserDataContext)

  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault()
    const newUser = {
      fullname: {
        firstname: firstName,
        lastname: lastName,
      },
      email: email,
      password: password
    }

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, newUser)
    if (response.status === 201) {
      const data = response.data
      setUser(data.user)
      localStorage.setItem("token", data.token)
      navigate("/home")
    }
    console.log(userData);
    setEmail("")
    setFirstName("")
    setLastName("")
    setPassword("")
  }
  return (
    <div class="bg-black text-white flex min-h-screen flex-col items-center pt-16 sm:justify-center sm:pt-0">
      <div class="text-foreground font-semibold text-2xl tracking-tighter mx-auto flex items-center">
        <div>
          <img className='w-16 ' src="/uberLogo.png" alt="" />
        </div>
      </div>

      <div class="relative mt-12 w-full max-w-lg sm:mt-10">
        <div class="relative -mb-px h-px w-full bg-gradient-to-r from-transparent via-sky-300 to-transparent"
          bis_skin_checked="1"></div>
        <div
          class="mx-5 border dark:border-b-white/50 dark:border-t-white/50 border-b-white/20 sm:border-t-white/20 dark:shadow-white/20 rounded-lg border-white/20 border-l-white/20 border-r-white/20 sm:shadow-sm lg:rounded-xl shadow-none">
          <div class="flex flex-col p-6">
            <h3 class="text-xl font-semibold leading-6 tracking-tighter">Register</h3>
            <p class="mt-1.5 text-sm font-medium text-white/50">Welcome, enter your credentials to continue.
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
              <p className='text-left mt-2 text-sm ml-1'>Already have a account? <Link to="/login" className='text-gray-400'>Login here</Link></p>
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

export default UserSignup