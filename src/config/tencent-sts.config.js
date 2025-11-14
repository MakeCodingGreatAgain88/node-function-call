/**
 * @name: sts.config
 * @author: sand
 * @date: 2025-10-22 13:53
 * @description：sts.config
 * @update: 2025-10-22 13:53
 */
const {
    TENCENT_SECRET_ID,
    TENCENT_SECRET_KEY
} = require('@config/env.config')

module.exports = {
    secretId: TENCENT_SECRET_ID, // 固定密钥
    secretKey: TENCENT_SECRET_KEY, // 固定密钥
    proxy: '',
    durationSeconds: 1800,
    // host: 'sts.tencentcloudapi.com', // 域名，非必须，默认为 sts.tencentcloudapi.com
    endpoint: 'sts.tencentcloudapi.com', // 域名，非必须，与host二选一，默认为 sts.tencentcloudapi.com

    // 放行判断相关参数
    bucket: 'bucket-name',
    region: 'ap-chengdu',
    allowPrefix: [
        'ad/*',       // 允许ad目录下所有文件
        'product/*',   // 允许product目录下所有文件
    ],
    // 这里改成允许的路径前缀，可以根据自己网站的用户登录态判断允许上传的具体路径，例子： a.jpg 或者 a/* 或者 * (使用通配符*存在重大安全风险, 请谨慎评估使用)
    // 简单上传和分片，需要以下的权限，其他权限列表请看 https://cloud.tencent.com/document/product/436/31923
    allowActions: [
        // 简单上传
        'name/cos:PutObject',
        'name/cos:PostObject',
        // 分片上传
        'name/cos:InitiateMultipartUpload',
        'name/cos:ListMultipartUploads',
        'name/cos:ListParts',
        'name/cos:UploadPart',
        'name/cos:CompleteMultipartUpload'
    ]
}