/**
 * @name: order
 * @author: sand
 * @date: 2025-11-23 22:04
 * @description：order
 * @update: 2025-11-23 22:04
 */
const crypto = require('crypto')

/**
 * 生成订单号
 * @param {Object} params - 订单参数对象
 * @param {number} params.tenantId - 租户ID
 * @param {number} params.userId - 用户ID
 * @param {number} params.orderId - 订单表自增ID
 * @param {string} params.openid - 用户openid
 * @param {number} [length=28] - 生成长度，可选，默认为28
 * @description 绝对唯一性依赖 orderId 的唯一性.长度可控： 16 / 20 / 24 / 28 都行
 * @returns {string} 生成的订单号
 */
function generateOrderNo(params, length = 28) {
    const {
        userId,
        orderId,
        openid
    } = params

    const rawMaterials = `${ userId }:${ orderId }:${ openid }`
    const hmac = crypto.createHmac('sha256', rawMaterials)
    hmac.update(rawMaterials)
    return hmac.digest('hex').slice(0, length) // 截断为24位
}


module.exports = {
    generateOrderNo
}