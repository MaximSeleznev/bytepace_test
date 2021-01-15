const cheerio = require('cheerio')
const axios = require('axios')
var nodeURL = require('url')
const requestImageSize = require('request-image-size')

const url = 'https://forum.awd.ru/viewtopic.php?f=1011&t=165935'
let imgArr = []
let loadURL = (resp) => {
    const html = resp.data
    const $ = cheerio.load(html)

    $("body").find("img").each((i, elem) => {
        let imageData = {}
        let src = ''
        if (elem.attribs.src) {
            src = nodeURL.resolve(url, elem.attribs.src)
        } else {
            src = nodeURL.resolve(url, $(elem).attr('data-src'))
        }
        imageData.src = src
        imgArr.push(imageData)
        
    })
}
let getImg = async () => {
    const resp = await axios.get(url)
    const resp2 = await loadURL(resp)
    const resp3 = await imgArr.forEach(elem => {
        requestImageSize(elem.src)
        .then(size => {
            elem.width = size.width
            elem.height = size.height
            elem.weight = size.downloaded / 1024
            console.log(elem)
        })
        .catch(err => console.error(err));
    })
}
getImg()

