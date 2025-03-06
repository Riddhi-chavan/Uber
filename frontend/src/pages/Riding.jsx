import React, { useState, useEffect, useContext } from 'react'
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

// Stripe publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PaymentModal = ({ ride, onClose, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
    // Additional logic if needed
  };

  return (
    <Elements stripe={stripePromise}>
      <div className='h-screen'>
        <Link to="/home" className='fixed right-2 top-2 h-10 w-10 bg-white flex items-center justify-center rounded-full'>
          <i className="text-lg font-medium ri-home-4-line"></i>
        </Link>
        <div className='h-1/2'>
          <LiveTracking />
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
              <div className='flex items-center gap-5 border-b-2 p-3'>
                <i className=" text-lg ri-map-pin-2-fill"></i>
                <div className=''>
                  <h3 className='text-lg font-medium'>562/11-A</h3>
                  <p className='text-sm -mt-1 text-gray-600'>{ride?.destination}</p>
                </div>
              </div>
              <div className='flex items-center gap-5  p-3'>
                <i className="text-lg ri-currency-line"></i>
                <div className=''>
                  <h3 className='text-lg font-medium'>₹{ride?.fare}</h3>
                  <p className='text-sm -mt-1 text-gray-600'>Cash Cash</p>
                </div>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setShowPaymentModal(true)}
            className='w-full mt-5 bg-green-600 text-white font-semibold p-2 rounded-lg'
          >
            Make a Payment
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
      </div>
    </Elements>
  );
};

export default Riding;