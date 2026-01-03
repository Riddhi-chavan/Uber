import React, { useState, useEffect } from 'react';
import { useLoadScript, GoogleMap, Marker } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '100%',
};

const center = {
    lat: -3.745,
    lng: -38.523
};

const LiveTracking = () => {
    const [currentPosition, setCurrentPosition] = useState(center);
    
    // Load Google Maps script
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    });

    useEffect(() => {
        // Get initial position
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                console.log('Initial position:', latitude, longitude);
                setCurrentPosition({
                    lat: latitude,
                    lng: longitude
                });
            },
            (error) => {
                console.error('Error getting location:', error);
            },
            { enableHighAccuracy: true }
        );

        // Watch position for real-time updates
        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                console.log('Position updated:', latitude, longitude);
                setCurrentPosition({
                    lat: latitude,
                    lng: longitude
                });
            },
            (error) => {
                console.error('Error watching location:', error);
            },
            { 
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    // Handle loading state
    if (loadError) {
        return <div className="flex items-center justify-center h-full">Error loading maps</div>;
    }

    if (!isLoaded) {
        return <div className="flex items-center justify-center h-full">Loading Maps...</div>;
    }

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={currentPosition}
            zoom={15}
        >
            <Marker position={currentPosition} />
        </GoogleMap>
    );
};

export default LiveTracking;