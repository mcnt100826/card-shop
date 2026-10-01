const express = require('express')
const app = express()
const port = process.env.PORT || 3000

// 表单解析
app.use(express.urlencoded({extended:true}))
app.set('view engine','ejs')

// 内存存储订单
let orderList = []

// 首页
app.get('/', (req, res) => {
  const goodsList = [
    {name:"商品A",price:"10元"},
    {name:"商品B",price:"20元"}
  ]
  res.render('index',{goods:goodsList})
})

// 管理员登录页面
app.get('/admin',(req,res)=>{
  res.render('admin')
})

// 登录提交
app.post('/admin',(req,res)=>{
  const {user,pwd} = req.body
  if(user === "admin" && pwd === "123456"){
    res.redirect('/order-admin')
  }else{
    res.send("<h1>❌账号密码错误</h1><a href='/admin'>重新登录</a>")
  }
})

// 订单管理后台页面
app.get('/order-admin',(req,res)=>{
  res.render('orderAdmin',{orders:orderList})
})

// 提交订单接口，默认状态待审核 pending
app.post('/submit-order',(req,res)=>{
  const {goodsName,price} = req.body
  orderList.push({goodsName,price, status:"pending"})
  res.send("<h2>✅订单提交成功！等待管理员审核</h2><a href='/'>返回首页</a>")
})

// 【新增】审核通过接口
app.post('/audit-order/:idx',(req,res)=>{
  const index = req.params.idx
  orderList[index].status = "ok"
  res.redirect('/order-admin')
})

// 删除订单接口
app.post('/del-order/:idx',(req,res)=>{
  const index = req.params.idx
  orderList.splice(index,1)
  res.redirect('/order-admin')
})

app.listen(port, () => {
  console.log(`服务启动`)
})
