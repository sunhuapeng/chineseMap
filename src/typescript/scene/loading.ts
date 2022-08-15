import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

const OBJ_LOADER = new OBJLoader()
export const objLoad = function (url: string) {
    return new Promise((resolve, reject) => {
        // 加载普通模型
        OBJ_LOADER.load(url, object => {
            // console.log(object);
            resolve(object)
        });
    })
}