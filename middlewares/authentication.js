const jwt = require('jsonwebtoken')
require('dotenv').config()
const { client } = require('../cache')
const { logger } = require('../loggerconfig/logger')

const authenticator = async (req, res, next) => {
    let token = req.cookies.token
    if (token) {
        try {
            const response = await client.lRange('blackToken', 0, -1)
            if (!response.includes(token)) {
                var decode = jwt.verify(token, process.env.secretkey, function (err, decoded) {
                    if (err) {
                        res.send({ err: 'login first' })
                    } else {
                        req.body.userID = decoded.userID
                        next()
                    }
                })
            } else {
                res.send({ err: 'login again' })
            }
        } catch (err) {
            logger.log('error', `error in authenticator, err=${err.message}`)
            res.send(err.message)
        }
    } else {
        res.send({ err: 'login first 2' })
    }
}

module.exports = { authenticator }