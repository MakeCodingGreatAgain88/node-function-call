/**
 * @name: ali-sms
 * @author: sand
 * @date: 2025-11-14 17:53
 * @description：ali-sms
 * @update: 2025-11-14 17:53
 */
const {getSafeClientIp} = require('@utils/ip')
const service = require('@service/ali-sms')

class AliSmsController {
    /**
     * 发送短信验证码
     * @param ctx
     * @param next
     * @return {Promise<void>}
     */
    async sendSms(ctx, next) {
        try {
            const { phone } = ctx.validated || {}
            ctx.body = await service.sendSms(phone, getSafeClientIp(ctx.request.ip))
        }
        catch (e) {
            ctx.app.emit('error', e, ctx)
        }
    }

}

module.exports = new AliSmsController()
