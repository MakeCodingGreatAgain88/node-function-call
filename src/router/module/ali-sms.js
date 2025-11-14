/**
 * @name: ali-sms
 * @author: sand
 * @date: 2025-11-14 17:49
 * @description：ali-sms
 * @update: 2025-11-14 17:49
 */
const Router = require('koa-router')
const {validate} = require('@middleware/validate')
const {
    sendSms
} = require('@controller/ali-sms')
const {
    phoneSchema,
    checkDailySmsLimit,
    checkDailyIpSendSmsLimit,
    checkLastSentTime
} = require('@middleware/ali-sms')

const router = new Router({
    prefix: '/ali-sms'
})

/**
 * 发送短信验证码
 */
router.post(
    '/sendSms',
    validate(phoneSchema),
    checkDailySmsLimit,
    checkLastSentTime,
    checkDailyIpSendSmsLimit,
    sendSms
)
module.exports = router
