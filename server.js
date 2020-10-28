const express = require('express')
const app = express(); 

const connectDB = require('./config/db')
connectDB();

app.use('/api/files', require('./routes/files'))

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})