const cheerio = require('cheerio')
const axios = require('axios')
const qs = require('querystring');
const Entities = require('html-entities').XmlEntities; 

const entities = new Entities();
const url = "https://cn.bing.com/"
const getPage = async () => {
    const res = await axios.get(url)
    if (!res) {
        return 'err'
    }
    return res.data
}

const getBgImage = async () => {
    const res = await axios.get(url)
    if (!res) {
        return 'err'
    }
    const html_str = res.data.toString()
    const $ = cheerio.load(html_str);
    const img = $('#bgImgProgLoad').attr('data-ultra-definition-src')
    const title = $('#sh_cp').attr('title')
    return {
        url:url+img,
        title
    }
}

module.exports = { getPage, getBgImage }