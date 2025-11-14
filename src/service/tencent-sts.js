/**
 * @name: tencent-sts
 * @author: sand
 * @date: 2025-10-22 13:46
 * @description：tencent-sts
 * @update: 2025-10-22 13:46
 */

const STS = require('@sdk/tencent-sts')
const config = require('@config/tencent-sts.config')

class TencentStsService {
    /**
     * 获取临时密钥
     * @returns {Promise<void>}
     */
    getKey() {
        return new Promise((resolve, reject) => {
            const shortBucketName = config.bucket.substr(0, config.bucket.lastIndexOf('-'))
            const appId = config.bucket.substr(1 + config.bucket.lastIndexOf('-'))
            const policy = {
                'version': '2.0',
                'statement': [ {
                    'action': config.allowActions,
                    'effect': 'allow',
                    'principal': {'qcs': [ '*' ]},
                    'resource': config.allowPrefix.map(item=>{
                        return 'qcs::cos:' + config.region + ':uid/' + appId + ':prefix//' + appId + '/' + shortBucketName + '/' + item
                    })
                    // condition生效条件，关于 condition 的详细设置规则和COS支持的condition类型可以参考https://cloud.tencent.com/document/product/436/71306
                    // 'condition': {
                    //   // 比如限定ip访问
                    //   'ip_equal': {
                    //     'qcs:ip': '10.121.2.10/24'
                    //   }
                    // }
                } ]
            }

            STS.getCredential({
                secretId: config.secretId,
                secretKey: config.secretKey,
                proxy: config.proxy,
                durationSeconds: config.durationSeconds,
                endpoint: config.endpoint,
                policy: policy
            }, function (err, tempKeys) {
                err ? reject(err) : resolve(tempKeys)
            })
        })
    }
}

module.exports = new TencentStsService()
