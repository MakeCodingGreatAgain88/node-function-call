const Router = require('koa-router')
const {validate} = require('@middleware/validate')
const {
    getStsToken,
    getSignatureUrl
} = require('@controller/ali-oss')
const {
    urlSchema
} = require('@middleware/ali-oss')

const router = new Router({
    prefix: '/ali-oss'
})

/**
 * 获取临时stsToken
 */
router.get('/stsToken', getStsToken)

/**
 * 获取临时访问资源url
 */
router.get('/signatureUrl', validate(urlSchema, 'query'), getSignatureUrl)

module.exports = router
