/**
 * @name: users
 * @author: sand
 * @date: 2025-10-16 11:49
 * @description：用户
 * @update: 2025-10-16 11:49
 */

const {DataTypes} = require('sequelize')
const sequelize = require('@db/seq/index')

const Users = sequelize.define('Users', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        comment: '主键 ID'
    },
    // 微信 openid，唯一标识用户
    openid: {
        type: DataTypes.STRING(64),
        index: true,
        allowNull: false,
        // unique: true,
        comment: '微信 openid'
    },
    // 昵称
    nickname: {
        type: DataTypes.STRING(50),
        index: true,
        allowNull: false,
        comment: '用户昵称'
    },
    // 头像
    avatar: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: '用户头像'
    },
    // 用户状态：1=正常，2=冻结，3=未授权手机号完成注册，游客模式
    status: {
        type: DataTypes.ENUM('1', '2', '3'),
        allowNull: false,
        defaultValue: '1',
        comment: '用户状态：1=正常，2=冻结，3=未授权手机号完成注册，游客模式'
    },
    // 手机号（加密后）
    phone: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '手机号（加密后）'
    },
    // 手机号后4位（用于搜索，建立索引）
    phoneLastFour: {
        type: DataTypes.STRING(4),
        allowNull: true,
        index: true,
        comment: '手机号后4位（用于搜索）'
    }
}, {
    tableName: 'users', // 映射到的表名
    timestamps: true,   // 自动生成 createdAt / updatedAt
    underscored: true, // 「数据库表字段」用下划线命名，而「模型属性」在 JS 中仍然用小驼峰命名。
    comment: '用户表'
})

module.exports = Users