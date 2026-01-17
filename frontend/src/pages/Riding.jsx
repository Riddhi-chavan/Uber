import React, { useState, useEffect, useContext, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { SocketContext } from '../context/SocketContext'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js'
import axios from 'axios'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import RideTracking from '../components/RideTracking'
import { useJsApiLoader } from '@react-google-maps/api'
import lookingForRide from "../assets/lookingForRide.png"

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

const PaymentModal = ({ ride, onClose, onPaymentSuccess }) => {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { socket } = useContext(SocketContext)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const createIntentResponse = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/create-payment-intent`,
        { rideId: ride._id },
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
      )

      const { clientSecret, paymentIntentId } = createIntentResponse.data

      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: { name: ride.captain.fullname.firstname }
        }
      })

      if (paymentResult.error) {
        setError(paymentResult.error.message)
        setLoading(false)
        return
      }

      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/confirm-payment`,
        { rideId: ride._id, paymentIntentId: paymentIntentId },
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
      )

      socket.emit("payment-completed", {
        rideId: ride._id,
        captainId: ride.captain._id,
        userId: ride.user._id,
        paymentStatus: 'paid',
        timestamp: new Date().toISOString()
      })

      onPaymentSuccess()
      setLoading(false)
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed')
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Complete Payment</h2>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <i className="ri-close-line text-xl text-gray-600"></i>
          </button>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <p className="text-sm text-gray-500 mb-1">Amount to pay</p>
          <p className="text-3xl font-bold text-gray-900">₹{ride.fare}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Card details</label>
            <div className="border border-gray-200 rounded-xl p-4 bg-white focus-within:border-black focus-within:ring-1 focus-within:ring-black transition-all">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#1F2937',
                      '::placeholder': { color: '#9CA3AF' },
                    },
                    invalid: { color: '#E54B4B' },
                  },
                }}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm flex items-center gap-2">
              <i className="ri-error-warning-line"></i>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-success btn-full btn-lg"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="spinner"></span>
                Processing...
              </span>
            ) : (
              `Pay ₹${ride.fare}`
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

const Riding = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { ride } = location.state || {}
  const { socket } = useContext(SocketContext)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false)
  const [Paid, setPaid] = useState(ride?.paymentStatus === 'paid')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const successOverlayRef = useRef(null)
  const successContentRef = useRef(null)

  useEffect(() => {
    if (socket) {
      const handleRideEnded = () => navigate('/home')
      socket.on("ride-ended", handleRideEnded)
      return () => {
        if (socket) socket.off("ride-ended", handleRideEnded)
      }
    }
  }, [socket, navigate])

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false)
    setPaid(true)
    setShowPaymentSuccess(true)
  }

  useGSAP(() => {
    if (showPaymentSuccess) {
      gsap.set(successOverlayRef.current, { opacity: 0 })
      gsap.set(successContentRef.current, { y: 50, opacity: 0, scale: 0.9 })

      const tl = gsap.timeline({
        onComplete: () => setShowPaymentSuccess(false)
      })

      tl.to(successOverlayRef.current, { opacity: 1, duration: 0.3 })
      tl.to(successContentRef.current, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: "back.out(1.7)"
      })
      tl.to({}, { duration: 2.5 })
      tl.to(successContentRef.current, { y: -30, opacity: 0, duration: 0.3 })
      tl.to(successOverlayRef.current, { opacity: 0, duration: 0.2 }, "-=0.2")
    }
  }, [showPaymentSuccess])

  useEffect(() => {
    if (socket) {
      socket.on("payment-completed", (data) => {
        if (data.rideId === ride._id) {
          setShowPaymentSuccess(true)
          setPaid(true)
        }
      })
    }
    return () => {
      if (socket) socket.off("payment-completed")
    }
  }, [socket, ride])

  const libraries = ['places']
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: googleMapsApiKey,
    libraries: libraries
  })

  const handleCashPayment = async () => {
    setLoading(true)
    setError(null)

    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/confirm-payment`,
        { rideId: ride._id },
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
      )
      setPaid(true)
      setShowPaymentSuccess(true)
    } catch (err) {
      setError(err.response?.data?.message || "Payment failed")
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentProcess = () => {
    if (ride.paymentMode === 'Card') {
      setShowPaymentModal(true)
    } else if (ride.paymentMode === 'Cash') {
      handleCashPayment()
    }
  }

  return (
    <Elements stripe={stripePromise}>
      <div className='min-h-screen bg-gray-50 relative'>
        {/* Header */}
        <Link
          to="/home"
          className='fixed right-4 top-4 z-30 fab'
        >
          <i className="ri-home-4-line text-gray-700"></i>
        </Link>

        {/* Map Section */}
        <div className='h-[55vh]'>
          <RideTracking
            rideData={ride}
            googleMapsApiKey={googleMapsApiKey}
            isLoaded={isLoaded}
          />
        </div>

        {/* Ride Details Card */}
        <div className='bg-white rounded-t-3xl -mt-6 relative z-10 min-h-[45vh] shadow-lg'>
          <div className="bottom-sheet-handle"></div>

          <div className='p-6 pt-2'>
            {/* Driver Info */}
            <div className='flex items-center justify-between mb-6'>
              <div className='flex items-center gap-4'>
                <div className='w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center overflow-hidden'>
                  <img className='w-full h-full object-contain' src={lookingForRide} alt="Vehicle" />
                </div>
                <div>
                  <h2 className='text-lg font-semibold text-gray-900 capitalize'>
                    {ride?.captain?.fullname?.firstname} {ride?.captain?.fullname?.lastname}
                  </h2>
                  <p className='text-xl font-bold text-gray-900 uppercase tracking-wide'>
                    {ride?.captain?.vehicle?.plate}
                  </p>
                  <p className='text-sm text-gray-500'>Maruti Suzuki Alto</p>
                </div>
              </div>

              <div className='text-right'>
                <span className={`badge ${Paid ? 'badge-success' : 'badge-warning'}`}>
                  {Paid ? 'Paid' : 'Unpaid'}
                </span>
              </div>
            </div>

            {/* Fare Info */}
            <div className='bg-gray-50 rounded-2xl p-5 mb-6'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-4'>
                  <div className='w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm'>
                    <i className="ri-money-rupee-circle-line text-2xl text-green-600"></i>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Trip Fare</p>
                    <p className='text-2xl font-bold text-gray-900'>₹{ride?.fare}</p>
                  </div>
                </div>
                <div className='text-right'>
                  <p className='text-sm text-gray-500'>Payment Method</p>
                  <p className='font-semibold text-gray-900'>{ride?.paymentMode}</p>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm flex items-center gap-2">
                <i className="ri-error-warning-line"></i>
                {error}
              </div>
            )}

            {/* Payment Button */}
            <button
              onClick={handlePaymentProcess}
              disabled={Paid || loading}
              className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200 ${Paid
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-success text-white hover:opacity-90 active:scale-[0.98]'
                }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="spinner"></span>
                  Processing...
                </span>
              ) : Paid ? (
                <span className="flex items-center justify-center gap-2">
                  <i className="ri-check-line"></i>
                  Payment Completed
                </span>
              ) : (
                'Make Payment'
              )}
            </button>
          </div>
        </div>

        {/* Payment Modal */}
        {showPaymentModal && (
          <PaymentModal
            ride={ride}
            onClose={() => setShowPaymentModal(false)}
            onPaymentSuccess={handlePaymentSuccess}
          />
        )}

        {/* Payment Success Overlay */}
        {showPaymentSuccess && (
          <div ref={successOverlayRef} className='success-overlay'>
            <div ref={successContentRef} className='text-center'>
              <div className='w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6'>
                <i className="ri-check-line text-5xl text-green-600"></i>
              </div>
              <h2 className='text-2xl font-bold text-gray-900 mb-2'>Payment Successful!</h2>
              <p className='text-gray-500'>Your payment of ₹{ride?.fare} has been processed</p>
            </div>
          </div>
        )}
      </div>
    </Elements>
  )
}

export default Riding