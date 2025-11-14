/**
 * @name: index
 * @author: sand
 * @date: 2025-10-16 12:09
 * @description：index
 * @update: 2023/12/12 01:16
 */

const {Sequelize} = require('sequelize')
const {
    MYSQL_PORT,
    MYSQL_HOST,
    MYSQL_ACCOUNT,
    MYSQL_PASSWORD,
    MYSQL_DATABASE
} = require('@config/env.config')

const sequelize = new Sequelize(MYSQL_DATABASE, MYSQL_ACCOUNT, MYSQL_PASSWORD, {
    port: MYSQL_PORT,
    host: MYSQL_HOST,
    dialect: 'mysql', // 或者其它数据库类型
    timezone: '+08:00', // 表示使用东八区的时区
    logging: false, // 禁用日志输出
    dialectOptions: {
        // 设置数据库连接的字符集
        charset: 'utf8mb4_0900_ai_ci',
        // 如果设置为 true，将所有日期类型的数据以字符串的形式返回，而不是 JavaScript 的日期对象。
        dateStrings: true,
        // 如果设置为 true，将会对查询结果进行类型转换，将字符串类型的日期转换为 JavaScript 的日期对象。
        typeCast: true
    }
})

// 在这里做一些其它操作，比如建立关联、定义模型方法等

module.exports = sequelize
