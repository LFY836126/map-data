const axios = require('axios');
var fs = require('fs');
const countryCode = '100000'
let provinces = [];
// https://www.mca.gov.cn/mzsj/xzqh/2022/202201xzqh.html
const SpecialCity = [441900, 442000, 460400, 620200,
    710000, 659001, 469025, 469002, 469007, 469005, 469006, 469001, 469028, 469029, 469021, 469022, 469030, 469026, 469027, 469024, 469023, 659009, 659002, 659008, 659005, 659003, 659007, 659004, 659006, 659010, 419001, 429005, 429006, 429021, 429004
];
// 东莞市、中山市、儋州市、嘉峪关市、
// 台湾省、石河子市、白沙黎族自治县、琼海市、东方市、文昌市、万宁市、五指山市、陵水黎族自治县、保亭黎族苗族自治县、定安县、 屯昌县、琼中黎族苗族自治县、昌江黎族自治县、乐东黎族自治县、临高县、澄迈县、昆玉市、阿拉尔市、可克达拉市、北屯市、图木舒克市、双河市、五家渠市、铁门关市、胡杨河市、济源市、潜江市、天门市、神农架林区、仙桃市
const SpecialProvince = [110000, 310000, 500000, 120000, 810000, 820000]; // 北京、上海、重庆、天津、香港、澳门

function writeFile(filePath, fileName, strData) {
    // fs.mkdirSync(`./${filePath}`)
    var fd = fs.openSync(`./${filePath}/` + fileName + '.json', 'w+');
    fs.writeFileSync(fd, strData);
    fs.closeSync(fd);
}
async function getCountryMap(regionCode) {
    const url = `https://geo.datav.aliyun.com/areas_v3/bound/${regionCode}_full.json`
    const {
        data
    } = await axios.get(url);
    // writeFile(regionCode, regionCode, JSON.stringify(data))
    const tempProvinces = data.features.map(({
        properties
    }) => {
        return properties.adcode
    })
    tempProvinces.pop();
    provinces = tempProvinces
}

function getProvinceMap() {
    provinces.forEach(async (province) => {
        if (SpecialCity.includes(province)) return;
        let url = `https://geo.datav.aliyun.com/areas_v3/bound/${province}_full.json`;
        const {
            data
        } = await axios.get(url);
        // writeFile(`${countryCode}/${province}`, province, JSON.stringify(data))
        if (SpecialProvince.includes(province)) return
        const cities = data.features.map(({
            properties
        }) => {
            return properties.adcode
        })
        getCityMap(cities, province);
    })
}

function getCityMap(cities, province) {
    cities.forEach(async (city) => {
        if (SpecialCity.includes(city)) return;
        let url = `https://geo.datav.aliyun.com/areas_v3/bound/${city}_full.json`;
        try {


            const {
                data
            } = await axios.get(url);
            console.log('====>>>>>>>>', city, `${countryCode}/${province}`, data.type)
            writeFile(`${countryCode}/${province}`, city, JSON.stringify(data))
        } catch (e) {
            console.log(city)
        }
        // writeFile(`${countryCode}/${province}`, province, JSON.stringify(data))
    })
}

async function init() {
    await getCountryMap(countryCode);
    getProvinceMap();
}
init();