const express = require('express')  //服务器模块
const fs = require('fs')
const apicache = require("apicache"); // 接口缓存
const moment = require("moment");
const download = require('./download');
const { getPage, getBgImage } = require('./utils/spider')

const Background = require('./db').Background

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

app.get('/page',async function(req,res){
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
    // console.log(result)
    if(result){
        let toDay = moment().format('YYYY/MM/DD')
        let toDayUrl = await Background.find({date:toDay})
        if (toDayUrl.length>0) {
            res.send(new TempRes(200, '成功！', {date:toDay, ...result}))
        } else {
            let newBackground = new Background({
                date:toDay,
                url:result.url,
                title:result.title
            })
            let save_res = await newBackground.save()
            if(save_res.id != null) {
                res.send(new TempRes(200, '成功！', result))
            }else {
                res.send(new TempRes(403, '失败！写入数据失败', ''))
            }
        }
        
    }
    else{
        res.send('no url')
    }
})

app.get('/download', async function (req, res) {
    const source = await getBgImage()
    if (source) {
        const result = await download(source.url, source.title)
        if (result.status) {
            res.send(new TempRes(200,'成功'))
        }
    }
})

app.listen(port, ()=> {
    console.log(`server running @ http://localhost:${port}`);
})