let validator = async (req, res, next) => {
    let city = req.query.city
    if (/^[a-z A-Z]+$/.test(city)) {
        next()
    } else {
        res.send({ err: 'enter city name only containing alphabets' })
    }
}

module.exports = { validator }