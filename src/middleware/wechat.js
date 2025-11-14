/**
 * @name: wechat
 * @author: sand
 * @date: 2023/12/4 18:41
 * @description：wechat
 * @update: 2023/12/4 18:41
 */

const {
    z,
    zStrictSchema
} = require('@middleware/validate')

/**
 * 效验获取openid数据合法性
 * @param ctx
 * @param next
 * @return {Promise<void>}
 */
const verifyCodeSchema = zStrictSchema({
    code: z.string().min(1, 'code 不能为空')
})

module.exports = {
    verifyCodeSchema
}
