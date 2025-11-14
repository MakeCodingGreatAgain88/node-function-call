/**
 * @name: redis
 * @author: sand
 * @date: 2023/12/11 23:48
 * @description：redis
 * @update: 2023/12/11 23:48
 */

const Redis = require('ioredis')
const {
    REDIS_DB,
    REDIS_PORT,
    REDIS_HOST
    // REDIS_PASSWORD
} = require('@config/env.config')

// 创建 Redis 连接池
const redisPool = new Redis({
    host: REDIS_HOST,
    port: REDIS_PORT,
    // password: REDIS_PASSWORD,
    db: REDIS_DB
})

/*

 redisPool.ping()
 .then(result => {
 console.log('✅ Redis 连接成功:', result) // 应该返回 'PONG'
 })
 .catch(err => {
 console.error('❌ Redis 连接失败:', err)
 })
 */

module.exports = redisPool
