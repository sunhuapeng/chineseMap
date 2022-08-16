import { create, scene } from './scene/createThree'
import { objLoad } from './scene/loading'
import * as THREE from 'three'
import {renderMap} from './scene/renderMap'
import {getAdCode} from './request/index'

const init = async function () {
    const body = document.querySelector('body')

    if (body) {
        create(body);
        
        // 获取城市编码
        const adCode = await getAdCode();
        // 将城市编码挂载到window
        (window as any).AD_CODe = adCode
        renderMap(100000)
    }

}

// init()

const btn:any = document.querySelector('#btn')
if(btn) {
    btn.onclick = ()=>{
        renderMap(100000)
        
    }
}


