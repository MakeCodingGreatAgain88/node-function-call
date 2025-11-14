/**
 * @name: index
 * @author: sand
 * @date: 2025-10-18 22:46
 * @description：统一模型关联
 */
const sequelize = require('@db/seq/index')

// models
const Users = require('@db/seq/models/Users')

// ==============================
// 导出模型
// ==============================
module.exports = {
    sequelize,
    Users
}