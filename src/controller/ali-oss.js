/**
 * @name: ali-oss
 * @author: sand
 * @date: 2025-10-13 13:47
 * @description：ali-oss
 * @update: 2025-10-13 13:47
 */

const service = require('@service/ali-oss')

class AliOssController {
    /**
     * 获取临时stsToken
     * @param ctx
     * @param next
     * @return {Promise<void>}
     */
    async getStsToken(ctx, next) {
        try {
            ctx.body = await service.getStsToken()
        }
        catch (e) {
            ctx.app.emit('error', e, ctx)
        }
    }

    /**
     * 获取临时访问资源url
     * @param ctx
     * @param next
     * @return {Promise<void>}
     */
    async getSignatureUrl(ctx, next) {
        try {
            const {url} = ctx.validated || {}
            ctx.body = await service.getSignatureUrl(url)
        }
        catch (e) {
            ctx.app.emit('error', e, ctx)
        }
    }
}

module.exports = new AliOssController()
