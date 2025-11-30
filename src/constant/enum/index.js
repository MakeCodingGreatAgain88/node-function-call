/**
 * 枚举映射统一导出
 * @description 所有数据模型枚举映射的统一导出文件
 */

module.exports = {
    // 订单状态
    OrderStatus: require('./order.status'),

    // 支付状态
    PayStatus: require('./pay.status'),

    // 支付方式
    PaymentMethods: require('./payment.methods'),
}

