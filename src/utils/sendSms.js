/**
 * @name: sendSms
 * @author: sand
 * @date: 2024/1/17 13:20
 * @description：sendSms
 * @update: 2024/1/17 13:20
 */

const SMSClient = require('@alicloud/sms-sdk')
const {phoneVerificationCode} = require('@constant/smsTemplate')
const {
    ALI_STS_ACCESS_KEY_ID,
    ALI_STS_ACCESS_KEY_SECRET
} = require('@config/env.config')

// 初始化sms_client
const smsClient = new SMSClient({
    accessKeyId: ALI_STS_ACCESS_KEY_ID,
    secretAccessKey: ALI_STS_ACCESS_KEY_SECRET
})

/**
 * 发送短信
 * @param {number} phone 手机号
 * @param {string} verificationCode 验证码
 * @return {Promise<unknown>}
 */
const sendSmsPhoneVerificationCode = (phone, verificationCode) => {

    return new Promise(async (resolve, reject) => {
        try {
            const result = await smsClient.sendSMS({
                PhoneNumbers: phone,
                TemplateParam: `{"code":'${ verificationCode }'}`,
                ...phoneVerificationCode
            })
            resolve(result)
        }
        catch (error) {
            reject(error.data)
        }
    })
}

module.exports = {
    sendSmsPhoneVerificationCode
}
