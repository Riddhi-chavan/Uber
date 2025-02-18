import React, { createContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

export const SocketContext = createContext();

const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io(`${import.meta.env.VITE_BASE_URL}`); // Replace with your server URL
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Connected to socket server');
        });

        newSocket.on('disconnect', () => {
            console.log('Disconnected from socket server');
        });

        return () => {
            newSocket.close();
        };
    }, []);

    const sendMessage = (eventName, message) => {
        if (socket) {
            socket.emit(eventName, message);
        }
    };

    const receiveMessage = (eventName, callback) => {
        if (socket) {
            socket.on(eventName, callback);
        }
    };

    return (
        <SocketContext.Provider value={{ socket  }}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;
