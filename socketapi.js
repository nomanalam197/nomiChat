const io = require("socket.io")();
const socketapi = {
    io: io
};
var connections = 0;
var connectionsArr = [];
var connectionsArrId = [];


io.on("connection", function (socket) {
    connections++;
    console.log(`A user connected. Total User: ${connections}`);

    
    io.emit("onlineusers", connectionsArr);

    socket.on("naam", function (data) {
        connectionsArr.push(data);
        connectionsArrId.push(socket.id);
        io.emit("onlineusers", connectionsArr);
    })

    socket.on("typing", function () {
        const username = connectionsArr[connectionsArrId.indexOf(socket.id)];
        socket.broadcast.emit("typingname", { username: username })
    })

    socket.on("eventkanaam", function (data) {
        const userName = connectionsArr[connectionsArrId.indexOf(socket.id)];

        socket.broadcast.emit("eventkanaam", { userName: userName, msg: data });
    })



    socket.on("disconnect", function () {
        connections--;
        console.log(`A user disconnected. Total: + ${connections}`);
        let indexofdisconnecteduser = connectionsArrId.indexOf(socket.id);
        connectionsArr.splice(indexofdisconnecteduser, 1);
        connectionsArrId.splice(indexofdisconnecteduser, 1);
        io.emit("onlineusers", connectionsArr);
        
    })

});


module.exports = socketapi;