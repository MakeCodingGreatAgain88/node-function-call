const path = require('path')
const dotenv = require('dotenv')

// 根据 NODE_ENV 决定读取哪个文件
const envFile = process.env.NODE_ENV === 'production'
    ? '.env.production'
    : process.env.NODE_ENV === 'test'
        ? '.env.test'
        : '.env.development'

dotenv.config({path: path.resolve(process.cwd(), envFile)})
module.exports = process.env
