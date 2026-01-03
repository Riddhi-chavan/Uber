import React, { useContext, useState, useEffect } from 'react';
import { CaptainDataContext } from "../context/CaptainContext";
import axios from 'axios';

const CaptainDetails = () => {
    const { captain, setCaptain } = useContext(CaptainDataContext);
    const [rideStats, setRideStats] = useState({
        todayRides: captain?.rideStats?.todayRides || 0,
        totalRides: captain?.rideStats?.totalRides || 0,
        todayEarnings: captain?.earningStats?.todayEarnings || 0,
        totalEarnings: captain?.earningStats?.totalEarnings || 0
    });
    const [loading, setLoading] = useState(false);

    // Fetch ride statistics when component mounts and when captain changes
    useEffect(() => {
        const fetchRideStats = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('Captaintoken') || captain?.token;

                if (!token) {
                    console.error("No authentication token found");
                    return;
                }

                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/captains/ride-stats`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                console.log("response", response.data);

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

        fetchRideStats();
    }, [captain?._id]);

    // Helper function to get profile picture URL
    const getProfilePictureUrl = () => {
        if (!captain?.profilePicture) {
            return "https://cdn-icons-png.flaticon.com/512/190/190659.png";
        }

        // If it's already a full URL (Cloudinary), use it directly
        if (captain.profilePicture.startsWith('http://') || captain.profilePicture.startsWith('https://')) {
            return captain.profilePicture;
        }

        // If it's a relative path (old local uploads), construct URL
        return `${import.meta.env.VITE_BASE_URL}/${captain.profilePicture}`;
    };

    return (
        <div>
            <div className='flex items-center justify-between'>
                <div className='flex items-center justify-start gap-3'>
                    <img 
                        className='h-10 w-10 rounded-full object-cover' 
                        src={getProfilePictureUrl()}
                        alt={`${captain?.fullname?.firstname || 'Captain'}'s profile`}
                        onError={(e) => {
                            // Fallback if image fails to load
                            e.target.src = "https://cdn-icons-png.flaticon.com/512/190/190659.png";
                        }}
                    />
                    <h4 className='text-lg font-medium capitalize'>
                        {captain?.fullname?.firstname + " " + captain?.fullname?.lastname}
                    </h4>
                </div>
                <div>
                    <h4 className='text-xl font-semibold'>
                        {loading ? '...' : `₹${(rideStats?.todayEarnings || 0).toFixed(2)}`}
                    </h4>
                    <p className='text-sm font-medium text-gray-600'>Earned</p>
                </div>
            </div>

            <div className='flex p-3 mt-8 bg-gray-100 rounded-xl justify-center gap-5 items-start'>
                <div className='text-center'>
                    <i className="text-3xl mb-2 font-thin ri-booklet-line"></i>
                    <h5 className='text-lg font-medium'>
                        {loading ? '...' : (rideStats?.todayRides || 0)}
                    </h5>
                    <p className='text-sm text-gray-600'>Rides Today</p>
                </div>
                <div className='text-center'>
                    <i className="text-3xl mb-2 font-thin ri-route-line"></i>
                    <h5 className='text-lg font-medium'>
                        {loading ? '...' : (rideStats?.totalRides || 0)}
                    </h5>
                    <p className='text-sm text-gray-600'>Total Rides</p>
                </div>
            </div>
        </div>
    );
};

export default CaptainDetails;