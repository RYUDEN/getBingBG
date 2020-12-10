const download = require('./download');
const { getBgImage } = require('./utils/spider')

const schedule = require('node-schedule');

const downloadBG = async function () {
    const source = await getBgImage()
    if (source) {
        const result = await download(source.url, source.title)
        if (result.status) {
            console.log('下载成功')
        }
    }
}
const  scheduleCronstyle = ()=> {
  //每分钟的第30秒定时执行一次:
    schedule.scheduleJob('10 2 2 * * *',()=>{
        console.log('scheduleCronstyle:' + new Date());
        downloadBG()
    }); 
}

module.exports = {
    downloadBG,
    scheduleCronstyle
}


// downloadBG()