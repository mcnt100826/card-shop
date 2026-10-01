const express = require('express')
const app = express()
const port = process.env.PORT || 3000

// 解析表单提交数据
app.use(express.urlencoded({extended:true}))
// 设置模板引擎ejs
app.set('view engine','ejs')

// 首页
app.get('/', (req, res) => {
  const goodsList = [
    {name:"商品A",price:"10元"},
    {name:"商品B",price:"20元"}
  ]
  res.render('index',{goods:goodsList})
})

// 后台登录页面GET访问
app.get('/admin',(req,res)=>{
  res.render('admin')
})

// 处理登录提交（简单演示账号密码 admin / 123456）
app.post('/admin',(req,res)=>{
  const {user,pwd} = req.body
  if(user === "admin" && pwd === "123456"){
    res.send("<h1>✅登录成功！后台管理页面（你可以继续扩展订单列表）</h1><a href='/'>返回首页</a>")
  }else{
    res.send("<h1>❌账号密码错误</h1><a href='/admin'>重新登录</a>")
  }
})

app.listen(port, () => {
  console.log(`服务启动`)
})


