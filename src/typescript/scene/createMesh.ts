import * as THREE from 'three'
import { floor } from './material'
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';
import { createShapes } from '../utils/index'
import { handleFlyLine } from '../scene/createFly'

export const createFloor = () => {
  const geometry = new THREE.PlaneGeometry(10000, 10000);
  const material = floor
  return new THREE.Mesh(geometry, material);
}

export function initReflector() {
  // 反光面
  let reflector = new Reflector(new THREE.PlaneGeometry(2000, 2000) as any, {
    textureWidth: window.innerWidth * window.devicePixelRatio,
    textureHeight: window.innerHeight * window.devicePixelRatio,
    color: 0x6e91aa
  } as any);
  reflector.position.y = 1.35;
  reflector.rotation.x = -0.5 * Math.PI
  return reflector
}
export function createRoad(paths: any[]) {
  const group = new THREE.Group();

  for (let i = 0; i < paths.length; i++) {

    const path = paths[i];
    const fillColor = path.userData.style.fill;

    const material = new THREE.MeshBasicMaterial({
      color: i % 2 === 0 ? new THREE.Color().setStyle(fillColor).convertSRGBToLinear() : 0x282c34,
      opacity: path.userData.style.fillOpacity,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      // wireframe: guiData.fillShapesWireframe
    });
    if (i % 2 === 0) {
      // handleFlyLine(path)
      // console.log(path);
    }


    const shapes = createShapes(path);

    for (let j = 0; j < shapes.length; j++) {

      const shape = shapes[j];

      const geometry = new THREE.ShapeGeometry(shape);

      const mesh = new THREE.Mesh(geometry, material);

      group.add(mesh);

    }

  }
  return group
}