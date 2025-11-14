/**
 * @name: validate
 * @author: sand
 * @date: 2025-10-13 14:03
 * @description：validate
 * @update: 2025-10-13 14:03
 */
const {z} = require('zod')

/**
 * 校验
 * @param schema
 * @param type {string | 'body' | 'query' | 'params'}
 * @returns {(function(*, *): Promise<void>)|*}
 */
function validate(schema, type = 'body') {
    return async (ctx, next) => {
        try {
            const data = ctx.request[type] || {}
            const result = schema.safeParse(data)
            if (!result.success) {
                const formattedErrors = JSON.parse(result.error?.message).map(err => ({
                    field: err.path.join('.'),
                    message: err.message,
                    code: err.code
                }))

                ctx.status = 400
                ctx.body = {
                    code: 400,
                    message: '参数验证失败',
                    errors: formattedErrors
                }
                return
            }

            // 校验成功后，把解析好的数据挂载到 ctx
            ctx.validated = result.data
            await next()
        }
        catch (err) {
            ctx.status = 500
            ctx.body = {
                code: 500,
                message: '服务器错误',
                error: err.message
            }
        }
    }
}

/**
 * 允许额外字段存在（不会报错，也不会被删除）。
 * @param obj
 * @returns {ZodObject<Writeable<Partial<Record<never, SomeType>>>, $catchall<ZodAny>>}
 */
function zAnySchema(obj) {
    return z.object(obj).catchall(z.any())
}

/**
 * 严格模式
 * @param obj  strict模式 遇到多余字段直接报错
 * @returns {ZodObject<Writeable<Partial<Record<never, SomeType>>>, $strict>}
 */
function zStrictSchema(obj) {
    return z.object(obj).strict()
}

module.exports = {
    z,
    validate,
    zAnySchema,
    zStrictSchema
}