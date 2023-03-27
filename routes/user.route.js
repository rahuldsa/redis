const express = require('express')
const mongoose = require('mongoose')
const { userModel } = require('../models/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()


const userRoute = express.Router()

userRoute.get('/', async (req, res) => {
    res.send('users homepage')
})

userRoute.post('/register', async (req, res) => {
    let { name, email, password, city, search } = req.body
    try {
        bcrypt.hash(password, 4, async function (err, hash) {
            if (err) {
                res.send({ err })
            } else {
                let user = new userModel({ name, email, password: hash, city, search })
                await user.save()
                res.send({ msg: 'user registered' })
            }
        })
    } catch (err) {
        res.send({ err: err.message })
    }
})

userRoute.post('/login', async (req, res) => {
    let { email, password } = req.body
    try {
        let user = await userModel.findOne({ email })
        if (user) {
            bcrypt.compare(password, user.password, async function (err, result) {
                if (result) {
                    var token = jwt.sign({ userID: user._id }, process.env.secretkey)
                    res.cookie('token', token)
                    res.send({ msg: 'login successfull', token })
                } else {
                    res.send({ err: 'wrong credentials' })
                }
            })
        } else {
            res.send({ err: 'wrong credentials 2' })
        }
    } catch (err) {
        res.send({ err: err.message })
    }
})

userRoute.get('/logout', async (req, res) => {
    let token = req.cookies.token
    if (token) {
        try {
            await client.LPUSH('blackToken', token)
            res.send({ msg: 'logged out' })
        } catch (err) {
            res.send({ err: err.message })
        }
    } else {
        res.send({ err: 'kindly login first' })
    }
})

module.exports = { userRoute }