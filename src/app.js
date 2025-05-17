
const express = require('express');
const handlebars = require('express-handlebars')
const path = require('path');//tuve que agregar path por que no funcionaba 
const {Server} = require('socket.io');

const userRouter = require('./routes/users.router');
const productRouter = require('./routes/products.router')
const uploader = require('./utils/util.js');
const cartRouter = require('./routes/carts.router');
const viewsRouter = require('./routes/views.router');
const attachSocket = require('./utils/attachSocket')

const app = express();
const PORT = process.env.PORT || 8080

app.engine('hbs', handlebars.engine({extname: 'hbs'}));
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'hbs')


const httpServer = app.listen(PORT, err =>{
    if(err) return console.log(err);
    console.log(`Servidor funcionando en el puerto ${PORT}`)
})

const io = new Server(httpServer)

app.use(attachSocket(io)) //Aplicar el middleware para que todas las rutas tengan acceso a `socketServer`
app.use(express.json()); //permite recibir json en la peticion
app.use(express.urlencoded({extended:true}))//permite enviar info tambien dese la url
app.use('/public',express.static(path.join(__dirname, 'public'))); //el __dirname funciona solo cuando no se usa type: module

let messages = [];
let users = [];
io.on('connection', socket=> {
    console.log('Nuevo cliente conectado');
    //emitir mensajes desde el servidor
    //socket.emit('evento', callback) ese solo lo recibe el socket
    //socket.brodadcast.emit(evento, callback) lo reciben todos menos el que envio el mensaje
    //socketServer.emit(evento, callback) mensaje para todos
    
    socket.on('mensaje_cliente', data => {
        messages.push(data)
        const lastMessage = messages.length - 1
        io.emit('message_logs', messages[lastMessage])
        // io.emit('message_server', messages)
    })
    
    socket.on('nuevo_usuario_logueado', user => {
        users.push(user)
        io.emit('historial_mensajes', {messages, user})
    })
})
app.use('/', viewsRouter)
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/subir-archivo', uploader.single('myFile'), (req,res)=> {
    if(!req.file){
        res.send('No se pudo subir el archivo');
    }
    res.send('Archivo subido')
})
app.use((error, req, res, next) => {
    console.log(error);
    res.status(500).send('Error 500 en el server')
})