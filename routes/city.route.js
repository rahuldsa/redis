const express = require('express')
const request = require('request')
const mongoose = require('mongoose')
const { userModel } = require('../models/user.model')
const { client } = require('../cache')
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const logger = require('../loggerconfig/logger')

const cityRoute = express.Router()

const app = express()

cityRoute.get('/', (req, res) => {
    let city = req.query.city
    var request = require('request')
    request(
        `https://samples.openweathermap.org/data/2.5/forecast?q=${city}&appid=2e165aa3c3a1b87b0b36b918f28079eb`,
        function (error, response, body) {
            console.log(body);
            let data = JSON.parse(body)
            if (response.statusCode === 200) {
                res.send(`the weather in your city '${city}' is ${data.list[0].weather[0].description}`)
            }
            client.set(cacheKey,JSON.stringify(data),'EXPIRY',1800,(err)=>{
                if(err){
                    console.log(err);
                    return res.status(500).send('internal error')
                }
                return res.send({data})
            })
        }
    )
})

cityRoute.get('/', async (req, res) => {
    let city = req.query.city
    const userID = req.body.userID
    try {
        let temp
        let cachedCity = await client.hGet('cityData', city)
        if (cachedCity) {
            temp = cachedCity
        } else {
            let result = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid={6683043b5be68f95d30ea9467e35c775}`)
            let data = await result.json()

            let resultOne = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${data[0].lat}&lon=${data[0].lon}&appid={6683043b5be68f95d30ea9467e35c775}`)
            let dataOne = await resultOne.json()

            temp = (dataOne.main.temp - 273.15).toFixed(1)
            await client.hSet('cityWeatherData', city, temp)
        }
        await userModel.findByIdAndUpdate({ _id: userID }, { $push: { search: city } })
        res.send({ msg: `temperature(celsius) in ${city} is:${temp}` })
    } catch (err) {
        console.log(err.message);
        logger.log('error', `error while getting weather by city in city.route.js,err=${err.message} `)
        res.send({ err: 'cant find weather for the selected city' })
    }
})

module.exports = { cityRoute }