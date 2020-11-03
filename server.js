const express = require('express')
const app = express(); 
const path = require('path')
const cors = require('cors')

app.use(express.static('public'))
app.use(express.json())

const connectDB = require('./config/db')
connectDB();

const corsOptions = {
    orgin : ['http://localhost:3000', 'http://localhost:5000']
}
app.use(cors(corsOptions))

app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'ejs')

app.use('/api/files', require('./routes/files'))
app.use('/files', require('./routes/show'))
app.use('/files/download', require('./routes/download'))
var favicon = require('serve-favicon');
app.use(favicon(__dirname + '/public/favicon.ico'));

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})