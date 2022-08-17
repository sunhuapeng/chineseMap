import * as THREE from 'three'
import { floor } from './material'
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';
export const createFloor = () => {
    const geometry = new THREE.PlaneGeometry(10000, 10000);
    const material = floor
    return new THREE.Mesh(geometry, material);
}

export function initReflector() {
    // 反光面
    let reflector = new Reflector(new THREE.PlaneGeometry(2000, 2000), {
      textureWidth: window.innerWidth * window.devicePixelRatio,
      textureHeight: window.innerHeight * window.devicePixelRatio,
      color: 0x6e91aa
    });
    reflector.position.y = 1.35;
    reflector.rotation.x = -0.5 * Math.PI
    return reflector
  }