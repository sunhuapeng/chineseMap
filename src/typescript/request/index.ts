// 获取城市信息包含坐标点
export const getCityPoint = (params: any) => {
    return new Promise<any>((resolve, reject) => {
        const url = 'https://restapi.amap.com/v3/config/district'
        const reqUrl = formatUrl(url, params)
        fetch(reqUrl).then((response: any) => response.json().then((data) => {
            if (data.infocode === '10000') {
                resolve(data)
            }
        }), () => {

            //处理错误
            reject()

        })
    })
}
export const getAdCode = () => {
    return new Promise<any>((resolve, reject) => {
        const url = 'static/json/adcode.json'
        fetch(url).then((response: any) => response.json().then((data: any) => {
            resolve(data)
        }), () => {
            //处理错误
            reject()

        })
    })
}

// 格式化get请求参数
const formatUrl = (url: string, params: any) => {
    let reqUrl = url;
    let i = 0;
    for (let key in params) {
        if (key) {
            let sym = '&'
            if (i === 0) {
                sym = '?'
            }
            reqUrl += `${sym}${key}=${params[key]}`
            i++
        }
    }
    return reqUrl
}