const socket = io()

let user;
const input = document.getElementById('message');
const messageList = document.getElementById('list-message');
const messageListContainer = document.querySelector('.messageListContainer');

Swal.fire({
    title: "Identificate",
    input: "text",
    text: "Ingresa el usuario para identificarte en el chat",
    inputValidator: (value) => {
        return !value && '¡Necesitas escribir un nombre de usuario para continuar!'
    },
    allowOutsideClick: false
}).then(result =>{
    user = result.value
    socket.emit('nuevo_usuario_logueado', user)
})



input.addEventListener('keyup', evt => {
    if(evt.key === 'Enter'){
        if(input.value.trim().length>0){
            socket.emit('mensaje_cliente', {user, message: input.value});
            input.value = ''
        }
    }
})

socket.on('historial_mensajes', data =>{
    if(data.user === user) {
         if (messageList) {
        data.messages.forEach(log => {
            const messageClass = (log.user === user) ? 'message-sent' : 'message-received';
            messageList.innerHTML += `<li class="${messageClass}"><strong>${log.user}:</strong> ${log.message}</li>`; 
            messageListContainer.scrollTop = messageListContainer.scrollHeight;
        });
        }
    }
    else {
        console.error("Elemento con ID 'list-message' no encontrado.");
    }
})

socket.on('message_logs', data => {
    if (messageList) {
        const messageClass = (data.user === user) ? 'message-sent' : 'message-received';
        messageList.innerHTML += `<li class="${messageClass}"><strong>${data.user}:</strong> ${data.message}</li>`; 
        messageListContainer.scrollTop = messageListContainer.scrollHeight;
    } else {
        console.error("Elemento con ID 'list-message' no encontrado.");
    }
})