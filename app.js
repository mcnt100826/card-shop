const express = require('express')
const app = express()
const port = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.send('Hello World！网站正常运行')
})

app.listen(port, () => {
  console.log(`服务启动`)
})

