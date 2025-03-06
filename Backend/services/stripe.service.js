const stripe = require('../config/stripe');
const rideModel = require('../models/ride.model');
const userModel = require('../models/user.model'); // Assuming you have this

class StripeService {
    async createPaymentIntent(ride) {
        try {
            // Fetch more details about the user if needed
            const user = ride.user;
            
            // Extract address components from the destination
            // This assumes destination has city, state, country information
            const addressParts = ride.destination.split(', ');
            const city = addressParts[0] || 'Unknown City';
            const state = addressParts[1] || 'Unknown State';
            const country = addressParts[2] || 'India';
            const postalCode = '400000'; // Default postal code for Mumbai region
            
            const paymentIntent = await stripe.paymentIntents.create({
                amount: ride.fare * 100, // Convert to cents
                currency: 'inr', // Changed to INR for Indian transactions
                description: `Ride payment for trip #${ride._id}`, 
                metadata: {
                    rideId: ride._id.toString(),
                    userId: ride.user._id.toString()
                },
                shipping: {
                    name: `${user.fullname.firstname} ${user.fullname.lastname || ''}`,
                    address: {
                        line1: ride.pickup || 'Address line 1',
                        city: city,
                        state: state,
                        country: 'IN', // Country code for India
                        postal_code: postalCode
                    }
                },
                receipt_email: user.email // Send receipt to user's email
            });

            // Update ride with payment intent ID
            await rideModel.findByIdAndUpdate(ride._id, {
                paymentID: paymentIntent.id
            });

            return {
                clientSecret: paymentIntent.client_secret,
                paymentIntentId: paymentIntent.id
            };
        } catch (error) {
            console.error('Stripe Payment Intent Error:', error);
            throw new Error('Failed to create payment intent: ' + error.message);
        }
    }

    async confirmPayment(rideId, paymentIntentId) {
        try {
            const ride = await rideModel.findById(rideId);
            
            if (!ride) {
                throw new Error('Ride not found');
            }

            const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

            if (paymentIntent.status === 'succeeded') {
                ride.paymentStatus = 'paid';
                ride.paymentID = paymentIntentId;
                await ride.save();

                return ride;
            } else {
                throw new Error('Payment not successful');
            }
        } catch (error) {
            console.error('Payment Confirmation Error:', error);
            throw error;
        }
    }
}

module.exports = new StripeService();