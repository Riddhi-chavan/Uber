import axios from 'axios'
import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CaptainDataContext } from '../context/CaptainContext'

const CaptainLogin = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [captainData, setCaptainData] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const { captain, setCaptain } = useContext(CaptainDataContext)
  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
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
    } catch (error) {
      console.error("Login error:", error)
    } finally {
      setIsLoading(false)
    }

    setEmail("")
    setPassword("")
  }

  return (
    <div className="auth-container">
      {/* Logo */}
      <div className="mb-10">
        <img
          className='w-16 h-auto'
          src="/captain-logo.png"
          alt="Captain"
        />
      </div>

      {/* Auth Card */}
      <div className="auth-card">
        <h1 className="auth-title">Welcome back, Captain</h1>
        <p className="auth-subtitle">Sign in to start driving and earning</p>

        <form onSubmit={submitHandler} className="space-y-5">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="name@example.com"
              autoComplete="email"
              className="input"
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              className="input"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary btn-full btn-lg mt-6"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="spinner"></span>
                Signing in...
              </span>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        {/* Links */}
        <div className="mt-8 space-y-4">
          <p className="text-center text-gray-500">
            New to driving?{' '}
            <Link
              to="/captain-signup"
              className="text-black font-semibold hover:underline"
            >
              Register as Captain
            </Link>
          </p>

          <div className="divider"></div>

          <Link
            to="/login"
            className="btn-secondary btn-full"
          >
            Sign in as Rider
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CaptainLogin