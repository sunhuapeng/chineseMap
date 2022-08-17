import * as THREE from 'three'
export const buildMaterial = new THREE.MeshLambertMaterial({
    color: 0xdadadd,   //颜色
    transparent: true,   // 是否透明
    side: THREE.DoubleSide,//两面可见
    opacity: 1,         //透明度
})
export const floor = new THREE.MeshBasicMaterial( {color: 0x9ca79c, side: THREE.DoubleSide} );