require('dotenv').config();
require('../Backend/Db/Database')
const express = require('express')
const app = express()
const cors = require('cors')
const PORT = 8000
const bodyParser = require('body-parser');
const userRouter = require('./router/userRouter')
const {Server} = require('ws');



app.use(cors({
    origin: 'https://invenro.com',
    methods: "GET,POST,PUT,DELETE,PATCH",
    credentials: true,  // This allows credentials to be included in the request
    allowedHeaders: ["Content-Type", "Authorization"],
}));



/// Middleware to parse JSON and form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));                                         


// Use the userRouter for handling routes
app.use('/api/user', userRouter);
app.use('/api/tyem', userRouter);  // Use webhookRouter for handling webhook routes
app.use('/api/admin',userRouter)


   

const server = app.listen(PORT,()=>{
    console.log(`server start at port on ${PORT}`);   
})

// WebSocket setup

const wss = new Server({ server });

wss.on('connection', ws => {
    console.log('Client connected');

    ws.on('message', message => {
        console.log('Received:', message);
    });

    ws.on('close', () => console.log('Client disconnected'));
});

app.set('wss', wss);