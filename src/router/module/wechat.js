/**
 * @name: wechat
 * @author: sand
 * @date: 2025-10-13 13:36
 * @description：wechat
 * @update: 2025-10-13 13:36
 */

const Router = require('koa-router')
const {validate} = require('@middleware/validate')

const {
    verifyCodeSchema
} = require('@middleware/wechat')
const {
    getOpenId,
    getAccessToken,
    getUserPhoneNumber
} = require('@controller/wechat')

const router = new Router({
    prefix: '/wechat'
})


/**
 * 获取openid
 */
router.post('/getOpenId', validate(verifyCodeSchema), getOpenId)

/**
 * 获取接口调用凭据
 */
router.post('/getAccessToken', getAccessToken)

/**
 * 获取手机号
 */
router.post('/getUserPhoneNumber', validate(verifyCodeSchema), getUserPhoneNumber)


module.exports = router
