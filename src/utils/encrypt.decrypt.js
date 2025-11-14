/**
 * @name: encrypt.decrypt
 * @author: sand
 * @date: 2025-11-14 17:56
 * @description：encrypt.decrypt
 * @update: 2025-11-14 17:56
 */

const crypto = require('crypto')
const {
    ENCRYPT_PHONE_SECRET_KEY,
    ENCRYPT_AGAIN_SECRET
} = require('@config/env.config')

// 将原始密钥转换为符合要求的长度
function generateValidKey(key) {
    const validLength = 32 // AES-256-CBC 的密钥长度为 32 字节
    const sha256 = crypto.createHash('sha256').update(key).digest('base64').substr(0, validLength)
    const keyBuffer = Buffer.alloc(validLength)
    keyBuffer.write(sha256, 'utf-8')
    return keyBuffer
}

module.exports = {
    /**
     * 加密手机号
     * @param text
     * @return {string}
     */
    encryptPhone(text) {
        const cipher = crypto.createCipheriv('aes-256-cbc', generateValidKey(ENCRYPT_PHONE_SECRET_KEY), Buffer.alloc(16))
        let encrypted = cipher.update(String(text), 'utf8', 'hex')
        encrypted += cipher.final('hex')
        return encrypted
    },

    /**
     * 解密手机号
     * @param encryptedText
     * @return {string}
     */
    decryptPhone(encryptedText) {
        const decipher = crypto.createDecipheriv('aes-256-cbc', generateValidKey(ENCRYPT_PHONE_SECRET_KEY), Buffer.alloc(16))
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8')
        decrypted += decipher.final('utf8')
        return decrypted
    },

    /**
     * 全局通用再次加密
     * @param text
     * @return {string}
     */
    encryptCommonAgain(text) {
        const cipher = crypto.createCipheriv('aes-256-cbc', generateValidKey(ENCRYPT_AGAIN_SECRET), Buffer.alloc(16))
        let encrypted = cipher.update(String(text), 'utf8', 'hex')
        encrypted += cipher.final('hex')
        return encrypted
    },

    /**
     * 全局通用再次解密
     * @param encryptedText
     * @return {string}
     */
    decryptCommonAgain(encryptedText) {
        const decipher = crypto.createDecipheriv('aes-256-cbc', generateValidKey(ENCRYPT_AGAIN_SECRET), Buffer.alloc(16))
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8')
        decrypted += decipher.final('utf8')
        return decrypted
    }
}
