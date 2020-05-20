const TwitterClient = require("twitter-lite");

const client = new TwitterClient({
    consumer_key: "xyz",
    consumer_secret: "xyz",
    access_token_key: "xyz",
    access_token_secret: "xyz"
})

client.get(...)
client.post(...)

module.exports = client