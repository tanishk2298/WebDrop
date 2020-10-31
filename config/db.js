require('dotenv').config()
const mongoose = require('mongoose')

function connectDB(){
    mongoose.connect(process.env.MONGO_CONNECTION_URL, { useNewUrlParser: true , useUnifiedTopology: true, useCreateIndex: true,useFindAndModify: true});
    const connection = mongoose.connection
    connection.once('open', () => {
        console.log('MongoDB connected')
    }).catch(err => {
        console.log('Error connecting')
    })
}

module.exports = connectDB;