/**
 * @name: index
 * @author: sand
 * @date: 2023/11/18 22:56
 * @description：index
 * @update: 2023/11/18 22:56
 */
const mysql2 = require('mysql2')
const {
    MYSQL_PORT,
    MYSQL_HOST,
    MYSQL_ACCOUNT,
    MYSQL_PASSWORD,
    MYSQL_DATABASE
} = require('@config/env.config')

const pool = mysql2.createPool({
    port: MYSQL_PORT,
    host: MYSQL_HOST,
    user: MYSQL_ACCOUNT,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 5
})

module.exports = pool

/*// 使用 pool.getConnection() 来验证连接
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ MySQL 连接失败:', err.message)
    } else {
        console.log('✅ MySQL 连接成功！')
        // 可执行简单查询测试
        connection.query('SELECT 1 + 1 AS result', (err, results) => {
            if (err) {
                console.error('❌ 查询失败:', err.message)
            } else {
                console.log('查询结果:', results)
            }
            connection.release() // 一定记得释放连接
        })
    }
})*/

/*
             let connection
             try {
                 const { id, status, user_id, message } = param
                 connection = await mysqlPool.promise().getConnection()

                 // 开启事务
                 await connection.beginTransaction()

                 await connection.query('UPDATE tag_audit_list SET status = ? WHERE id = ?', [user_id, id])

                 await connection.query('INSERT INTO tags SET ?', {  status: tagStatus.pending })

                 await connection.commit() // 提交事务
                 resolve(user_id)
             }
             catch (error) {
                 if (connection) {
                     await connection.rollback() // 回滚事务
                     console.error('回滚事务:', error)
                     reject(error) // 如果发生错误，以错误信息拒绝 Promise
                 }
             } finally {
                 if (connection) {
                     connection.release() // 释放连接到连接池
                 }
             }

             return
             */

