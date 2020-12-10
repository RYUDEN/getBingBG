const moment = require("moment");
const fs = require("fs");
const path = require("path");
const request = require("request");

//创建文件夹目录
const dirPath = path.join(__dirname, "files");
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
    console.log("文件夹创建成功");
} else {
    console.log("文件夹已存在");
}
//整数转字符串，不足的位数用0补齐
function intToString(num, len) {
    let str = num.toString();
    while (str.length < len) {
        str = "0" + str;
    }
    return str;
}
// https://cn.bing.com//th?id=OHR.RavensSnow_ZH-CN0153928643_UHD.jpg&rf=LaDigue_UHD.jpg&pid=hp&w=1920&h=1080&rs=1&c=4
function downloadImg (url,title) {
    return new Promise((resolve) => {
        let urlArr = url.split('?')
        let params = new URLSearchParams(urlArr[1])
        let toDay = moment().format('YYYY-MM-DD')
        let fileName =toDay+'-'+ params.get('id')
        let stream = fs.createWriteStream(path.join(dirPath, fileName));
        request(url).pipe(stream).on("close", function (err) {
            console.log("文件[" + fileName + "]下载完毕");
            resolve({
                status:'true'
            })
        });
    })
}
 
module.exports = downloadImg
// downloadImg('https://cn.bing.com//th?id=OHR.RavensSnow_ZH-CN0153928643_UHD.jpg&rf=LaDigue_UHD.jpg&pid=hp&w=1920&h=1080&rs=1&c=4')
