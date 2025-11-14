/**
 * @name: ali-oss
 * @author: sand
 * @date: 2025-11-14
 * @description：ali-oss
 * @update: 2025-11-14
 */

const {
    z,
    zStrictSchema
} = require('@middleware/validate')

/**
 * 验证 OSS 资源 URL Schema
 */
const urlSchema = zStrictSchema({
    url: z.string().min(1, 'url 不能为空')
})

module.exports = {
    urlSchema
}

