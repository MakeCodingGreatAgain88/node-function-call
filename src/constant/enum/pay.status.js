/**
 * 支付状态枚举
 * @description 支付状态：0=未支付，1=已支付，2=支付失败，3=已退款，4=退款中，5=退款失败
 */
module.exports = {
    /** 未支付 */
    UNPAID: '0',
    /** 已支付 */
    PAID: '1',
    /** 支付失败 */
    PAYMENT_FAILED: '2',
    /** 已退款 */
    REFUNDED: '3',
    /** 退款中 */
    REFUNDING: '4',
    /** 退款失败 */
    REFUND_FAILED: '5'
}

