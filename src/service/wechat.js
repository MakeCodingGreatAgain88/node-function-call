/**
 * @name: wechat
 * @author: sand
 * @date: 2025-10-13 13:36
 * @description：wechat
 * @update: 2025-10-13 13:36
 */
const fs = require('fs')
const crypto = require('crypto')
const path = require('path')
const axios = require('axios')
const {generateOrderNo} = require('@utils/order')
const {createWechatSign} = require('@utils/wechatSign')
const {PAY_EXPIRE_TIME} = require('@config/env.config')
const {
    OrderStatus,
    PayStatus,
    PaymentMethods
} = require('@constant/enum')
const {
    WX_APPID,
    WX_SECRET
} = require('@config/env.config')

class WechatService {
    /**
     * 获取openid
     * @param {string} code
     * @return {Promise<String>}
     */
    getOpenId(code) {
        return new Promise(async (resolve, reject) => {
            try {
                // 调用微信接口获取 openid 和 session_key
                const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${ WX_APPID }&secret=${ WX_SECRET }&js_code=${ code }&grant_type=authorization_code`
                const res = await axios.get(url)
                if (res && res?.data?.errcode) {
                    reject(new Error(res?.data?.errmsg || '登录失败'))
                    return
                }

                resolve(res.data)
            }
            catch (error) {
                reject(error)
            }
        })
    }

    /**
     * 获取接口调用凭据
     * @return {Promise<String>}
     */
    getAccessToken() {
        return new Promise(async (resolve, reject) => {
            try {
                // 调用微信接口获取 openid 和 session_key
                const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${ WX_APPID }&secret=${ WX_SECRET }`
                const res = await axios.get(url)
                if (res && res?.data?.errcode) {
                    reject(new Error(res?.data?.errmsg || '获取接口调用凭据失败'))
                    return
                }

                resolve(res.data)
            }
            catch (error) {
                reject(error)
            }
        })
    }

    /**
     * 获取手机号
     * @return {Promise<String>}
     */
    getUserPhoneNumber(params) {
        return new Promise(async (resolve, reject) => {
            try {
                // 调用微信接口获取 openid 和 session_key
                const url = `https://api.weixin.qq.com/wxa/business/getuserphonenumber?access_token=${ params.accessToken }`
                const res = await axios.post(url, {code: params.code})
                if (res && res?.data?.errcode) {
                    reject(new Error(res?.data?.errmsg || '获取手机号失败'))
                    return
                }

                resolve(res.data)
            }
            catch (error) {
                reject(error)
            }
        })
    }

    /**
     * 创建订单（单一职责：只负责创建订单）
     * @param {Object} params - 订单参数
     * @param {number} params.userId - 用户ID
     * @param {string} params.openid - 微信openid
     * @param {number} params.productId - 商品ID
     * @param {number} params.productNum - 商品数量
     * @param {number} params.totalPrice - 订单总金额（已计算）
     * @param {string} [params.remark] - 订单备注
     * @returns {Promise<Object>} 创建的订单
     */
    createOrder(params) {
        return new Promise(async (resolve, reject) => {
            try {
                // 计算支付结束时间（根据环境变量 PAY_EXPIRE_TIME，单位：分钟）
                const expireMinutes = parseInt(PAY_EXPIRE_TIME) || 15 // 默认15分钟
                const expireTime = new Date(Date.now() + expireMinutes * 60 * 1000)

                // 格式化为 rfc3339 格式：yyyy-MM-DDTHH:mm:ss+08:00
                const year = expireTime.getFullYear()
                const month = String(expireTime.getMonth() + 1).padStart(2, '0')
                const day = String(expireTime.getDate()).padStart(2, '0')
                const hours = String(expireTime.getHours()).padStart(2, '0')
                const minutes = String(expireTime.getMinutes()).padStart(2, '0')
                const seconds = String(expireTime.getSeconds()).padStart(2, '0')
                const payExpireTime = `${ year }-${ month }-${ day }T${ hours }:${ minutes }:${ seconds }+08:00`

                // 生成唯一的临时订单号（避免高并发场景下的唯一性冲突）
                // 格式：TEMP_时间戳(毫秒)_随机字符串，确保唯一性
                // 订单号字段限制为32字符：TEMP_(5) + timestamp(13) + _(1) + random(13) = 32字符
                const timestamp = Date.now()
                const randomStr = crypto.randomBytes(6).toString('hex') // 12位随机字符串（6字节）
                const tempOrderNo = `TEMP_${ timestamp }_${ randomStr }` // 总长度31字符，符合32字符限制

                // 准备订单数据（先创建临时订单以获取自增ID）
                const orderData = {
                    orderNo: tempOrderNo, // 唯一临时订单号，稍后会更新为正式订单号
                    openid: params.openid,
                    productId: params.productId,
                    productNum: params.productNum,
                    orderStatus: OrderStatus.PENDING_PAYMENT, // 默认订单状态：待支付
                    paymentMethods: PaymentMethods.WECHAT_PAY, // 默认支付方式：微信支付
                    payStatus: PayStatus.UNPAID, // 默认支付状态：未支付
                    totalPrice: params.totalPrice,
                    payExpireTime, // 支付结束时间是指用户能够完成该笔订单支付的最后时限，并非订单关闭的时间。超过此时间后，用户将无法对该笔订单进行支付。如商户需在超时后关闭订单，请调用关闭订单API接口。
                    remark: params.remark
                }

                // todo 创建订单（先插入获取自增ID）
                const insertInfo = await OrderDao.create(orderData)
                const orderId = insertInfo.id

                // 生成绝对唯一订单号并更新
                const orderNo = generateOrderNo({
                    orderId,
                    userId: params.userId,
                    openid: params.openid
                }, 28)

                // todo 更新订单号
                await OrderDao.updateByIdForCreate(orderId, {orderNo})

                // 添加延迟任务：在支付过期时间到达时自动关闭订单
                // 延迟时间需要与 payExpireTime 计算保持一致
                const orderCloseQueue = require('@queue/orderCloseQueue')
                const delay = expireMinutes * 60 * 1000 // 延迟时间（毫秒），与 payExpireTime 计算保持一致

                await orderCloseQueue.add(
                    {
                        orderId
                    },
                    {
                        delay, // 延迟执行时间，与订单支付过期时间一致
                        attempts: 3, // 最多重试3次
                        backoff: {
                            type: 'exponential',
                            delay: 2000 // 重试延迟2秒
                        },
                        removeOnComplete: true, // 完成后移除任务
                        removeOnFail: false // 失败后保留任务（用于排查问题）
                    }
                )

                console.log(`[订单创建] 订单 ${ orderNo } (ID: ${ orderId }) 已创建，支付过期时间: ${ payExpireTime }，将在 ${ expireMinutes } 分钟后自动关闭`)

                // 返回订单号
                resolve({
                    orderNo,
                    payExpireTime,
                    orderId
                })
            }
            catch (error) {
                reject(error)
            }
        })
    }

    /**
     * 创建预支付交易会话标识
     * @return {Promise<Object>}
     */
    createPrepayId(params) {
        return new Promise(async (resolve, reject) => {
            try {
                // 获取请求的绝对URL
                const method = "POST"
                const urlPath = "/v3/pay/transactions/jsapi"

                // 构建签名
                const {
                    Authorization,
                    timeStamp,
                    nonceStr
                } = createWechatSign({
                    method,
                    urlPath,
                    mchid: '微信支付商户号 - 微信支付平台获取',
                    serial_no: '证书序列号 - 微信支付平台获取',
                    bodyParams: params.bodyParams
                })

                /**
                 * ：
                 * end ____________________________________________________________________________________________________________________________________________________________*/

                    // 接口请求得到预支付ID: prepay_id
                    // 预支付交易会话标识，JSAPI或小程序调起支付时需要使用的参数，有效期为2小时，失效后需要重新请求该接口以获取新的prepay_id。
                const result = await axios({
                        url: "https://api.mch.weixin.qq.com/v3/pay/transactions/jsapi",
                        method,
                        data: params.bodyParams,
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json",
                            "Authorization": Authorization,
                            "User-Agent": "WechatPay-APIv3-NodeJS"
                        },
                        timeout: 10000 // 超时时间（单位：毫秒）
                    })

                const prepay_id = result.data.prepay_id

                // 生成支付签名（用于客户端调起支付）
                const paySignStr = `${ '小程序appid - 小程序后台获取' }\n${ timeStamp }\n${ nonceStr }\nprepay_id=${ prepay_id }\n`

                // 使用商户API证书私钥对待签名串进行SHA256 with RSA签名
                const paySign = crypto.createSign('RSA-SHA256')
                paySign.update(paySignStr)
                paySign.end()
                const paySignature = paySign.sign(privateKey, 'base64')

                const payInfo = {
                    package: `prepay_id=${ result.data.prepay_id }`,
                    paySign: paySignature,
                    timeStamp,
                    nonceStr,
                    signType: "RSA"
                }

                // todo 将payInfo更新到订单表的payInfo字段中，便于用户后续继续支付
                if (params.orderId && params.tenantId) {
                    await OrderDao.updateByIdForAutoCancel(params.orderId, params.userId, params.tenantId, {
                        payInfo: payInfo
                    })
                    console.log(`[创建预支付ID] 订单 ${ params.orderId } 的支付信息已更新`)
                }

                resolve(payInfo)
            }
            catch (error) {
                // 输出详细的错误信息
                if (error.response) {
                    console.error('响应错误:', {
                        status: error.response.status,
                        statusText: error.response.statusText,
                        data: error.response.data,
                        headers: error.response.headers
                    })
                }
                else if (error.request) {
                    console.error('请求错误:', error.request)
                }
                else {
                    console.error('错误信息:', error.message)
                }
                reject(error)
            }
        })
    }

    /**
     * 关闭订单（调用微信支付关闭接口并更新订单状态，针对未支付订单）
     * @param {Object} orderId - 订单id
     * @returns {Promise<Object>} 关闭结果
     */
    async closeOrder(orderId) {
        return new Promise(async (resolve, reject) => {
            try {

                // todo 查询订单
                const order = await OrderDao.getByIdForAutoCancel(orderId)

                if (!order) {
                    console.log(`[订单自动关闭] 订单 ${ orderId } 不存在`)
                    resolve({
                        success: false,
                        message: '订单不存在'
                    })
                    return
                }

                // 检查订单状态：只有待支付且未支付的订单才需要关闭
                if (order.orderStatus === OrderStatus.PENDING_PAYMENT && order.payStatus === PayStatus.UNPAID) {
                    const method = "POST"
                    const urlPath = `/v3/pay/transactions/out-trade-no/${ order.orderNo }/close`

                    const bodyParams = {
                        mchid: '微信支付商户号 - 微信支付平台获取'
                    }

                    // 构建签名
                    const {
                        Authorization
                    } = createWechatSign({
                        method,
                        urlPath,
                        mchid: '微信支付商户号 - 微信支付平台获取',
                        serial_no: '证书序列号 - 微信支付平台获取',
                        bodyParams
                    })

                    // 调用微信支付关闭订单接口
                    const result = await axios({
                        url: `https://api.mch.weixin.qq.com${ urlPath }`,
                        method,
                        data: bodyParams,
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json",
                            "Authorization": Authorization,
                            "User-Agent": "WechatPay-APIv3-NodeJS"
                        },
                        timeout: 10000 // 超时时间（单位：毫秒）
                    })

                    console.log(`[关闭订单] 订单 ${ order.orderNo } 关闭成功`)

                    // todo 更新订单状态和支付状态
                    await OrderDao.updateByIdForAutoCancel(order.id, {
                        orderStatus: OrderStatus.CANCELLED,
                        payStatus: PayStatus.PAYMENT_FAILED // 关闭订单时，支付状态设为支付失败
                    })

                    console.log(`[关闭微信订单] 订单 ${ order.orderNo } 已成功关闭`)
                }
                else {
                    console.log(`[订单自动关闭] 订单 ${ order.orderNo } (ID: ${ orderId }) 状态为 ${ order.orderStatus }，支付状态为 ${ order.payStatus }，无需处理`)
                    resolve({
                        success: false,
                        message: '订单状态不符合关闭条件',
                        orderStatus: order.orderStatus,
                        payStatus: order.payStatus
                    })
                }
                resolve({
                    code: 200,
                    data: null,
                    message: '订单关闭成功'
                })
            }
            catch (error) {
                console.error(`[关闭微信订单] 订单 ${ order.orderNo } 关闭失败:`, error)
                reject(error)
            }
        })
    }

}

module.exports = new WechatService()
