/**
 * @name: wechatSign
 * @author: sand
 * @date: 2025-11-30 22:15
 * @description：wechatSign
 * @update: 2025-11-30 22:15
 */
const path = require("path")
const fs = require("fs")
const crypto = require("crypto")

/**
 * 构建签名：
 * @param {Object} params - 构造参数
 * @param {string} params.method - HTTP方法
 * @param {string} params.urlPath - URL路径
 * @param {string} params.mchid - 商户号
 * @param {string} params.serial_no - 证书序列号
 * @param {Object} params.bodyParams - 请求报文主体
 * @description：何时需要构建签名：https://pay.weixin.qq.com/doc/v3/merchant/4012365342#%E8%AF%B7%E6%B1%82%E6%8E%A5%E5%8F%A3%E5%90%8E%E7%AB%AF%E7%AD%BE%E5%90%8D
 * @description：计算签名：https://pay.weixin.qq.com/doc/v3/merchant/4012365336
 * @return {Object}
 * */
const createWechatSign = (params) => {
    // 商户私钥
    const privateKeyPath = path.join(process.cwd(), `src/certs/apiclient_test_key.pem`)
    const privateKey = fs.readFileSync(privateKeyPath, 'utf8')

    // 商户号
    const mchid = params.mchid

    // 证书序列号
    const serial_no = params.serial_no

    // 随机串
    const nonceStr = crypto.randomBytes(16).toString('hex')

    // 时间戳
    const timeStamp = Math.floor(Date.now() / 1000)

    // 请求报文主体
    const bodyParams = params.bodyParams

    // 请求报文主体（注意：需要按字典序排序的 JSON 字符串）
    const body_params_str = JSON.stringify(bodyParams)

    // 构造签名串（注意：末尾的换行符很重要）
    const signStr = `${ params.method }\n${ params.urlPath }\n${ timeStamp }\n${ nonceStr }\n${ body_params_str }\n`

    // 生成预支付ID签名
    const sign = crypto.createSign('RSA-SHA256')
    sign.update(signStr)
    sign.end()
    const signature = sign.sign(privateKey, 'base64')

    // 请求头传递签名
    const Authorization = `WECHATPAY2-SHA256-RSA2048 `
        + `mchid="${ mchid }",`
        + `nonce_str="${ nonceStr }",`
        + `timestamp="${ timeStamp }",`
        + `signature="${ signature }",`
        + `serial_no="${ serial_no }"`

    return {
        Authorization,
        timeStamp,
        nonceStr
    }
}

module.exports = {
    createWechatSign
}