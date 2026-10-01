const express = require('express')
const session = require('express-session')
const app = express()
const port = process.env.PORT || 3000

// 表单解析
app.use(express.urlencoded({extended:true}))
app.set('view engine','ejs')

// 配置session
app.use(session({
  secret: 'my-secret-123456',
  resave: false,
  saveUninitialized: false
}))

// 登录校验中间件
function checkLogin(req,res,next){
  if(req.session.isLogin){
    next()
  }else{
    res.redirect('/admin')
  }
}

// 内存存储订单
let orderList = []
// 内存存储商品【初始两个商品】
let goodsList = [
  {name:"商品A",price:"10元"},
  {name:"商品B",price:"20元"}
]

// 生成订单编号函数 ORD+时间戳+随机4位数字
function createOrderId(){
  const timestamp = Date.now()
  const rand = Math.floor(Math.random()*10000).toString().padStart(4,'0')
  return "ORD" + timestamp + rand
}

// 首页
app.get('/', (req, res) => {
  res.render('index',{goods:goodsList})
})

// 订单查询页面（按订单号查找）
app.get('/search', (req, res) => {
  let result = null
  const searchOrderId = req.query.orderId
  if(searchOrderId){
    const findOrder = orderList.find(item=> item.orderId === searchOrderId)
    if(findOrder){
      if(findOrder.status === "ok"){
        result = {text:`✅订单【${findOrder.orderId}】已审核通过！`, class:"success"}
      }else{
        result = {text:`⏳订单【${findOrder.orderId}】等待管理员审核中，请耐心等待`, class:"pending"}
      }
    }else{
      result = {text:"❌没有找到该订单编号，请核对订单号", class:"none"}
    }
  }
  res.render('search',{result})
})

// 管理员登录页面
app.get('/admin',(req,res)=>{
  res.render('admin')
})

// 登录提交
app.post('/admin',(req,res)=>{
  const {user,pwd} = req.body
  if(user === "admin" && pwd === "123456"){
    req.session.isLogin = true;
    res.redirect('/order-admin')
  }else{
    res.send("<h1>❌账号密码错误</h1><a href='/admin'>重新登录</a>")
  }
})

// 订单管理后台
app.get('/order-admin', checkLogin, (req,res)=>{
  res.render('orderAdmin',{orders:orderList})
})

// ==========【新增商品管理路由】==========
// 商品管理页面
app.get('/goods-admin', checkLogin, (req,res)=>{
  res.render('goodsAdmin',{goodsList})
})
// 添加商品
app.post('/add-goods', checkLogin, (req,res)=>{
  const {name,price} = req.body
  goodsList.push({name,price})
  res.redirect('/goods-admin')
})
// 删除商品
app.post('/del-goods/:idx', checkLogin, (req,res)=>{
  const index = req.params.idx
  goodsList.splice(index,1)
  res.redirect('/goods-admin')
})
// ======================================

// 提交订单接口，自动生成订单号
app.post('/submit-order',(req,res)=>{
  const {goodsName,price} = req.body
  const newOrderId = createOrderId()
  orderList.push({
    goodsName,
    price,
    orderId: newOrderId,
    status:"pending"
  })
  // 提交成功，展示订单号，提醒用户保存
  res.send(`
    <h2>✅订单提交成功！</h2>
    <p style="font-size:20px;color:blue">你的订单编号：<strong>${newOrderId}</strong></p>
    <p>请保存订单编号，用于查询订单审核状态</p>
    <a href='/'>返回首页</a>
  `)
})

// 审核通过接口
app.post('/audit-order/:idx', checkLogin, (req,res)=>{
  const index = req.params.idx
  orderList[index].status = "ok"
  res.redirect('/order-admin')
})

// 删除订单接口
app.post('/del-order/:idx', checkLogin, (req,res)=>{
  const index = req.params.idx
  orderList.splice(index,1)
  res.redirect('/order-admin')
})

// 退出登录
app.get('/logout',(req,res)=>{
  req.session.destroy()
  res.send("<h2>✅已退出登录</h2><a href='/'>返回首页</a>")
})

app.listen(port, () => {
  console.log(`服务启动`)
})
