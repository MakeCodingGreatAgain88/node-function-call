/**
 * @name: script
 * @author: sand
 * @date: 2025-10-16 12:09
 * @description:
 * @update: 2025-10-16 12:09
 */

const {sequelize,Users} = require('@db/seq/models')

;(async () => {
    try {
        // 同步所有模型
        // { force: true } 会强制重建表（清空数据），alter 只会修改表结构
        await sequelize.sync({
            alter: true, // 根据模型自动调整表结构（推荐开发阶段）
            // force: true,
            /*force: true, // 强制重建表（危险，会删除表中所有数据）
             logging: console.log, // 打印同步时的 SQL 语句
             match: /_test$/ // 仅匹配数据库名符合正则的才同步*/
        })
        console.log('✅ 数据库表结构同步成功')
    }
    catch (error) {
        console.error('❌ 同步失败:', error)
    }
    finally {
        await sequelize.close() // 关闭连接
    }
})()