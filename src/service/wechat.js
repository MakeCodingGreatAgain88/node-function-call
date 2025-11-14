/**
 * @name: wechat
 * @author: sand
 * @date: 2025-10-13 13:36
 * @description：wechat
 * @update: 2025-10-13 13:36
 */
const axios = require('axios')

const {
    WX_APPID,
    WX_SECRET
} = require('@config/env.config')

class WechatService {
    /**
     * 获取openid
     * @param {string} code
     * @return {Promise<String>}
     */
    getOpenId(code) {
        return new Promise(async (resolve, reject) => {
            try {
                // 调用微信接口获取 openid 和 session_key
                const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${ WX_APPID }&secret=${ WX_SECRET }&js_code=${ code }&grant_type=authorization_code`
                const res = await axios.get(url)
                if (res && res?.data?.errcode) {
                    reject(new Error(res?.data?.errmsg || '登录失败'))
                    return
                }

                resolve(res.data)
            }
            catch (error) {
                reject(error)
            }
        })
    }

    /**
     * 获取接口调用凭据
     * @return {Promise<String>}
     */
    getAccessToken() {
        return new Promise(async (resolve, reject) => {
            try {
                // 调用微信接口获取 openid 和 session_key
                const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${ WX_APPID }&secret=${ WX_SECRET }`
                const res = await axios.get(url)
                if (res && res?.data?.errcode) {
                    reject(new Error(res?.data?.errmsg || '获取接口调用凭据失败'))
                    return
                }

                resolve(res.data)
            }
            catch (error) {
                reject(error)
            }
        })
    }

    /**
     * 获取手机号
     * @return {Promise<String>}
     */
    getUserPhoneNumber(params) {
        return new Promise(async (resolve, reject) => {
            try {
                // 调用微信接口获取 openid 和 session_key
                const url = `https://api.weixin.qq.com/wxa/business/getuserphonenumber?access_token=${ params.accessToken }`
                const res = await axios.post(url, {code: params.code})
                if (res && res?.data?.errcode) {
                    reject(new Error(res?.data?.errmsg || '获取手机号失败'))
                    return
                }

                resolve(res.data)
            }
            catch (error) {
                reject(error)
            }
        })
    }
}

module.exports = new WechatService()
