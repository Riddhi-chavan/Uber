import axios from 'axios'
import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserDataContext } from '../context/UserContext'

const UserLogin = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const { setUser } = useContext(UserDataContext)
    const navigate = useNavigate()

    const submitHandler = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, {
                email,
                password
            })

            if (response.status === 200) {
                const data = response.data
                setUser(data.user)
                localStorage.setItem("token", data.token)
                navigate('/home')
            }
        } catch (err) {
            setError(err.response?.data?.message || "Login failed. Please try again.")
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
                    className='w-24 h-auto'
                    src="https://logos-world.net/wp-content/uploads/2020/05/Uber-Logo.png"
                    alt="Uber"
                />
            </div>

            {/* Auth Card */}
            <div className="auth-card">
                <h1 className="auth-title">Welcome back</h1>
                <p className="auth-subtitle">Sign in to continue</p>

                <form onSubmit={submitHandler} className="space-y-5">
                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm flex items-center gap-2">
                            <i className="ri-error-warning-line"></i>
                            {error}
                        </div>
                    )}

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
                        Don't have an account?{' '}
                        <Link
                            to="/signup"
                            className="text-black font-semibold hover:underline"
                        >
                            Sign up
                        </Link>
                    </p>

                    <div className="divider"></div>

                    <Link
                        to="/captain-login"
                        className="btn-secondary btn-full flex items-center justify-center gap-2"
                    >
                        <i className="ri-steering-2-line"></i>
                        Sign in as Driver
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default UserLogin
