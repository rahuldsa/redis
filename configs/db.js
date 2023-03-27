const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const connection = () => mongoose.connect('mongodb+srv://rahul:rahul@cluster0.9zrwoyp.mongodb.net/weather?retryWrites=true&w=majority')

module.exports = connection