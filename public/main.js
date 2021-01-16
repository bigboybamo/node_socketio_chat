const socket = io()

socket.on('totalClients',(data)=>{
    console.log(data)
    document.getElementById('client-total').innerHTML = `Number of connected user(s) is ${data}`
})
