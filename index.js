const express = require('express');
const ejs = require('ejs');
const multer = require('multer');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

//模板引擎
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));

//数据库
const db = new sqlite3.Database('./shop.db');
db.serialize(()=>{
  db.run(`CREATE TABLE IF NOT EXISTS goods(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    price TEXT,
    desc TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS orders(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    goodsId INTEGER,
    payImg TEXT,
    status TEXT DEFAULT 'pending'
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS admin(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pwd TEXT
  )`);
  db.get("SELECT * FROM admin",(err,row)=>{
    if(!row){
      const hash = bcrypt.hashSync("123456",10);
      db.run(`INSERT INTO admin(pwd) VALUES(?)`,hash);
    }
  })
})

//首页
app.get('/',(req,res)=>{
  db.all("SELECT * FROM goods",(err,goods)=>{
    res.render('index',{goods})
  })
})

//管理员登录
app.get('/admin',(req,res)=>res.render('login'))
app.post('/admin/login',(req,res)=>{
  const {pwd} = req.body;
  db.get("SELECT pwd FROM admin",(err,row)=>{
    if(bcrypt.compareSync(pwd,row.pwd)){
      req.session = {isAdmin:true};
      res.redirect('/admin/dashboard')
    }else{
      res.send('密码错误 <a href="/admin">返回</a>')
    }
  })
})

//订单提交
const upload = multer({dest:'public/upload/'})
app.post('/buy',upload.single('payimg'),(req,res)=>{
  const {goodsId} = req.body;
  const payImg = req.file.path;
  db.run("INSERT INTO orders(goodsId,payImg) VALUES(?,?)",[goodsId,payImg],()=>{
    res.send("提交成功，等待商家审核");
  })
})

app.listen(PORT,()=>{
  console.log(`running at port ${PORT}`)
})
