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
                accessToken: accessInfo.access_token
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

    /**
     * 发起支付（jsapi：适用h5,小程序）
     * @param ctx
     * @param next
     * @returns {Promise<void>}
     */
    async createJsapiPay(ctx, next) {
        try {
            const params = ctx.validated || {}

            const wechatPayConfig = {
                wechatAppId: '小程序appid - 小程序后台获取',
                wechatMerchantId: '微信支付商户号 - 微信支付平台获取',
                wechatPayCertNo: '证书序列号 - 微信支付平台获取'
            }
            // 创建订单
            const order = await service.createOrder(params)

            // 调用微信支付创建预支付ID
            // https://pay.weixin.qq.com/doc/v3/merchant/4012791897
            const payInfo = await service.createPrepayId({
                userId: params.userId,
                orderId: order.orderId,
                appid: wechatPayConfig.wechatAppId,
                mchid: wechatPayConfig.wechatMerchantId,
                serial_no: wechatPayConfig.wechatPayCertNo,
                bodyParams: {
                    // 公众号/小程序 id
                    appid: wechatPayConfig.wechatAppId,
                    // 商户号
                    mchid: wechatPayConfig.wechatMerchantId,
                    // 商品描述
                    description: params.description,
                    // 商户订单号
                    out_trade_no: order.orderNo,
                    // 支付结束时间
                    time_expire: order.payExpireTime,
                    // 支付者信息
                    payer: {openid: params.openid},
                    // 订单金额（单位：分，必须是整数）
                    amount: {
                        total: params.totalPrice,
                        currency: "CNY"
                    },
                    // 回调通知 web hook
                    notify_url: 'https://xxxx.com/api/wxPay/payNotify'
                }
            })

            ctx.body = {
                code: 200,
                data: payInfo,
                message: '订单创建成功'
            }
        }
        catch (e) {
            ctx.app.emit('error', e, ctx)
        }
    }


}

module.exports = new WechatController()
