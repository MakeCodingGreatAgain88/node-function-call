/**
 * 订单状态枚举
 * @description 订单状态：1=待支付，2=待服务，3=服务中，4=已完成，5=已取消，6=已退款，7=已评价，8=退款中，9=退款失败
 */
module.exports = {
    /** 待支付 */
    PENDING_PAYMENT: '1',
    /** 待服务 */
    PENDING_SERVICE: '2',
    /** 服务中 */
    IN_SERVICE: '3',
    /** 已完成 */
    COMPLETED: '4',
    /** 已取消 */
    CANCELLED: '5',
    /** 已退款 */
    REFUNDED: '6',
    /** 已评价 */
    COMMENT: '7',
    /** 退款中 */
    REFUNDING: '8',
    /** 退款失败 */
    REFUND_FAILED: '9'
}

