# Uber Clone — Full-Stack Ride-Hailing Application

A production-ready, real-time ride-hailing platform built from scratch that replicates the core Uber experience with dual user roles, live GPS tracking, and integrated payments.

# 🚗 Uber Clone

## Overview
A full-stack ride-hailing application that supports two distinct user roles — Riders and Drivers (Captains). The platform features real-time ride matching, live GPS tracking, dynamic fare calculation, OTP-based ride verification, and dual payment support (Cash & Card via Stripe). Built with the MERN stack and deployed on Render and Netlify.

## Table of Contents
- [About the Project](#about-the-project)
  - [Features](#features)
  - [Demo](#demo)
  - [Live Demo](#live-demo)
  - [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
    - [Clone Project](#clone-project)
    - [Backend Setup](#backend-setup)
    - [Frontend Setup](#frontend-setup)
  - [Configuration](#configuration)
- [Usage](#usage)
- [Deployment](#deployment)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Future Enhancements](#future-enhancements)
- [Troubleshooting](#troubleshooting)
- [Contact](#contact)


## About the Project

### Features
* **Dual Authentication**: Separate signup and login flows for Riders and Captains with JWT-based auth and token blacklisting
* **Real-Time Ride Matching**: Instant ride broadcasting to captains within a 2km radius using Socket.IO and MongoDB geo-spatial queries
* **Live GPS Tracking**: Real-time map with moving captain marker, pickup/destination pins, and driving directions polyline
* **Google Maps Integration**: Places Autocomplete, Geocoding, Distance Matrix, and Maps JS API
* **Dynamic Fare Calculation**: Server-side pricing based on base fare + per-km + per-minute rates for Car, Auto, and Moto
* **OTP Verification**: Cryptographically secure 6-digit OTP ensures only the right passenger is picked up
* **Dual Payment System**: Cash payment and Stripe Card payment with real-time socket notifications on completion
* **Profile Picture Management**: Cloudinary upload for both users and captains with automatic cleanup on failure
* **Captain Dashboard**: Daily and all-time ride counts and earnings statistics
* **Responsive Design**: Mobile-first bottom sheets that transform into desktop sidebars at `md` breakpoint
* **GSAP Animations**: Smooth panel transitions, success overlays, and bounce effects

### Screenshots

## User Interface

![](https://github.com/user-attachments/assets/3bf62e2c-32f3-44c4-abbc-5663bf0af6ce)

![](https://github.com/user-attachments/assets/54bb1c70-20d3-48d6-9dcc-f53df786aaf4)

![](https://github.com/user-attachments/assets/8be6ec1a-25d2-47cf-b5fb-e1434c19d52c)

![](https://github.com/user-attachments/assets/008a959f-5329-4fe1-9d14-306c9df7813e)

![](https://github.com/user-attachments/assets/f4d792e2-5c93-4d49-a6d2-e84185019cc3)

![](https://github.com/user-attachments/assets/5b3bed85-6f62-4bc7-86e9-58e3f030c92d)

![](https://github.com/user-attachments/assets/c1c4695c-7217-4c8a-8c93-109f7eabd412)

![](https://github.com/user-attachments/assets/76e1bf22-61c6-48cd-9d31-1d2d21079738)

![](https://github.com/user-attachments/assets/aa4d824e-895e-46ca-be5f-3896995d87b9)

## Captain Interface

![](https://github.com/user-attachments/assets/01ca17d5-895b-4586-8f4d-10ee3e72e14d)

![](https://github.com/user-attachments/assets/7892cab2-ac36-4794-baa7-bcf8df7f5213)

![](https://github.com/user-attachments/assets/25d8f7a7-f815-44d9-80a1-0e7dcc65ec42)

![](https://github.com/user-attachments/assets/ebf12ddc-3024-4dfe-9957-00df28317d5f)

![](https://github.com/user-attachments/assets/9a2394f5-dfe6-4536-9d0f-5df624713dde)


### Demo
https://github.com/user-attachments/assets/2a9ee4f8-3b5b-4fd4-bcad-885f10f6f320

### Live Demo
**[Click here for live demo](https://vermillion-frangipane-2e08b1.netlify.app/)**

### Tech Stack

**Frontend**
* **React 18**: Component-based UI framework
* **Vite**: Lightning-fast build tool & dev server
* **React Router v7**: Client-side routing & navigation
* **TailwindCSS 3**: Utility-first CSS styling
* **GSAP**: Smooth, performant animations (panels, overlays, success toasts)
* **@react-google-maps/api**: Live maps, markers, directions, autocomplete
* **@stripe/react-stripe-js**: Secure card payment forms
* **Socket.IO Client**: Real-time bidirectional communication
* **Axios**: HTTP API client
* **React Toastify**: Toast notifications

**Backend**
* **Node.js + Express.js**: REST API server
* **MongoDB + Mongoose**: NoSQL database & ODM
* **Socket.IO**: WebSocket server for real-time events
* **JWT (jsonwebtoken)**: Stateless authentication & authorization
* **bcrypt**: Password hashing (10 rounds)
* **Cloudinary + Multer**: Image upload & CDN storage for profile pictures
* **Stripe SDK**: Server-side payment processing
* **Google Maps APIs**: Geocoding, Distance Matrix, Places Autocomplete
* **express-validator**: Request validation middleware
* **cookie-parser**: Cookie-based token handling

**Deployment**
* **Netlify**: Frontend static site hosting with SPA redirects (`_redirects`)
* **Render**: Backend Node.js server hosting
* **MongoDB Atlas**: Cloud-hosted database
* **Cloudinary**: Cloud-based image storage & CDN

## Getting Started

### Prerequisites
* **Node.js**: Install Node.js from [here](https://nodejs.org/)
* **MongoDB Atlas Account**: Set up a MongoDB database [here](https://www.mongodb.com/cloud/atlas)
* **Cloudinary Account**: Sign up for Cloudinary [here](https://cloudinary.com/)
* **Google Cloud Account**: Enable Maps APIs [here](https://console.cloud.google.com/)
* **Stripe Account**: Sign up for Stripe [here](https://stripe.com/)

### Installation

#### Clone Project
```bash
git clone https://github.com/your-username/uber-clone.git
cd uber-clone
```

#### Backend Setup

1. Navigate to the backend directory:
```bash
cd Backend
```

2. Install the dependencies:
```bash
npm install
```

3. Set up environment variables:
   * Create a `.env` file in the Backend directory and add the following:
```env
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret-key
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
STRIPE_SECRET_KEY=your-stripe-secret-key
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
PORT=3000
```

4. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:3000`

#### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd ../frontend
```

2. Install the dependencies:
```bash
npm install
```

3. Set up environment variables:
   * Create a `.env` file in the frontend directory and add the following:
```env
VITE_API_URL=http://localhost:3000
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
VITE_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
```

4. Start the frontend development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

### Configuration

#### MongoDB Setup
1. Create a MongoDB Atlas cluster
2. Whitelist your IP address (or use `0.0.0.0/0` for development)
3. Create a database user with read/write permissions
4. Get your connection string and add it to `MONGO_URI` in your `.env` file

#### Cloudinary Setup
1. Sign up for a Cloudinary account
2. Navigate to your dashboard
3. Copy your Cloud Name, API Key, and API Secret
4. Add these credentials to your backend `.env` file

#### Google Maps Setup
1. Create a project in Google Cloud Console
2. Enable these 4 APIs: Maps JavaScript API, Geocoding API, Distance Matrix API, Places API
3. Create an API key and add it to both `.env` files

#### Stripe Setup
1. Sign up for a Stripe account
2. Copy your Secret Key (backend) and Publishable Key (frontend) from the Stripe dashboard
3. Add them to the respective `.env` files

#### JWT Secret
Generate a secure random string for your JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Usage
* Open `http://localhost:5173` to view the app in the browser
* **Sign Up as Rider**: Create a rider account with email, password, and profile picture
* **Sign Up as Captain**: Register as a driver with vehicle details (type, color, plate, capacity)
* **Book a Ride**: Enter pickup and destination, select vehicle type and payment method, confirm ride
* **Accept a Ride (Captain)**: Receive ride notifications in real time, accept and navigate to pickup
* **OTP Verification**: Captain enters the 6-digit OTP shown to the rider to start the ride
* **Live Tracking**: Both rider and captain see a live map with GPS position updates
* **Make Payment**: Pay via Cash or Card (Stripe) on ride completion
* **View Stats (Captain)**: Check today's and all-time ride counts and earnings on the dashboard

## Deployment

### Backend (Render)
1. Push your code to GitHub
2. Create a new Web Service on Render
3. Connect your GitHub repository
4. Set Root Directory to `Backend`
5. Add all environment variables
6. Deploy!

### Frontend (Netlify)
1. Add a `_redirects` file to your `public` folder:
   ```
   /* /index.html 200
   ```
2. Build your frontend: `npm run build`
3. Deploy the `dist` folder to Netlify
4. Add `VITE_API_URL`, `VITE_GOOGLE_MAPS_API_KEY`, and `VITE_STRIPE_PUBLISHABLE_KEY` as environment variables
5. Configure build settings:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`

## API Endpoints

### User Routes (`/users`)
* `POST /users/register` - Register new rider with profile picture
* `POST /users/login` - Login & get JWT token
* `GET /users/profile` - Get rider profile *(Auth required)*
* `GET /users/logout` - Logout & blacklist token *(Auth required)*
* `PUT /users/update-profile-picture` - Update profile picture *(Auth required)*

### Captain Routes (`/captains`)
* `POST /captains/register` - Register captain with vehicle details
* `POST /captains/login` - Login & get JWT token
* `GET /captains/profile` - Get captain profile *(Auth required)*
* `GET /captains/logout` - Logout & blacklist token *(Auth required)*
* `GET /captains/ride-stats` - Get ride & earnings statistics *(Auth required)*
* `PUT /captains/update-profile-picture` - Update profile picture *(Auth required)*

### Ride Routes (`/rides`)
* `POST /rides/create` - Create a new ride *(User auth required)*
* `GET /rides/get-fare` - Get fare estimate for all vehicle types *(User auth required)*
* `POST /rides/confirm-ride` - Accept a ride *(Captain auth required)*
* `GET /rides/start-ride` - Start ride with OTP verification *(Captain auth required)*
* `POST /rides/end-ride` - Complete the ride *(Captain auth required)*
* `POST /rides/create-payment-intent` - Create Stripe PaymentIntent *(User auth required)*
* `POST /rides/confirm-payment` - Confirm payment — Cash or Card *(User auth required)*

### Map Routes (`/maps`)
* `GET /maps/get-coordinates` - Geocode address to coordinates *(User auth required)*
* `GET /maps/get-distance-time` - Get distance & duration between two points *(User auth required)*
* `GET /maps/get-suggestion` - Get Places Autocomplete suggestions *(User auth required)*

## Project Structure
```
Uber/
├── Backend/
│   ├── config/
│   │   ├── cloudinary.js
│   │   └── stripe.js
│   ├── controllers/
│   │   ├── user.controller.js
│   │   ├── captain.controller.js
│   │   ├── ride.controller.js
│   │   └── map.controller.js
│   ├── db/
│   │   └── db.js
│   ├── middlewares/
│   │   └── auth.middleware.js
│   ├── models/
│   │   ├── user.model.js
│   │   ├── captain.model.js
│   │   ├── ride.model.js
│   │   └── blacklistToken.model.js
│   ├── routes/
│   │   ├── user.routes.js
│   │   ├── captain.routes.js
│   │   ├── ride.routes.js
│   │   └── maps.routes.js
│   ├── services/
│   │   ├── user.service.js
│   │   ├── captain.service.js
│   │   ├── ride.service.js
│   │   ├── maps.service.js
│   │   └── stripe.service.js
│   ├── socket.js
│   ├── app.js
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── LiveTracking.jsx
│   │   │   ├── RideTracking.jsx
│   │   │   ├── LocationSearchPanel.jsx
│   │   │   ├── VehiclePanel.jsx
│   │   │   ├── ConfirmRide.jsx
│   │   │   ├── LookingForDriver.jsx
│   │   │   ├── WaitingForDriver.jsx
│   │   │   ├── RidePopUp.jsx
│   │   │   ├── ConfirmRidePopUp.jsx
│   │   │   ├── FinishRide.jsx
│   │   │   └── CaptainDetails.jsx
│   │   ├── context/
│   │   │   ├── UserContext.jsx
│   │   │   ├── CaptainContext.jsx
│   │   │   └── SocketContext.jsx
│   │   ├── pages/
│   │   │   ├── Start.jsx
│   │   │   ├── UserLogin.jsx
│   │   │   ├── UserSignup.jsx
│   │   │   ├── UserLogout.jsx
│   │   │   ├── UserProtectedWrapper.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Riding.jsx
│   │   │   ├── CaptainLogin.jsx
│   │   │   ├── CaptainSignup.jsx
│   │   │   ├── CaptainLogout.jsx
│   │   │   ├── CaptainProtectedWrapper.jsx
│   │   │   ├── CaptainHome.jsx
│   │   │   └── CaptainRiding.jsx
│   │   ├── assets/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── public/
│       └── _redirects
└── README.md
```

## Features in Detail

### Real-Time Ride Matching
The application uses Socket.IO and MongoDB geo-spatial queries to match riders with nearby captains:
- New ride events are broadcast to all captains within a **2km radius** of the pickup point using `$geoWithin` with `$centerSphere`
- Captain socket IDs are stored in MongoDB and updated on every connection
- The full ride lifecycle — accept, start, end, payment — is communicated via dedicated socket events

### Fare Calculation
Fares are calculated server-side using Google's Distance Matrix API so the client never controls pricing:

| Vehicle | Base Fare (₹) | Per KM (₹) | Per Minute (₹) |
|---------|--------------|------------|----------------|
| 🏍️ Moto | 20 | 8 | 1.5 |
| 🛺 Auto | 30 | 10 | 2 |
| 🚗 Car | 50 | 15 | 3 |

### Security Features
- Passwords are hashed using bcrypt with 10 salt rounds
- JWT tokens stored in HTTP-only cookies with 24-hour expiry
- Revoked tokens stored in MongoDB with a **TTL index** for automatic 24h cleanup
- Separate `authUser` and `authCaptain` middleware for dual role protection
- Input validation on all routes via `express-validator`
- `select: false` on password fields in Mongoose schemas

## Future Enhancements
- [ ] Ride history page for users and captains
- [ ] Driver rating & review system
- [ ] Scheduled rides (book in advance)
- [ ] Surge pricing during peak hours
- [ ] Multiple stops / waypoints
- [ ] Push notifications (PWA)
- [ ] In-app chat between rider and captain
- [ ] Admin dashboard for platform monitoring
- [ ] Fare splitting between multiple riders
- [ ] Dark mode

## Troubleshooting

### Common Issues

**Backend not connecting to MongoDB:**
- Verify your MongoDB connection string in `.env`
- Check if your IP is whitelisted in MongoDB Atlas
- Ensure the database user has read/write permissions

**Google Maps not loading:**
- Verify all 4 APIs are enabled in Google Cloud Console (Maps JS, Geocoding, Distance Matrix, Places)
- Check that your API key restrictions allow your domain
- Ensure `VITE_GOOGLE_MAPS_API_KEY` is set in the frontend `.env`

**Socket.IO not connecting:**
- Verify `FRONTEND_URL` is set correctly in the backend `.env`
- Check that CORS is configured for both Express and Socket.IO
- Ensure `withCredentials: true` is set in the Socket.IO client config

**Stripe payment failing:**
- Verify `STRIPE_SECRET_KEY` (backend) and `VITE_STRIPE_PUBLISHABLE_KEY` (frontend) are set
- Use Stripe test card `4242 4242 4242 4242` in development
- Check the Stripe dashboard for detailed error logs

**Profile picture not uploading:**
- Verify Cloudinary credentials in backend `.env`
- Check file size limits in Multer configuration
- Ensure the Cloudinary folder permissions are set correctly

## Contact
**Email**: [your-email@gmail.com](mailto:your-email@gmail.com)  
**Project Link**: [https://github.com/your-username/uber-clone](https://github.com/your-username/uber-clone)  
**Live Demo**: [https://your-netlify-url.netlify.app](https://your-netlify-url.netlify.app)

---

Thank you for checking out my project! If you have any suggestions or find issues, feel free to open an issue or submit a pull request. Your feedback is highly appreciated!
