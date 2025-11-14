const Router = require('koa-router')
const router = new Router()
const wechat = require('./module/wechat')
const aliOss = require('./module/ali-oss')
const aliSms = require('./module/ali-sms')
const tencentSts = require('./module/tencent-sts')

// 在路由之前添加错误处理中间件
router.use(async (ctx, next) => {
    try {
        await next()
    }
    catch (err) {
        console.log('最外层错误捕获！！！', err)
        // 抛出错误，会被顶层的错误处理中间件捕获
        throw err
    }
})

router.all('/', async (ctx) => {
    ctx.body = 'hello node service'
})

router.use(wechat.routes(), wechat.allowedMethods()).
    use(aliOss.routes(), aliOss.allowedMethods()).
    use(aliSms.routes(), aliSms.allowedMethods()).
    use(tencentSts.routes(), tencentSts.allowedMethods())

module.exports = router

