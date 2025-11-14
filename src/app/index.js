require('module-alias/register')

const Path = require('path')
const Koa = require('koa')
const Cors = require('koa2-cors')
const Static = require('koa-static')
const Mount = require('koa-mount')
const Body = require('koa-body')
const Router = require('@router/index')
const app = new Koa()

app.use(Mount('/static', Static(Path.join(__dirname, '../public'))))
app.use(Body.koaBody())
app.use(Cors())
app.use(Router.routes()).use(Router.allowedMethods())

// onerror和处理中间件选其一就可，如果都设置处理中间件会先处理，onerror不会触发，除非   ctx.app.emit('error', err, ctx)
// 请求级别的错误处理
app.on('error', (e, ctx) => {
    // 错误日志写入....

    ctx.body = {
        code: e?.code || 500,
        message: e.message
    }
})

module.exports = app
