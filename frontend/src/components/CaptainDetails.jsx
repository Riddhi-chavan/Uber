import React, { useContext, useState, useEffect } from 'react';
import { CaptainDataContext } from "../context/CaptainContext";
import { SocketContext } from '../context/SocketContext';
import axios from 'axios';

const CaptainDetails = () => {
    const { captain, setCaptain } = useContext(CaptainDataContext);
    const { socket } = useContext(SocketContext);
    const [rideStats, setRideStats] = useState({
        todayRides: 0,
        totalRides: 0,
        todayEarnings: 0,
        totalEarnings: 0
    });
    const [loading, setLoading] = useState(false);

    const fetchRideStats = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('Captaintoken') || captain?.token;

            if (!token) {
                console.error("No authentication token found");
                return;
            }

            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/captains/ride-stats`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data) {
                setRideStats(response.data);

                if (setCaptain && captain) {
                    setCaptain({
                        ...captain,
                        rideStats: {
                            ...captain.rideStats,
                            todayRides: response.data.todayRides,
                            totalRides: response.data.totalRides
                        },
                        earningStats: {
                            ...captain.earningStats,
                            todayEarnings: response.data.todayEarnings,
                            totalEarnings: response.data.totalEarnings
                        }
                    });
                }
            }
        } catch (error) {
            console.error("Error fetching ride stats:", error.response ? error.response.data : error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRideStats();
    }, [captain?._id]);

    useEffect(() => {
        if (socket) {
            socket.on('ride-completed', () => fetchRideStats());
            return () => socket.off('ride-completed');
        }
    }, [socket]);

    const getProfilePictureUrl = () => {
        if (!captain?.profilePicture) {
            return "https://cdn-icons-png.flaticon.com/512/190/190659.png";
        }
        if (captain.profilePicture.startsWith('http://') || captain.profilePicture.startsWith('https://')) {
            return captain.profilePicture;
        }
        return `${import.meta.env.VITE_BASE_URL}/${captain.profilePicture}`;
    };

    return (
        <div className="space-y-6">
            {/* Captain Profile */}
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-4'>
                    <div className='relative'>
                        <img
                            className='w-14 h-14 rounded-full object-cover ring-2 ring-gray-100'
                            src={getProfilePictureUrl()}
                            alt={`${captain?.fullname?.firstname || 'Captain'}'s profile`}
                            onError={(e) => {
                                e.target.src = "https://cdn-icons-png.flaticon.com/512/190/190659.png";
                            }}
                        />
                        <div className='absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white'></div>
                    </div>
                    <div>
                        <h4 className='text-lg font-semibold text-gray-900 capitalize'>
                            {captain?.fullname?.firstname} {captain?.fullname?.lastname}
                        </h4>
                        <p className='text-sm text-gray-500'>Online</p>
                    </div>
                </div>
                <div className='text-right'>
                    <p className='text-sm text-gray-500'>Today's Earnings</p>
                    <h4 className='text-2xl font-bold text-gray-900'>
                        {loading ? (
                            <span className='inline-block w-20 h-6 bg-gray-200 rounded animate-pulse'></span>
                        ) : (
                            `₹${(rideStats?.todayEarnings || 0).toFixed(0)}`
                        )}
                    </h4>
                </div>
            </div>

            {/* Stats Cards */}
            <div className='grid grid-cols-2 gap-4'>
                <div className='stat-card'>
                    <div className='w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3'>
                        <i className="ri-route-line text-2xl text-blue-600"></i>
                    </div>
                    <h5 className='stat-value'>
                        {loading ? (
                            <span className='inline-block w-8 h-6 bg-gray-200 rounded animate-pulse'></span>
                        ) : (
                            rideStats?.todayRides || 0
                        )}
                    </h5>
                    <p className='stat-label'>Rides Today</p>
                </div>

                <div className='stat-card'>
                    <div className='w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3'>
                        <i className="ri-taxi-line text-2xl text-purple-600"></i>
                    </div>
                    <h5 className='stat-value'>
                        {loading ? (
                            <span className='inline-block w-8 h-6 bg-gray-200 rounded animate-pulse'></span>
                        ) : (
                            rideStats?.totalRides || 0
                        )}
                    </h5>
                    <p className='stat-label'>Total Rides</p>
                </div>
            </div>
        </div>
    );
};

export default CaptainDetails;