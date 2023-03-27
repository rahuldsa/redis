const express = require('express')
const connection = require('./configs/db')
const { userRoute } = require('./routes/user.route')
const { cityRoute } = require('./routes/city.route')
const { validator } = require('./middlewares/validator')
const { logRequest } = require('./loggerconfig/logger')
const cookieParser = require('cookie-parser')
const { authenticator } = require('./middlewares/authentication')

require('dotenv').config()

const app = express()
app.use(logRequest)
app.use(express.json())

app.use(cookieParser())

app.use('/users', userRoute)

app.use(authenticator)
app.use(validator)

app.use('/city', cityRoute)

app.get('/', (req, res) => {
    res.send('home page')
})

app.listen(4500, async () => {
    try {
        await connection()
        console.log('connnected to DB');
    } catch (err) {
        console.log('error connecting to DB');
        console.log(err);
    }
    console.log('runs at port 4500');
})

