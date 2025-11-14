/**
 * @name: error
 * @author: sand
 * @date: 2025-10-14 01:32
 * @description：error
 * @update: 2025-10-14 01:32
 */

module.exports = {
    systemError: {
        code: 500,
        message: '服务器故障'
    },

    createError(code, message, data) {
        return {
            code,
            message,
            data
        }
    }
}
