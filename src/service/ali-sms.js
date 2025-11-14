/**
 * @name: ali-sms
 * @author: sand
 * @date: 2025-11-14 17:54
 * @description：ali-sms
 * @update: 2025-11-14 17:54
 */
const AliSmsRedisDAO = require('@dao/redis/ali-sms')
const { generateRandomNumberString } = require('@utils/random')
const { encryptPhone } = require('@utils/encrypt.decrypt')
const { sendSmsPhoneVerificationCode } = require('@utils/sendSms')

class AliSmsService {
    /**
     * 获取手机号发送次数
     * @param {string|number} phone 手机号
     * @return {Promise<Object>}
     */
    getSentCount(phone) {
        return AliSmsRedisDAO.getSentCount(encryptPhone(phone))
    }

    /**
     * 获取同一IP一天内发送短信次数
     * @param {string|number} clientIP ip
     * @return {Promise<Object>}
     */
    getIpRequestsCount(clientIP) {
        return AliSmsRedisDAO.getIpRequestsCount(clientIP)
    }

    /**
     * 获取最后一次发送短信验证码时间
     * @param {string|number} phone 手机号
     * @return {Promise<Object>}
     */
    getLastSentTime(phone) {
        return AliSmsRedisDAO.getLastSentTime(encryptPhone(phone))
    }

    /**
     * 发送短信验证码
     * @param {string|number} phone 手机号
     * @param {string|number} ip ip
     * @return {Promise<Object>}
     */
    sendSms(phone, ip) {
        return new Promise(async (resolve, reject) => {
            try {
                const verificationCode = generateRandomNumberString(6)
                const result = await sendSmsPhoneVerificationCode(phone, verificationCode)

                if (result.Code !== 'OK') {
                    resolve({
                        code: 200,
                        data: result,
                        message: result.Message
                    })
                    return
                }

                // 设置短信验证码
                await AliSmsRedisDAO.setExSendSmsCode(encryptPhone(phone), verificationCode)
                // 更新最后发送时间
                await AliSmsRedisDAO.setLastSentTime(encryptPhone(phone))
                // 更新手机号发送次数
                await AliSmsRedisDAO.setSentCount(encryptPhone(phone))
                // 更新IP发送次数
                await AliSmsRedisDAO.setIpRequestsCount(ip)

                resolve({
                    code: 200,
                    message: '验证码已发送，请查收。'
                })
            }
            catch (error) {
                reject(error)
            }
        })
    }

    /**
     * 获取短信验证码
     * @param {string|number} phone 手机号
     * @return {Promise<Object>}
     */
    getSmsCode(phone) {
        return AliSmsRedisDAO.getExSendSmsCode(encryptPhone(phone))
    }
}

module.exports = new AliSmsService()
