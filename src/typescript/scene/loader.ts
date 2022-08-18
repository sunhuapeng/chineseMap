import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { TextureLoader } from 'three'

const OBJ_LOADER = new OBJLoader()
const MTL_Loader = new MTLLoader()
const SVG_Loader = new SVGLoader();
const Texture_Loader = new TextureLoader();
/**
 * 
 * @param url 文件地址
 * @param lcb 加载完成回调
 * @param scb 加载回调
 * @param ecb 加载错误回调
 * @returns 
 */
export const objLoader = function (url: string, lcb?: Function, scb?: any, ecb?: any) {
    OBJ_LOADER.load(url, object => {
        lcb(object)
    }, scb, ecb);
}

/**
 * 
 * @param mtlUrl  材质地址
 * @param objUrl  模型地址
 * @param lcb     加载完成
 * @param scb     加载进度
 * @param ecb     加载错误
 */
export const objMtlLoader = (mtlUrl, objUrl, lcb?: Function, scb?: any, ecb?: any) => {
    MTL_Loader.load(mtlUrl, function (materials) {

        materials.preload();

        new OBJLoader()
            .setMaterials(materials)
            .load(objUrl, function (object) {
                lcb(object)
            }, scb);

    });

}

export { SVGLoader }
export const svgLoader = (url: string, cb) => {
    SVG_Loader.load(url, function (data) {
        cb && cb(data)
    });
}

export const textureLoader = (url: string) => {
    return Texture_Loader.load(url)
}