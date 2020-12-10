const mongoose = require('mongoose')
const mongodbUrl = 'mongodb://localhost:27017/bing' // 本地
mongoose.set('useFindAndModify', false)
mongoose.connect(mongodbUrl,
    {
      useNewUrlParser: true ,
      useUnifiedTopology: true,
    }, 
   function (err) {
        if (err) {
            console.log(err)
        } else {
            console.log('数据库连接成功,可以搞事情!')
        }
})

const Schema = mongoose.Schema

const backgroundSchema = new Schema({
    date: String,
    url: String,
    title: String,
})

exports.Background = mongoose.model('Background', backgroundSchema)