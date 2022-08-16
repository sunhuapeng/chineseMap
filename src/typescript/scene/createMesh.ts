import * as THREE from 'three'
/**
 * @param {*} mesh 基础模型
 * @param {*} opacity 线透明度
 * @param {*} color  线颜色
 * @param {*} count 分段数
 * @returns 
 */
 export const ReturnLine = (mesh:any, opacity:number, color:string, count?:number) => {
    if (mesh.isMesh) {
        var edges = new THREE.EdgesGeometry(mesh.geometry, count ? count : 10);
        var line = new THREE.LineSegments(edges);
        (line.material as THREE.LineBasicMaterial).color = new THREE.Color(color);
        (line.material as THREE.LineBasicMaterial).opacity = opacity;
        (line.material as THREE.LineBasicMaterial).transparent = true;
        (line.material as THREE.LineBasicMaterial).side = THREE.DoubleSide
        return line;
    }
}