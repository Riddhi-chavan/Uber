import React, { useState, useEffect, useContext, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { SocketContext } from '../context/SocketContext'
import LiveTracking from '../components/LiveTracking'
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import axios from 'axios';
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import RideTracking from '../components/RideTracking'
import { useJsApiLoader } from '@react-google-maps/api';

// Stripe publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PaymentModal = ({ ride, onClose, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { socket } = useContext(SocketContext)

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Create Payment Intent
      const createIntentResponse = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/create-payment-intent`,
        { rideId: ride._id },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      const { clientSecret, paymentIntentId } = createIntentResponse.data;

      // Confirm Payment
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: ride.captain.fullname.firstname
          }
        }
      });

      if (paymentResult.error) {
        setError(paymentResult.error.message);
        setLoading(false);
        return;
      }

      // Confirm payment on backend
      await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/confirm-payment`,
        {
          rideId: ride._id,
          paymentIntentId: paymentIntentId
        },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      // In your PaymentModal's handleSubmit function
      socket.emit("payment-completed", {
        rideId: ride._id,
        captainId: ride.captain._id,
        userId: ride.user._id,
        paymentStatus: 'paid',
        timestamp: new Date().toISOString()
      });

      onPaymentSuccess();
      console.log("payment successful")

      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed');
      setLoading(false);
    }
  };




  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Pay for Your Ride</h2>
        <form onSubmit={handleSubmit}>
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
          {error && (
            <div className="text-red-500 mt-2">
              {error}
            </div>
          )}
          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              {loading ? 'Processing...' : `Pay ₹${ride.fare}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Riding = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { ride } = location.state || {};
  const { socket } = useContext(SocketContext);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [Paid, setPaid] = useState(false)

  // Refs for GSAP animations
  const successOverlayRef = useRef(null);
  const successContentRef = useRef(null);

  useEffect(() => {
    // Safely handle socket connection
    if (socket) {
      const handleRideEnded = () => {
        navigate('/home');
      };

      socket.on("ride-ended", handleRideEnded);

      // Cleanup listener on component unmount
      return () => {
        if (socket) {
          socket.off("ride-ended", handleRideEnded);
        }
      };
    }
  }, [socket, navigate]);

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
  };

  useGSAP(() => {
    if (showPaymentSuccess) {
      // Initial states
      gsap.set(successOverlayRef.current, { opacity: 0 });
      gsap.set(successContentRef.current, { y: 200, opacity: 0 });

      const tl = gsap.timeline({
        onComplete: () => {
          setShowPaymentSuccess(false); // Reset the state when animation completes
        }
      });


      // Animate overlay fade in
      tl.to(successOverlayRef.current, {
        opacity: 1,
        duration: 0.3
      });

      // Animate content from bottom to center
      tl.to(successContentRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.4,
        ease: "power2.out"
      });

      // Hold in center
      tl.to({}, { duration: 2 });

      // Animate content up and fade out
      tl.to(successContentRef.current, {
        y: -200,
        opacity: 0,
        duration: 0.4,
        ease: "power2.in"
      });

      // Fade out overlay
      tl.to(successOverlayRef.current, {
        opacity: 0,
        duration: 0.3
      }, "-=0.3");
    }
  }, [showPaymentSuccess]);




  useEffect(() => {
    if (socket) {
      socket.on("payment-completed", (data) => {
        // Update UI to show payment was successful
        if (data.rideId === ride._id) {
          console.log("user sent  money")
          setShowPaymentSuccess(true)
          setPaid(true)
        }
      });
    }

    return () => {
      if (socket) {
        socket.off("payment-completed");
      }
    };
  }, [socket, ride]);

  console.log("ride", ride)

  const libraries = ['places'];

  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Load Google Maps once
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: googleMapsApiKey,
    libraries: libraries
  });

  const handlePaymentProcess = () => {
    if (ride.paymentMode === 'Card') {
      setShowPaymentModal(true);
    } else if (ride.paymentMode === 'Cash') {
      setPaid(true)
    }
  }



  return (
    <Elements stripe={stripePromise} >
      <div className='h-screen relative' >
        <Link to="/home" className='fixed right-2 top-2 h-10 w-10 bg-white flex items-center justify-center rounded-full'>
          <i className="text-lg font-medium ri-home-4-line"></i>
        </Link>
        <div className='h-[62%]'>
          <RideTracking
            rideData={ride}
            googleMapsApiKey={googleMapsApiKey}
            isLoaded={isLoaded}
          />
        </div>
        <div className='h-1/2 p-4'>
          <div className='flex items-center justify-between'>
            <img className='h-12' src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_552,w_552/v1555367310/assets/30/51e602-10bb-4e65-b122-e394d80a9c47/original/Final_UberX.png" alt="" />
            <div className='text-right'>
              <h2 className='text-lg font-medium capitalize'>{ride?.captain.fullname.firstname}</h2>
              <h4 className='text-xl font-semibold -mt-1 -mb-1'>{ride?.captain.vehicle.plate}</h4>
              <p className='text-sm text-gray-600'>Maruti Suzuki Alto</p>
            </div>
          </div>
          <div className='flex gap-2 flex-col justify-between items-center'>
            <div className='w-full mt-5'>

              <div className='flex items-center gap-5  p-3 border-b-2'>
                <i className="text-lg ri-currency-line"></i>
                <div className=''>
                  <h3 className='text-lg font-medium'>₹{ride?.fare}</h3>
                  <p className='text-sm -mt-1 text-gray-600'>{ride?.paymentMode}</p>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={() => handlePaymentProcess()}
            className={`w-full mt-5 ${Paid === true
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
              } text-white font-semibold p-2 rounded-lg`}
            disabled={Paid === true}
          >
            {Paid === true ? 'Payment Completed' : 'Make a Payment'}
          </button>
        </div>

        {/* Payment Modal */}
        {showPaymentModal && (
          <PaymentModal
            ride={ride}
            onClose={() => setShowPaymentModal(false)}
            onPaymentSuccess={handlePaymentSuccess}
          />
        )}

        {showPaymentSuccess && (
          <div
            ref={successOverlayRef}
            className='absolute top-0 bg-white bg-opacity-5 backdrop-blur-md w-full h-screen flex justify-center items-center'
          >
            <div
              ref={successContentRef}
              className='flex flex-col items-center'
            >
              <img
                src='/payement-done.png'
                className='w-24 h-24'
                alt="Payment Successful"
              />
              <h1
                className='text-xl text-green-800 drop-shadow-md mt-2'
              >
                Payment Done Successfully
              </h1>
            </div>
          </div>
        )}


      </div>

    </Elements>
  );
};

export default Riding;