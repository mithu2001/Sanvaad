const socket = io('http://localhost:8080');

//Get DOM element in respective Js variables
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");

//Audio that will play on receiving messages
var audio = new Audio('ting.mp3');


//Function which will append info to the container
const append = (message, position)=>{
   const messageElement = document.createElement('div');
   messageElement.innerText = message;
   messageElement.classList.add('message');
   messageElement.classList.add(position);
   messageContainer.append(messageElement);
   if(position=='left'){
   audio.play();
   }
}


// Ask new user for his/her name and let the server know
const name = prompt("Enter Your Name to join");
socket.emit('new-user-joined',name);

//if a new user joins, receive the event from the server
socket.on('user-joined',name=>{
 append(`${name} joined the chat`,'right')
})

//if server sends a message , receive it 
socket.on('recieve',data=>{
   append(`${data.name}: ${data.message}`,'left')
})

//if a user left the chat, append the info to the container
socket.on('left',name=>{
   append(`${name} left the chat`,'right')
})

//if the form gets submitted, send server the message
form.addEventListener('submit',(e)=>{
   e.preventDefault();
   const message = messageInput.value;
   append(`You: ${message}`, 'right');
   socket.emit('send',message);
   messageInput.value = ''
})