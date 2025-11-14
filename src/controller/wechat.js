/**
 * @name: wechat
 * @author: sand
 * @date: 2025-10-13 13:36
 * @description：wechat
 * @update: 2025-10-13 13:36
 */
const service = require('@/service/wechat')

class WechatController {

    /**
     * 获取openid
     * @param ctx
     * @param next
     * @return {Promise<void>}
     */
    async getOpenId(ctx, next) {
        try {
            const {code} = ctx.validated || {}

            const userWxInfo = await service.getOpenId(code)

            ctx.body = {
                code: 200,
                data: userWxInfo,
                message: 'success'
            }
        }
        catch (e) {
            ctx.app.emit('error', e, ctx)
        }
    }

    /**
     * 获取接口调用凭据
     * @param ctx
     * @param next
     * @return {Promise<void>}
     */
    async getAccessToken(ctx, next) {
        try {
            const accessInfo = await service.getAccessToken()

            ctx.body = {
                code: 200,
                data: accessInfo,
                message: 'success'
            }
        }
        catch (e) {
            ctx.app.emit('error', e, ctx)
        }
    }
    
    /**
     * 获取接口调用凭据
     * @param ctx
     * @param next
     * @return {Promise<void>}
     */
    async getUserPhoneNumber(ctx, next) {
        try {
            const {code} = ctx.validated || {}

            const accessInfo = await service.getAccessToken()
            const userPhoneInfo = await service.getUserPhoneNumber({
                code,
                accessToken:  accessInfo.access_token
            })

            ctx.body = {
                code: 200,
                data: userPhoneInfo,
                message: 'success'
            }
        }
        catch (e) {
            ctx.app.emit('error', e, ctx)
        }
    }
}

module.exports = new WechatController()
