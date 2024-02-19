const Redis = require("ioredis");

const redis = new Redis({
    password: '2iTwefxjLHrGXHDuo5WIeUruHF0TNjdg',
    host: 'redis-19214.c302.asia-northeast1-1.gce.cloud.redislabs.com',
    port: 19214,
    username: "default",
    db: 0
    
});

module.exports = { redis }