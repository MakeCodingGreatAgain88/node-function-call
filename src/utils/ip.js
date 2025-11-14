/**
 * @name: ip
 * @author: sand
 * @date: 2025-11-14 18:10
 * @description：ip
 * @update: 2025-11-14 18:10
 */
/**
 * 格式化IP
 * @param ip
 * @returns {string}
 */
const getSafeClientIp = (ip) => {
    const rawIp = ip || ''
    const cleanIp = rawIp.replace(/^::ffff:/, '')
    return cleanIp.replace(/:/g, '_')
}

module.exports = {
    getSafeClientIp
}