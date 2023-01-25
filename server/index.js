
const io = require('socket.io')(8080, { cors: { origin: '*' } });

const users = {};

//io.on listen all user event but socket.on listen only a particular user events

//if any new users joins, let other users connected to the server know!
io.on('connection',socket=>{
    socket.on('new-user-joined', name=>{
        console.log("new user joined",name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined',name);
    });

    //if someone sends a message , broacast it to other people
    socket.on('send',message => {
        socket.broadcast.emit('recieve',{message:message, name:users[socket.id]});
    });

    //if someone laeves the chat , let others know
    //here disconnect is built-in event  but above new-usr-joined, user-joined and recieve are not built-in event

    socket.on('disconnect',message => {
        socket.broadcast.emit('left',users[socket.id]);
        delete users[socket.id];
    });

})