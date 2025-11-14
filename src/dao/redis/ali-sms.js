/**
 * @name: ali-sms
 * @author: sand
 * @date: 2025-11-14 17:55
 * @description：ali-sms
 * @update: 2025-11-14 17:55
 */
/**
 * @name: sms
 * @author: yuxi
 * @date: 2024/1/20 23:45
 * @description：sms
 * @update: 2024/1/20 23:45
 */

const client = require('@db/redis')

/**
 * 设置手机号发送次数
 * @param {string|number} phone 手机号
 * @param {number} seconds 过期时间(秒)，默认1天
 * @return <Promise>
 */
const setSentCount = (phone, seconds = 86400) => {
    return new Promise(async (resolve, reject) => {
        try {
            const phoneKey = `sentCount:${phone}`
            const ipRequestsCount = await client.incr(phoneKey)
            if (ipRequestsCount === 1) {
                // 设置 手机号 请求计数的过期时间，例如一天
                await client.expire(phoneKey, seconds)
            }

            resolve(ipRequestsCount)
        }
        catch (e) {
            reject(e)
        }
    })
}

/**
 * 获取手机号发送次数
 * @param {string|number} phone 手机号
 * @return <Promise>
 */
const getSentCount = (phone) => {
    return client.get(`sentCount:${phone}`)
}

/**
 * IP访问次数+1
 * @param {string} clientIP 客户端IP
 * @param {number} [seconds=86400] 过期时间(秒)，默认1天
 * @return <Promise>
 */
const setIpRequestsCount = (clientIP, seconds = 86400) => {
    return new Promise(async (resolve, reject) => {
        try {
            const ipRequestsKey = `ipRequests:${clientIP}`
            const ipRequestsCount = await client.incr(ipRequestsKey)
            if (ipRequestsCount === 1) {
                // 设置 IP 请求计数的过期时间，例如一天
                await client.expire(ipRequestsKey, seconds)
            }

            resolve(ipRequestsCount)
        }
        catch (e) {
            reject(e)
        }
    })
}

/**
 * 获取IP访问次数
 * @param {string} clientIP 客户端IP
 * @return <Promise>
 */
const getIpRequestsCount = (clientIP) => {
    return client.get(`ipRequests:${clientIP}`)
}

/**
 * 设置最后一次发送验证码时间
 * @param phone
 * @param {number} [seconds=90] 过期时间(秒)，默认90秒
 * @return {Result<string | null, Context>}
 */
const setLastSentTime = (phone, seconds = 90) => {
    return client.setex(`lastSentTime:${phone}`, seconds, Date.now().toString())
}

/**
 * 获取最后一次发送验证码时间
 * @param phone
 * @return {Promise<void>}
 */
const getLastSentTime = (phone) => {
    return client.get(`lastSentTime:${phone}`)
}

/**
 * 设置短信验证码
 * @param {string|number} phone 手机号
 * @param {string|number} code 验证码
 * @param {number} [seconds=300] 过期时间(秒)，默认5分钟
 * @return {Result<"OK", Context>}
 */
const setExSendSmsCode = (phone, code, seconds = 300) => {
    return client.setex(`sendSms:${phone}`, seconds, code)
}

/**
 * 获取短信验证码
 * @param {string|number} phone 手机号
 * @return {Promise<void>}
 */
const getExSendSmsCode = (phone) => {
    return client.get(`sendSms:${phone}`)
}

/**
 * 删除短信验证码
 * @param {string|number} phone 手机号
 * @return {Promise<void>}
 */
const delExSendSmsCode = (phone) => {
    return client.del(`sendSms:${phone}`)
}

module.exports = {
    setSentCount,
    getSentCount,

    setIpRequestsCount,
    getIpRequestsCount,

    setExSendSmsCode,
    getExSendSmsCode,
    delExSendSmsCode,

    setLastSentTime,
    getLastSentTime
}
