/**
 * @name: ali-oss
 * @author: sand
 * @date: 2025-11-14 17:43
 * @description：ali-oss
 * @update: 2025-11-14 17:43
 */

const OSS = require('ali-oss')
const {
    ALI_OSS_REGION,
    ALI_OSS_BUCKET,
    ALI_STS_ACS_RAM,
    ALI_STS_EXPIRATION,
    ALI_STS_ACCESS_KEY_ID,
    ALI_STS_ACCESS_KEY_SECRET
} = require('@config/env.config')

class SystemOssService {
    /**
     * 获取临时stsToken
     * @return {Promise<Object>}
     */
    getStsToken() {
        return new Promise(async (resolve, reject) => {
            try {
                let sts = new OSS.STS({
                    accessKeyId: ALI_STS_ACCESS_KEY_ID,
                    accessKeySecret: ALI_STS_ACCESS_KEY_SECRET
                })
                // roleArn填写步骤2获取的角色ARN，例如acs:ram::175708322470****:role/ramtest。
                // policy填写自定义权限策略，用于进一步限制STS临时访问凭证的权限。如果不指定Policy，则返回的STS临时访问凭证默认拥有指定角色的所有权限。
                // 临时访问凭证最后获得的权限是步骤4设置的角色权限和该Policy设置权限的交集。
                // expiration用于设置临时访问凭证有效时间单位为秒，最小值为900，最大值以当前角色设定的最大会话时间为准。本示例指定有效时间为3000秒。
                // sessionName用于自定义角色会话名称，用来区分不同的令牌，例如填写为sessiontest。
                const result = await sts.assumeRole(ALI_STS_ACS_RAM, ``, ALI_STS_EXPIRATION, 'session-sts-workergrandpa')
                resolve({
                    code: 200,
                    data: {
                        AccessKeyId: result.credentials.AccessKeyId,
                        AccessKeySecret: result.credentials.AccessKeySecret,
                        SecurityToken: result.credentials.SecurityToken,
                        Expiration: result.credentials.Expiration
                    },
                    message: 'success'
                })
            }
            catch (e) {
                reject(e)
            }
        })
    }

    /**
     * 获取临时访问资源url
     * @return {Promise<Object>}
     */
    getSignatureUrl(objectKey) {
        return new Promise(async (resolve, reject) => {
            try {
                let client = new OSS({
                    region: ALI_OSS_REGION,
                    bucket: ALI_OSS_BUCKET,
                    accessKeyId: ALI_STS_ACCESS_KEY_ID,
                    accessKeySecret: ALI_STS_ACCESS_KEY_SECRET
                })

                const url = await client.signatureUrl(objectKey, {
                    expires: 300,
                    process:'style/watermark'
                })
                resolve({
                    code: 200,
                    data: url,
                    message: 'success'
                })
            }
            catch (e) {
                reject(e)
            }
        })
    }
}

module.exports = new SystemOssService()
