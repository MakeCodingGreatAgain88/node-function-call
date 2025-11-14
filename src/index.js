const app = require('./app')
const { APP_PORT } = require('@config/env.config')

app.listen(APP_PORT, () => {
    console.log(`Koa start at http://127.0.0.1:${APP_PORT}`)
})

