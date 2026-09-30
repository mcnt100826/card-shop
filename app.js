const express = require('express')
const app = express()
const port = process.env.PORT || 3000

// 设置模板引擎为ejs
app.set('view engine','ejs')

// 首页路由，渲染商品页面
app.get('/', (req, res) => {
  // 商品，你可以在这里继续加
  const goodsList = [
    {name:"商品A",price:"10元"},
    {name:"商品B",price:"20元"}
  ]
  res.render('index',{goods:goodsList})
})

app.listen(port, () => {
  console.log(`服务启动`)
})


