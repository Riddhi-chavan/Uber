import React, { useContext, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserDataContext } from '../context/UserContext'
import axios from 'axios'

const UserSignup = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [profilePic, setProfilePic] = useState(null)
    const [previewUrl, setPreviewUrl] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const fileInputRef = useRef(null)
    const { setUser } = useContext(UserDataContext)
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

    const submitHandler = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        const formData = new FormData()
        formData.append('firstname', firstName)
        formData.append('lastname', lastName)
        formData.append('email', email)
        formData.append('password', password)
        if (profilePic) {
            formData.append('profilePic', profilePic)
        }

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/users/register`,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            )

            if (response.status === 201) {
                const data = response.data
                setUser(data.user)
                localStorage.setItem("token", data.token)
                navigate('/home')
            }
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-white py-8 px-6">
            <div className="max-w-md mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <img
                        className='w-24 h-auto mx-auto mb-6'
                        src="https://logos-world.net/wp-content/uploads/2020/05/Uber-Logo.png"
                        alt="Uber"
                    />
                    <h1 className="text-2xl font-bold text-gray-900">Create account</h1>
                    <p className="text-gray-500 mt-2">Sign up to start your journey</p>
                </div>

                <form onSubmit={submitHandler} className="space-y-6">
                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm flex items-center gap-2">
                            <i className="ri-error-warning-line"></i>
                            {error}
                        </div>
                    )}

                    {/* Profile Picture Upload */}
                    <div className="flex flex-col items-center">
                        <div
                            className='w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer overflow-hidden transition-all duration-200 hover:border-gray-400'
                            onClick={() => fileInputRef.current.click()}
                        >
                            {previewUrl ? (
                                <img src={previewUrl} alt="Profile Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center">
                                    <i className="ri-camera-line text-2xl text-gray-400"></i>
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
                        <p className="text-xs text-gray-400 mt-2">Add profile photo (optional)</p>
                    </div>

                    {/* Name Fields */}
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

                    {/* Email */}
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

                    {/* Password */}
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
                        <p className="text-xs text-gray-400 mt-1">Must be at least 6 characters</p>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn-primary btn-full btn-lg"
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <span className="spinner"></span>
                                Creating account...
                            </span>
                        ) : (
                            'Create account'
                        )}
                    </button>
                </form>

                {/* Footer */}
                <p className="text-center text-gray-500 mt-8">
                    Already have an account?{' '}
                    <Link to="/login" className="text-black font-semibold hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default UserSignup
