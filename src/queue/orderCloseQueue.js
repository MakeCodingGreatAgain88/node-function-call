/**
 * @name: orderCloseQueue
 * @author: sand
 * @date: 2025-10-19 19:44
 * @description：订单自动关闭队列
 * @update: 2025-10-19 19:44
 */
const Queue = require('bull')
const wechatService = require('@service/wechat')
const {
    REDIS_HOST,
    REDIS_PORT,
    REDIS_DB
} = require("@config/env.config")

// 创建队列
const orderCloseQueue = new Queue('order-close', {
    redis: {
        host: REDIS_HOST,
        port: REDIS_PORT,
        db: 0
    }
})

// 处理延迟任务
orderCloseQueue.process(async (job) => {
    const {orderId} = job.data
    
    try {
        // 通过 Service 层处理订单自动关闭
        await wechatService.closeOrder(orderId)
    }
    catch (err) {
        console.error(`[订单关闭队列] 关闭订单 ${orderId} 失败:`, err)
        throw err // Bull 会自动重试
    }
})

/**
 * 关闭订单的延迟任务（支付成功后调用）
 * @param {number} orderId - 订单ID
 * @returns {Promise<void>}
 */
async function closeOrderJob(orderId) {
    try {
        // 查找所有待处理的任务
        const jobs = await orderCloseQueue.getJobs(['waiting', 'delayed', 'active'])
        
        // 查找匹配的任务
        const targetJob = jobs.find(job => {
            const data = job.data
            return data.orderId === orderId
        })
        
        if (targetJob) {
            // 移除任务
            await targetJob.remove()
            console.log(`[订单关闭队列] 已关闭订单 ${orderId} 的延迟任务`)
        }
        else {
            console.log(`[订单关闭队列] 未找到订单 ${orderId} 的延迟任务，可能已执行或不存在`)
        }
    }
    catch (error) {
        console.error(`[订单关闭队列] 关闭订单 ${orderId} 的延迟任务失败:`, error)
        // 不抛出错误，避免影响主流程
    }
}

module.exports = orderCloseQueue
module.exports.closeOrderJob = closeOrderJob

