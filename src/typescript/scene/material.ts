import * as THREE from 'three'
import { textureLoader } from './loader'
export const buildMaterial = new THREE.MeshLambertMaterial({
    color: 0xdadadd,   //颜色
    transparent: true,   // 是否透明
    side: THREE.DoubleSide,//两面可见
    opacity: 1,         //透明度
})
export const floor = new THREE.MeshBasicMaterial({ color: 0x9ca79c, side: THREE.DoubleSide });

const map = textureLoader('./static/image/bgi.jpg');
const lightMap = textureLoader('./static/image/lightMap.jpg');

export const mountainMaterial = new THREE.MeshLambertMaterial({
    color: 0x3ea807,   //颜色
    transparent: true,   // 是否透明
    side: THREE.DoubleSide,//两面可见
    opacity: 1,         //透明度
    map,
    lightMap,
    lightMapIntensity: 0
})

// 飞线
export const flyStyle = (points: any[]): any => {
    return {
        color: getRandomColor(),
        curve: points,
        width: 20,
        length: 1000,
        speed: 10,
        repeat: Infinity
    }
}

function getRandomColor() {
    var rgb =
        "rgb(" +
        Math.floor(Math.random() * 255) +
        "," +
        Math.floor(Math.random() * 255) +
        "," +
        Math.floor(Math.random() * 255) +
        ")";
    return rgb;
}