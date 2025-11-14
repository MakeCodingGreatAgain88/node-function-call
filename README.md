# Node Function Call

一个基于 Koa 的 Node.js 各类方法示例工程，提供常用功能的代码实现示例和最佳实践。本项目旨在收集和整理各种实用的 Node.js 代码片段，方便学习和参考。

## 项目定位

这是一个**代码示例集合**项目，采用标准的 MVC 架构，提供各种常用功能的完整实现示例。你可以：

- 📚 学习 Node.js 后端开发的最佳实践
- 🔍 查找特定功能的实现代码
- 🚀 作为新项目的脚手架和参考模板
- 💡 了解常见业务场景的解决方案

## 当前包含的示例

### 微信相关
- ✅ **获取微信 OpenID** - 通过微信小程序 code 获取用户的 openid 和 session_key
- ✅ **获取接口调用凭证** - 获取微信接口调用的 access_token
- ✅ **获取用户手机号** - 通过 code 和 access_token 获取用户手机号信息

### 阿里云 OSS 相关
- ✅ **获取临时 STS Token** - 获取阿里云 OSS 的临时访问凭证（STS Token）
- ✅ **获取临时访问资源 URL** - 生成 OSS 资源的临时访问签名 URL

### 阿里云 SMS 相关
- ✅ **发送短信验证码** - 发送短信验证码，包含发送频率限制、IP 限制等安全机制

### 腾讯云 COS 相关
- ✅ **获取客户端临时密钥** - 获取腾讯云 COS 的临时访问密钥（STS）

> 💡 更多示例正在持续添加中...

## 技术栈

- **框架**: Koa 3.x
- **路由**: koa-router
- **HTTP 客户端**: axios
- **参数验证**: zod
- **环境变量**: dotenv
- **路径别名**: module-alias
- **跨域**: koa2-cors
- **静态文件**: koa-static

## 快速开始

### 安装依赖

```bash
npm install
```

### 环境配置

在项目根目录创建环境配置文件：

**`.env.development`** (开发环境)
```env
APP_PORT=3000
NODE_ENV=development

# 微信相关配置（如使用微信示例）
WX_APPID=your_wechat_appid
WX_SECRET=your_wechat_secret

# 阿里云 OSS 相关配置（如使用 OSS 示例）
ALI_OSS_REGION=your_oss_region
ALI_OSS_BUCKET=your_oss_bucket
ALI_STS_ACS_RAM=your_ram_role_arn
ALI_STS_EXPIRATION=3600
ALI_STS_ACCESS_KEY_ID=your_access_key_id
ALI_STS_ACCESS_KEY_SECRET=your_access_key_secret

# 阿里云 SMS 相关配置（如使用 SMS 示例）
ALI_STS_ACCESS_KEY_ID=your_sms_access_key_id
ALI_STS_ACCESS_KEY_SECRET=your_sms_access_key_secret

# 腾讯云 COS 相关配置（如使用 COS 示例）
# 配置在 src/config/tencent-sts.config.js 中
```

**`.env.production`** (生产环境)
```env
APP_PORT=3000
NODE_ENV=production

# 微信相关配置（如使用微信示例）
WX_APPID=your_wechat_appid
WX_SECRET=your_wechat_secret

# 阿里云 OSS 相关配置（如使用 OSS 示例）
ALI_OSS_REGION=your_oss_region
ALI_OSS_BUCKET=your_oss_bucket
ALI_STS_ACS_RAM=your_ram_role_arn
ALI_STS_EXPIRATION=3600
ALI_STS_ACCESS_KEY_ID=your_access_key_id
ALI_STS_ACCESS_KEY_SECRET=your_access_key_secret

# 阿里云 SMS 相关配置（如使用 SMS 示例）
ALI_STS_ACCESS_KEY_ID=your_sms_access_key_id
ALI_STS_ACCESS_KEY_SECRET=your_sms_access_key_secret

# 腾讯云 COS 相关配置（如使用 COS 示例）
# 配置在 src/config/tencent-sts.config.js 中
```

**`.env.test`** (测试环境)
```env
APP_PORT=3000
NODE_ENV=test

# 微信相关配置（如使用微信示例）
WX_APPID=your_wechat_appid
WX_SECRET=your_wechat_secret

# 阿里云 OSS 相关配置（如使用 OSS 示例）
ALI_OSS_REGION=your_oss_region
ALI_OSS_BUCKET=your_oss_bucket
ALI_STS_ACS_RAM=your_ram_role_arn
ALI_STS_EXPIRATION=3600
ALI_STS_ACCESS_KEY_ID=your_access_key_id
ALI_STS_ACCESS_KEY_SECRET=your_access_key_secret

# 阿里云 SMS 相关配置（如使用 SMS 示例）
ALI_STS_ACCESS_KEY_ID=your_sms_access_key_id
ALI_STS_ACCESS_KEY_SECRET=your_sms_access_key_secret

# 腾讯云 COS 相关配置（如使用 COS 示例）
# 配置在 src/config/tencent-sts.config.js 中
```

### 运行项目

```bash
npm start
```

服务将在 `http://127.0.0.1:3000` 启动（端口可在环境变量中配置）

## API 文档

### 基础路径

所有 API 的基础路径为：`http://127.0.0.1:3000`

### 微信相关接口

#### 1. 获取微信 OpenID

通过微信小程序登录时获取的 code 换取用户的 openid 和 session_key。

**接口地址**: `POST /wechat/getOpenId`

**请求参数**:
```json
{
  "code": "微信小程序登录时获取的 code"
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "openid": "用户的 openid",
    "session_key": "会话密钥",
    "unionid": "用户的 unionid（如果存在）"
  }
}
```

#### 2. 获取接口调用凭证

获取微信接口调用的 access_token，用于调用需要认证的微信接口。

**接口地址**: `POST /wechat/getAccessToken`

**请求参数**: 无

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "access_token": "接口调用凭证",
    "expires_in": 7200
  }
}
```

**说明**: 
- access_token 有效期为 7200 秒（2小时）
- 建议在生产环境中实现缓存机制，避免频繁调用

#### 3. 获取用户手机号

通过微信小程序获取用户手机号。

**接口地址**: `POST /wechat/getUserPhoneNumber`

**请求参数**:
```json
{
  "code": "微信小程序获取手机号时返回的 code"
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "errcode": 0,
    "errmsg": "ok",
    "phone_info": {
      "phoneNumber": "用户手机号",
      "purePhoneNumber": "不带区号的手机号",
      "countryCode": "区号",
      "watermark": {
        "timestamp": 时间戳,
        "appid": "小程序 appid"
      }
    }
  }
}
```

**说明**: 
- 此接口内部会自动获取 access_token，无需手动传递
- code 需要通过微信小程序端的 `<button open-type="getPhoneNumber">` 获取

### 阿里云 OSS 相关接口

#### 1. 获取临时 STS Token

获取阿里云 OSS 的临时访问凭证，用于客户端直接上传文件到 OSS。

**接口地址**: `GET /ali-oss/stsToken`

**请求参数**: 无

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "AccessKeyId": "临时访问密钥 ID",
    "AccessKeySecret": "临时访问密钥 Secret",
    "SecurityToken": "安全令牌",
    "Expiration": "过期时间"
  }
}
```

**说明**: 
- 返回的临时凭证具有时效性，需要在过期前使用
- 建议在生产环境中实现缓存机制，避免频繁调用

#### 2. 获取临时访问资源 URL

生成 OSS 资源的临时访问签名 URL，用于临时访问私有资源。

**接口地址**: `GET /ali-oss/signatureUrl`

**请求参数**:
- `url` (query): OSS 资源的 objectKey（文件路径）

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": "https://bucket.oss-region.aliyuncs.com/path/to/file?Expires=xxx&OSSAccessKeyId=xxx&Signature=xxx"
}
```

**说明**: 
- URL 默认有效期为 300 秒（5分钟）
- 可用于临时访问私有 OSS 资源

### 阿里云 SMS 相关接口

#### 1. 发送短信验证码

发送短信验证码，包含完整的防刷机制。

**接口地址**: `POST /ali-sms/sendSms`

**请求参数**:
```json
{
  "phone": "13800138000"
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "verificationCode": "123456"
  }
}
```

**安全机制**:
- ✅ 手机号格式验证（11位有效手机号）
- ✅ 同一手机号 24 小时内最多发送 5 次
- ✅ 同一 IP 24 小时内最多发送 10 次
- ✅ 同一手机号发送间隔至少 90 秒

**说明**: 
- 验证码会发送到指定手机号
- 建议在生产环境中将验证码存储到 Redis 等缓存中，并设置过期时间

### 腾讯云 COS 相关接口

#### 1. 获取客户端临时密钥

获取腾讯云 COS 的临时访问密钥，用于客户端直接上传文件到 COS。

**接口地址**: `GET /tencent-sts/getKey`

**请求参数**: 无

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "credentials": {
      "tmpSecretId": "临时密钥 ID",
      "tmpSecretKey": "临时密钥 Key",
      "sessionToken": "会话令牌"
    },
    "expiredTime": 过期时间戳,
    "expiration": "过期时间字符串",
    "startTime": 开始时间戳
  }
}
```

**说明**: 
- 返回的临时密钥具有时效性，需要在过期前使用
- 密钥权限由服务端配置的策略决定
- 建议在生产环境中实现缓存机制，避免频繁调用

## 项目结构

```
node-function-call/
├── src/
│   ├── app/              # Koa 应用配置
│   │   └── index.js      # 应用入口，中间件配置
│   ├── config/           # 配置文件
│   │   └── env.config.js # 环境变量配置
│   ├── controller/       # 控制器层
│   │   ├── wechat.js     # 微信相关控制器
│   │   ├── ali-oss.js    # 阿里云 OSS 相关控制器
│   │   ├── ali-sms.js    # 阿里云 SMS 相关控制器
│   │   └── tencent-sts.js # 腾讯云 STS 相关控制器
│   ├── middleware/       # 中间件
│   │   ├── validate.js   # 参数验证中间件
│   │   ├── wechat.js     # 微信相关验证规则
│   │   └── ali-sms.js   # 阿里云 SMS 相关验证规则和中间件
│   ├── router/           # 路由配置
│   │   ├── index.js      # 路由入口
│   │   └── module/       # 模块路由
│   │       ├── wechat.js # 微信路由
│   │       ├── ali-oss.js # 阿里云 OSS 路由
│   │       ├── ali-sms.js # 阿里云 SMS 路由
│   │       └── tencent-sts.js # 腾讯云 STS 路由
│   ├── service/          # 服务层
│   │   ├── wechat.js     # 微信相关服务
│   │   ├── ali-oss.js    # 阿里云 OSS 相关服务
│   │   ├── ali-sms.js    # 阿里云 SMS 相关服务
│   │   └── tencent-sts.js # 腾讯云 STS 相关服务
│   ├── config/           # 配置文件
│   │   ├── env.config.js # 环境变量配置
│   │   └── tencent-sts.config.js # 腾讯云 STS 配置
│   ├── sdk/              # 第三方 SDK
│   │   └── tencent-sts.js # 腾讯云 STS SDK
│   ├── public/           # 静态资源目录
│   └── index.js          # 应用启动入口
├── package.json          # 项目配置
├── jsconfig.json         # JavaScript 配置
└── README.md            # 项目文档
```

## 路径别名配置

项目使用 `module-alias` 配置了路径别名，方便导入模块：

- `@` → `src`
- `@config` → `src/config`
- `@controller` → `src/controller`
- `@middleware` → `src/middleware`
- `@router` → `src/router`
- `@service` → `src/service`

## 错误处理

项目实现了统一的错误处理机制：

1. **参数验证错误**: 返回 400 状态码，包含详细的错误信息
2. **业务逻辑错误**: 通过 `ctx.app.emit('error', e, ctx)` 触发全局错误处理
3. **全局错误处理**: 在 `app/index.js` 中统一处理，返回标准格式的错误响应

**错误响应格式**:
```json
{
  "code": 400,
  "message": "参数验证失败",
  "errors": [
    {
      "field": "code",
      "message": "code 不能为空",
      "code": "too_small"
    }
  ]
}
```

或

```json
{
  "code": 500,
  "message": "错误信息"
}
```

## 如何添加新的代码示例

### 步骤 1: 创建服务层

在 `src/service/` 目录下创建对应的服务文件，实现业务逻辑：

```javascript
// src/service/example.js
const axios = require('axios')

class ExampleService {
    async someMethod(params) {
        // 实现具体业务逻辑
        return result
    }
}

module.exports = new ExampleService()
```

### 步骤 2: 创建控制器

在 `src/controller/` 目录下创建对应的控制器文件：

```javascript
// src/controller/example.js
const service = require('@service/example')

class ExampleController {
    async someMethod(ctx, next) {
        try {
            const { param } = ctx.validated || {}
            const result = await service.someMethod(param)
            ctx.body = {
                code: 200,
                data: result,
                message: 'success'
            }
        } catch (e) {
            ctx.app.emit('error', e, ctx)
        }
    }
}

module.exports = new ExampleController()
```

### 步骤 3: 定义验证规则（如需要）

在 `src/middleware/` 目录下创建验证规则：

```javascript
// src/middleware/example.js
const { z, zStrictSchema } = require('@middleware/validate')

const exampleSchema = zStrictSchema({
    param: z.string().min(1, 'param 不能为空')
})

module.exports = {
    exampleSchema
}
```

### 步骤 4: 注册路由

在 `src/router/module/` 目录下创建路由文件：

```javascript
// src/router/module/example.js
const Router = require('koa-router')
const { validate } = require('@middleware/validate')
const { exampleSchema } = require('@middleware/example')
const { someMethod } = require('@controller/example')

const router = new Router({
    prefix: '/example'
})

router.post('/someMethod', validate(exampleSchema), someMethod)

module.exports = router
```

### 步骤 5: 在主路由中引入

在 `src/router/index.js` 中引入新路由：

```javascript
const example = require('./module/example')
router.use(example.routes(), example.allowedMethods())
```

## 参数验证

使用 Zod 进行参数验证，支持两种模式：

- **严格模式** (`zStrictSchema`): 不允许额外字段
- **宽松模式** (`zAnySchema`): 允许额外字段存在

示例：
```javascript
const { z, zStrictSchema } = require('@middleware/validate')

// 严格模式
const strictSchema = zStrictSchema({
    code: z.string().min(1, 'code 不能为空')
})

// 宽松模式
const looseSchema = zAnySchema({
    code: z.string().min(1, 'code 不能为空')
})
```

## 贡献指南

欢迎贡献新的代码示例！添加新示例时请遵循以下规范：

1. 保持代码风格一致
2. 添加必要的注释和文档
3. 实现完整的错误处理
4. 使用统一的响应格式
5. 更新本 README 文档，添加新示例的说明

## 注意事项

1. **环境变量**: 根据实际使用的示例功能配置相应的环境变量
2. **安全性**: 不要将敏感信息（如 API Key、Secret）提交到代码仓库
3. **错误处理**: 所有接口都应包含完整的错误处理
4. **代码规范**: 保持代码风格统一，遵循项目现有的代码规范

## License

ISC

## 作者

sand
