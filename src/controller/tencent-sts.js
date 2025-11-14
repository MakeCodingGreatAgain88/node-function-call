/**
 * @name: sts
 * @author: sand
 * @date: 2025-10-22 13:49
 * @description：sts
 * @update: 2025-10-22 13:49
 */

const service = require('@/service/tencent-sts')

class TencentStsController {
    /**
     * 获取临时密钥
     * @param ctx
     * @param next
     * @return {Promise<void>}
     */
    async getKey(ctx, next) {
        try {
            const res = await service.getKey()
            ctx.body = {
                code: 200,
                data: res,
                message: 'success'
            }
        }
        catch (e) {
            ctx.app.emit('error', e, ctx)
        }
    }
}

module.exports = new TencentStsController()
