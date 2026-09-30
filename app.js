const express = require('express');
const ejs = require('ejs');
const app = express();
const port = process.env.PORT || 3000;

// 模板引擎
app.set('view engine','ejs');
app.set('views','./views');

// 解析表单
app.use(express.urlencoded({extended:true}));

// 模拟订单数据
let orders = [
  {id:1,goodsId:101,status:"已完成"},
  {id:2,goodsId:102,status:"待发货"}
]

// 首页
app.get('/',(req,res)=>{
  res.render('index');
})

// 登录页
app.get('/login',(req,res)=>{
  res.render('login');
})

// 后台订单页面
app.get('/dashboard',(req,res)=>{
  res.render('dashboard',{orders:orders});
})

app.listen(port,()=>{
  console.log(`服务启动，端口${port}`);
})
