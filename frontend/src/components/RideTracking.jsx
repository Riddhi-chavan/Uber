import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    GoogleMap,
    Marker,
    DirectionsService,
    DirectionsRenderer,
    InfoWindow
} from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '100%',
};
const defaultCenter = {
    lat: 18.9801532,
    lng: 73.1002789
};

// Helper function to convert address strings to coordinates using Geocoding API
const geocodeAddress = async (address, googleMapsApiKey) => {
    try {
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
                address
            )}&key=${googleMapsApiKey}`
        );
        const data = await response.json();

        if (data.status === 'OK' && data.results.length > 0) {
            const { lat, lng } = data.results[0].geometry.location;
            return { lat, lng };
        }
        throw new Error('Geocoding failed');
    } catch (error) {
        console.error('Error geocoding address:', error);
        return null;
    }
};

const RideTracking = ({ rideData, googleMapsApiKey, isLoaded }) => {
    // Extract ride information
    const {
        pickup: pickupAddress,
        destination: destinationAddress,
        captain,
        user,
        status: rideStatus,
        otp,
        fare
    } = rideData;

    console.log("googleMapsApiKey", googleMapsApiKey);

    // State for locations
    const [pickupLocation, setPickupLocation] = useState(null);
    const [destinationLocation, setDestinationLocation] = useState(null);
    const [captainLocation, setCaptainLocation] = useState(
        captain?.location ? { lat: captain.location.lat, lng: captain.location.lng } : null
    );
    const [userLocation, setUserLocation] = useState(null);

    // Route and UI states
    const [directions, setDirections] = useState(null);
    const [distance, setDistance] = useState('');
    const [duration, setDuration] = useState('');
    const [showInfoWindow, setShowInfoWindow] = useState(false);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [mapCenter, setMapCenter] = useState(captainLocation || defaultCenter);
    const [directionsRequested, setDirectionsRequested] = useState(false);
    const [rideStarted, setRideStarted] = useState(rideStatus === 'started');

    // References
    const mapRef = useRef(null);
    const directionsServiceRef = useRef(null);

    // Geocode pickup and destination addresses to get coordinates
    useEffect(() => {
        const geocodeLocations = async () => {
            if (pickupAddress && !pickupLocation) {
                const pickupCoords = await geocodeAddress(pickupAddress, googleMapsApiKey);
                if (pickupCoords) {
                    setPickupLocation(pickupCoords);
                    if (!captainLocation) {
                        setMapCenter(pickupCoords);
                    }
                }
            }

            if (destinationAddress && !destinationLocation) {
                const destCoords = await geocodeAddress(destinationAddress, googleMapsApiKey);
                if (destCoords) {
                    setDestinationLocation(destCoords);
                }
            }
        };

        if (isLoaded) {
            geocodeLocations();
        }
    }, [pickupAddress, destinationAddress, googleMapsApiKey, pickupLocation, destinationLocation, captainLocation, isLoaded]);

    // Simulate user location for demo purposes (use real data in production)
    useEffect(() => {
        // If no user location yet, use pickup location if available
        if (!userLocation && pickupLocation) {
            setUserLocation(pickupLocation);
        }
    }, [userLocation, pickupLocation]);

    useEffect(() => {
        // In real application, you would use WebSocket or polling to get captain's location
        // For the demo, we'll simulate captain movement
        if (!captainLocation && pickupLocation) {
            setCaptainLocation({
                lat: pickupLocation.lat - 0.003,
                lng: pickupLocation.lng - 0.003
            });
        }

        // Simulate captain movement
        const captainMovementInterval = setInterval(() => {
            if (captainLocation && pickupLocation && !rideStarted) {
                // Move captain toward pickup
                setCaptainLocation(prev => ({
                    lat: prev.lat + (pickupLocation.lat - prev.lat) * 0.1,
                    lng: prev.lng + (pickupLocation.lng - prev.lng) * 0.1
                }));
            } else if (captainLocation && destinationLocation && rideStarted) {
                // Move captain toward destination
                setCaptainLocation(prev => ({
                    lat: prev.lat + (destinationLocation.lat - prev.lat) * 0.02,
                    lng: prev.lng + (destinationLocation.lng - prev.lng) * 0.02
                }));
            }
        }, 3000);

        return () => clearInterval(captainMovementInterval);
    }, [captainLocation, pickupLocation, destinationLocation, rideStarted]);

    // Center map on captain location
    useEffect(() => {
        if (captainLocation) {
            setMapCenter(captainLocation);
        }
    }, [captainLocation]);

    // Request directions when both pickup and destination locations are available
    useEffect(() => {
        if (pickupLocation && destinationLocation && !directionsRequested && isLoaded) {
            setDirectionsRequested(true);
        }
    }, [pickupLocation, destinationLocation, directionsRequested, isLoaded]);

    // Callback for handling directions response
    const directionsCallback = useCallback((response) => {
        if (response !== null && response.status === 'OK') {
            setDirections(response);

            // Extract distance and duration information
            const route = response.routes[0];
            if (route && route.legs && route.legs[0]) {
                setDistance(route.legs[0].distance.text);
                setDuration(route.legs[0].duration.text);
            }
        } else {
            console.error('Directions request failed:', response);
        }
    }, []);

    // Handle marker click to show info window
    const handleMarkerClick = (markerType) => {
        setSelectedMarker(markerType);
        setShowInfoWindow(true);
    };

    // Close info window
    const handleInfoWindowClose = () => {
        setShowInfoWindow(false);
        setSelectedMarker(null);
    };

    // Start ride function (would connect to your backend in a real app)
    const startRide = () => {
        setRideStarted(true);
        // In a real app, you would update your backend via API call
        // e.g., axios.put('/api/rides/' + rideData._id, { status: 'started' })
    };

    // Helper to render info window content based on selected marker
    const renderInfoWindowContent = () => {
        switch (selectedMarker) {
            case 'pickup':
                return (
                    <div className="p-2">
                        <h3 className="font-bold text-lg">Pickup Location</h3>
                        <p>{pickupAddress}</p>
                        <p className="mt-2">{distance && duration ? `${distance} - ${duration}` : ''}</p>
                        {otp && <p className="mt-2 font-bold">OTP: {otp}</p>}
                    </div>
                );
            case 'destination':
                return (
                    <div className="p-2">
                        <h3 className="font-bold text-lg">Destination</h3>
                        <p>{destinationAddress}</p>
                        <p className="mt-2">Fare: ₹{fare}</p>
                    </div>
                );
            case 'captain':
                return (
                    <div className="p-2">
                        <h3 className="font-bold text-lg">Captain</h3>
                        <p>{captain?.fullname?.firstname} {captain?.fullname?.lastname}</p>
                        <p className="mt-1">{captain?.vehicle?.vehicleType} - {captain?.vehicle?.plate}</p>
                        <p>{captain?.vehicle?.color}</p>
                    </div>
                );
            case 'user':
                return (
                    <div className="p-2">
                        <h3 className="font-bold text-lg">Passenger</h3>
                        <p>{user?.fullname?.firstname} {user?.fullname?.lastname}</p>
                    </div>
                );
            default:
                return null;
        }
    };

    // If Google Maps hasn't loaded yet, show loading message
    if (!isLoaded) {
        return <div className="flex items-center justify-center h-full">Loading Google Maps...</div>;
    }

    // If locations aren't loaded yet, show loading
    if (!pickupLocation || !destinationLocation) {
        return <div className="flex items-center justify-center h-full">Loading map locations...</div>;
    }

    return (
        <div className="relative w-full h-full">
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={mapCenter}
                zoom={14}
                onLoad={map => { mapRef.current = map; }}
            >
                {/* Pickup Marker */}
                {pickupLocation && (
                    <Marker
                        position={pickupLocation}
                        icon={{
                            url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
                        }}
                        onClick={() => handleMarkerClick('pickup')}
                    />
                )}

                {/* Destination Marker */}
                {destinationLocation && (
                    <Marker
                        position={destinationLocation}
                        icon={{
                            url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
                        }}
                        onClick={() => handleMarkerClick('destination')}
                    />
                )}

                {/* Captain Position Marker */}
                {captainLocation && (
                    <Marker
                        position={captainLocation}
                        icon={{
                            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                        }}
                        onClick={() => handleMarkerClick('captain')}
                    />
                )}

                {/* User Position Marker */}
                {userLocation && (
                    <Marker
                        position={userLocation}
                        icon={{
                            url: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
                        }}
                        onClick={() => handleMarkerClick('user')}
                    />
                )}

                {/* Info Window */}
                {showInfoWindow && selectedMarker && (
                    <InfoWindow
                        position={
                            selectedMarker === 'pickup' ? pickupLocation :
                                selectedMarker === 'destination' ? destinationLocation :
                                    selectedMarker === 'captain' ? captainLocation :
                                        userLocation
                        }
                        onCloseClick={handleInfoWindowClose}
                    >
                        <div>{renderInfoWindowContent()}</div>
                    </InfoWindow>
                )}

                {/* Request for directions */}
                {directionsRequested && !directions && pickupLocation && destinationLocation && (
                    <DirectionsService
                        options={{
                            origin: pickupLocation,
                            destination: destinationLocation,
                            travelMode: 'DRIVING',
                        }}
                        callback={directionsCallback}
                        onLoad={directionsService => { directionsServiceRef.current = directionsService; }}
                    />
                )}

                {/* Render directions on map */}
                {directions && (
                    <DirectionsRenderer
                        options={{
                            directions: directions,
                            polylineOptions: {
                                strokeColor: '#4285F4',
                                strokeWeight: 6,
                                strokeOpacity: 0.8,
                            },
                            suppressMarkers: true,
                        }}
                    />
                )}
            </GoogleMap>

            {/* Ride controls and info panel */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <div className="bg-white p-4 rounded shadow max-w-sm w-full mx-4">
                    <div className="flex justify-between items-center mb-3">
                        <p className="font-bold">
                            {rideStarted ? 'Ride in Progress' : 'Ride Accepted'}
                        </p>
                        {!rideStarted && rideStatus === 'accepted' && (
                            <button
                                onClick={startRide}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm"
                            >
                                Start Ride
                            </button>
                        )}
                    </div>

                    <div className="text-sm">
                        <div className="flex mb-1">
                            <div className="w-6">
                                <div className="w-3 h-3 rounded-full bg-green-500 mt-1"></div>
                            </div>
                            <div className="flex-1 truncate">{pickupAddress}</div>
                        </div>
                        <div className="flex">
                            <div className="w-6">
                                <div className="w-3 h-3 rounded-full bg-red-500 mt-1"></div>
                            </div>
                            <div className="flex-1 truncate">{destinationAddress}</div>
                        </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between text-sm">
                        <div>Distance: <span className="font-semibold">{distance || '...'}</span></div>
                        <div>ETA: <span className="font-semibold">{duration || '...'}</span></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RideTracking;