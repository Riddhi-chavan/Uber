const socketIo = require('socket.io');
const userModel = require('./models/user.model');
const captainModel = require('./models/captain.model');

let io;
function initializeSocket(server) {
    io = socketIo(server , {
        cors : {
        origin: "*" ,
        methods: ["GET", "POST"]
    }
    });

    io.on('connection', (socket) => {
        console.log(`New client connected: ${socket.id}`);

        socket.on('join', async (data) => {
            const {userId , userType} = data;

            console.log(`User joined: ${userId} as ${userType}`);

            if(userType === 'user'){
                console.log("Captain updated on database");
                await userModel.findByIdAndUpdate(userId , { socketId : socket.id});
            }else if(userType === 'captain'){
                await captainModel.findByIdAndUpdate(userId , { socketId : socket.id});
                
            }
        });

        socket.on('update-location-captain' , async (data) => {
          const {userId , location} = data;
          if (!location || !location.ltd || !location.lng) {
            return socket.emit('error', { message: 'Location is required' });   
          }
          await captainModel.findByIdAndUpdate(userId , {location : {
                ltd : location.ltd,
                lng : location.lng
          }});

        })


        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        }); 

    });

}

function sendMessageToSocketId(socketId, messageObject) {
   if(io){
         io.to(socketId).emit(messageObject.event, messageObject.data);
   }else {
         console.log('Socket not initialized');
   }
}  


module.exports = { initializeSocket, sendMessageToSocketId };