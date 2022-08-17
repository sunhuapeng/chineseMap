import * as  THREE from 'three'
// 获取模型中心点
export const getMeshCenter = (mesh: any, v3: THREE.Vector3) => {
    let b = new THREE.Box3();
    b.expandByObject(mesh);
    // 获取模型整体中心向量，并取反，如果不取反模型不移动到中心
    b.getCenter(v3)
}