import React, { useEffect } from 'react'
import axios from "axios"
import { useNavigate } from 'react-router-dom'

const UserLogout = () => {
    const token = localStorage.getItem("token")
    const navigate = useNavigate()

    // useEffect(() => {
    //     axios.get(`${import.meta.env.VITE_BASE_URL}/users/logout` , {
    //         headers : {
    //             Authorization : `Bearer ${token}`
    //         }
    //     }).then((response) =>{
    //         if(response.status === 200){
    //             localStorage.removeItem('token')
    //             console.log("navigating")
    //             navigate("/login")
    //         }
    //     })
    // } , [navigate])

    axios.get(`${import.meta.env.VITE_API_URL}/users/logout`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then((response) => {
        if (response.status === 200) {
            localStorage.removeItem('token')
            navigate('/login')
        }
    })
    
  return (
    <div>UserLogout</div>
  )
}

export default UserLogout
