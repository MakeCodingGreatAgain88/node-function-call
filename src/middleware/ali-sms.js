/**
 * @name: ali-sms
 * @author: sand
 * @date: 2025-11-14 17:50
 * @description：ali-sms
 * @update: 2025-11-14 17:50
 */
const {createError} = require('@utils/error')
const {getSafeClientIp} = require("@/utils/ip")
const {
    z,
    zStrictSchema
} = require('@middleware/validate')
const service = require('@service/ali-sms')

/**
 * 验证手机号格式 Schema
 */
const phoneSchema = zStrictSchema({
    phone: z.string().regex(/^1[3-9]\d{9}$/, '手机号格式不正确，请输入11位有效手机号')
})

/**
 * 检查同一手机号一天最多只能发送5次手机号的验证
 * @param ctx
 * @param next
 * @return {Promise<void>}
 */
const checkDailySmsLimit = async (ctx, next) => {
    const {phone} = ctx.validated || {}

    // 1. 检查同一手机号一天最多只能发送5次手机号的验证
    const sentCount = await service.getSentCount(phone)
    if (sentCount >= 5) {
        ctx.app.emit('error', createError(403, '同一手机号24小时内最多发送5次验证码'), ctx)
        return
    }

    await next()
}

/**
 * 根据 IP 限制恶意攻击
 * @param ctx
 * @param next
 * @return {Promise<void>}
 */
const checkDailyIpSendSmsLimit = async (ctx, next) => {
    // 1. 检查同一IP一天最多只能发送10次手机号的验证
    const sentCount = await service.getIpRequestsCount(getSafeClientIp(ctx.request.ip))
    if (sentCount >= 10) {
        // 如果在一天内请求次数超过 10 次，可能存在恶意攻击，可以进行相应处理，例如封禁 IP
        ctx.app.emit('error', createError(403, '同一设备24小时内多发送10次验证码'), ctx)
        return
    }

    await next()
}

/**
 * 检查发送间隔时间
 * @param ctx
 * @param next
 * @return {Promise<void>}
 */
const checkLastSentTime = async (ctx, next) => {
    const {phone} = ctx.validated || {}
    const lastSentTime = await service.getLastSentTime(phone)
    if (lastSentTime) {
        const currentTime = Date.now()
        const timeDiff = currentTime - parseInt(lastSentTime)

        // 检查同一手机号发送验证码间隔时间90秒
        if (timeDiff < 90000) {
            ctx.app.emit('error', createError(403, '验证码发送过于频繁，请等待一段时间后再试。'), ctx)
            return
        }
    }

    await next()
}

module.exports = {
    phoneSchema,
    checkDailySmsLimit,
    checkDailyIpSendSmsLimit,
    checkLastSentTime
}
