const redis = require('redis');
const client = redis.createClient({
    legacyMode: true
})

client
    .connect()
    .then(async (res) => {
        console.log('connected to redis');
        const value = await client.lRange('data', 0, -1)
        console.log(value.length);
        console.log(value);
        client.quit()
    })
    .catch((err) => {
        console.log('err happened' + err);
    })

module.exports = { client }