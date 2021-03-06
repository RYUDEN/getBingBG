const express = require('express')  //服务器模块
const fs = require('fs')
const apicache = require("apicache"); // 接口缓存
const moment = require("moment");
const { getPage, getBgImage } = require('./utils/spider')
const { scheduleCronstyle } = require('./getBg')

// const Background = require('./db').Background

const app = express();
const cache = apicache.middleware;
const port = 2345
const TempRes = function(code,msg,data){
    this.code = code
    this.msg  = msg 
    this.data = data
}

app.all("*", function(req, res, next) {
    if (req.path !== "/" && !req.path.includes(".")){
      res.header("Access-Control-Allow-Credentials", true);
      // 这里获取 origin 请求头 而不是用 *
      res.header("Access-Control-Allow-Origin", req.headers["origin"] || "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
      res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
      res.header("Content-Type", "application/json;charset=utf-8");
    }
    next();
});

const onlyStatus200 = (req, res) => res.statusCode === 200;
app.use(cache("300 second", onlyStatus200));

app.get('/', async function(req,res) {
    res.send("<h1/>hello<h1/>")
})

app.get('/page',async function(req,res) {
    res.header("Content-Type", "text/html; charset=utf-8");
    const result = await getPage()
    if(result){
        res.send(result)
    }
    else{
        res.send('no url')
    }
})

app.get('/getBg',async function(req,res){
    const result = await getBgImage()
    if(result){
        let toDay = moment().format('YYYY/MM/DD')
        res.send(new TempRes(200, '成功！', {date:toDay,url:result}))     
    }
    else{
        res.send('no url')
    }
})

app.get('/getBgList', function(req, res) {
    try {
        const files = fs.readdirSync('files')
        res.send(new TempRes(200, '成功！', files))
    }catch(e) {
        res.send('no url')
    }
})

app.get('/getBgImage',async function(req,res){
    const result = await getBgImage()
    if(result){
        let toDay = moment().format('YYYY/MM/DD') 
        res.header("Content-Type", "text/html; charset=utf-8");
        res.send(`<img src='${result.url}' date='${toDay}'>404 NOT FOUND<img/>`)
    }
    else{
        res.send('no url')
    }
})
scheduleCronstyle()

app.use(express.static('./files'));

app.get('*', async function(req,res) {
    res.header("Content-Type", "text/html; charset=utf-8");
    res.send("<h1>404 NOT FOUND<h1/>")
})
app.listen(port, ()=> {
    console.log(`server running @ http://localhost:${port}`);
})