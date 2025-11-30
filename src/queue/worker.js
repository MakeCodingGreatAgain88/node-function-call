/**
 * @name: worker
 * @author: sand
 * @date: 2025-12-XX
 * @description：队列 Worker 启动文件（用于 PM2）
 * @update: 2025-12-XX
 */

// 注册路径别名（必须在其他 require 之前）
require('module-alias/register')

// 加载模型关联关系（必须在其他模块之前加载，确保 Sequelize 关联关系正确初始化）
require('@db/seq/models/index')

// 引入订单关闭队列，队列的 process 方法会自动启动处理任务
require('./orderCloseQueue')

// todo 此队列需要单独启动
console.log('[队列 Worker] 订单关闭队列 Worker 已启动')
console.log('[队列 Worker] 订单待服务队列 Worker 已启动')

