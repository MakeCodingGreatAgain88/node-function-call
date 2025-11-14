/**
 * @name: tencent-sts
 * @author: sand
 * @date: 2025-10-22 13:47
 * @description：tencent-sts
 * @update: 2025-10-22 13:47
 */

const Router = require('koa-router')
const {
    getKey
} = require('@controller/tencent-sts')

const router = new Router({
    prefix: '/tencent-sts'
})

/**
 * 获取客户端临时密钥
 */
router.get('/getKey', getKey)

module.exports = router
