import { getCityPoint } from '../request/index'
import { mapKey as key } from '../config/mapKey'
import { initSVGObject, d3threeD, getMeshCenter } from '../utils'
import { scene, mapGroup, camera } from './createThree'
import * as THREE from 'three'

import { ReturnLine } from './createMesh'
const colors = {
    city: '#102ba2',
    line: '#275ec5',
}
/**
 * _level 0:国家 1 城市 2 区县
 */
let _level = 0
let loadSpet = 0
export const renderMap = async (key) => {

    const mapInfo = await getMapInfo(key);

    lastLevel(mapInfo)
}

const lastLevel = async (mapInfo: any) => {
    const querys = []
    await mapInfo?.districts?.forEach(async (city: any) => {
        let i = 0;
        while (i < city.districts.length) {
            const cd = city.districts[i]
            const key = cd.adcode

            querys.push(getMapInfo(key))
            i++
        }
    });
    // 请求全部
    const resqs = await Promise.all(querys)

    resqs.forEach((cityInfo: any) => {
        cityInfo?.districts?.forEach((map: any) => {
            const mapArray = map.polyline.split(';').join(' L').split('|').join('M');
            const mapStr = 'M' + mapArray + ' Z';
            const obj = initSVGObject([mapStr], map);
            addGeoObject(mapGroup, obj, map);
            if (loadSpet === cityInfo?.districts.length) {
                console.log('加载结束');
                const center = new THREE.Vector3()
                getMeshCenter(mapGroup, center)
                console.log(center);
                mapGroup.position.copy(center.negate())

            }

        })
    })
}


const $d3g: any = {};
d3threeD($d3g)

// 根据svg创建模型
const addGeoObject = function (group, svgObject, userData) {
    const paths = svgObject.paths;
    const color = colors.city

    for (let i = 0; i < paths.length; i++) {

        const path = $d3g.transformSVGPath(paths[i]);
        const c = new THREE.Color(color);
        const material = new THREE.MeshLambertMaterial({
            color: c,
            emissive: c,
            side: THREE.DoubleSide,
            opacity: 0.6,
            transparent: true
        });
        const depth = 3;
        const simpleShapes = path.toShapes(true);

        for (let j = 0; j < simpleShapes.length; j++) {

            const simpleShape = simpleShapes[j];
            const shape3d = new THREE.ExtrudeGeometry(simpleShape, {
                depth: depth,
                bevelEnabled: false
            });

            const mesh = new THREE.Mesh(shape3d, material);
            mesh.userData.mapInfo = userData
            mesh.userData.svgObject = svgObject

            let line = ReturnLine(mesh, 1, colors.line, 2);

            mesh.add(line)
            group.add(mesh);
        }

    }
    loadSpet++
};


const getMapInfo = async (keywords) => {
    const params = {
        key,
        keywords,
        subdistrict: 1,
        extensions: 'all'
    }
    return await getCityPoint(params)
}

var mouse = new THREE.Vector2(); //鼠标位置

// 监听鼠标事件
var handleMouse = (event: any) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    // 光线投射Raycaster
    var raycaster = new THREE.Raycaster();
    // 更新射线
    raycaster.setFromCamera(mouse, camera);
    // 检测交互  检测和射线相交的一组物体, 
    // 第二个参数设置为false，不检测后代，否则会误检到装饰线
    const rayMesh = raycaster.intersectObjects(mapGroup.children, false);
    const { type } = event
    matchEvent(type, rayMesh)

}

// 过滤鼠标事件
const matchEvent = (type: string, meshs: any[]) => {
    switch (type) {
        case 'mousemove':
            mouseMove(meshs)
            break
        case 'click':
            mouseClick(meshs)
            break
    }

}

const mouseMove = (meshs) => {
    const mesh = meshs[0]
    if (mesh) {
        const { object } = mesh
    }

}
const mouseClick = (meshs) => {
    const mesh = meshs[0]
    if (mesh) {
        _level = 1

        const { object } = mesh
        const center = new THREE.Vector3()
        getMeshCenter(object, center)
        mapGroup.position.copy(center.negate())
        removeMesh()

        renderMap(object.userData.mapInfo.adcode)
    }

}

const removeMesh = () => {
    mapGroup.traverse((object: THREE.Mesh) => {
        if (object?.isMesh) {
            object.geometry.dispose();
            (object.material as THREE.MeshLambertMaterial)?.dispose()
        }
    })
    mapGroup.children = []
}
// 监听鼠标抬起
window.addEventListener(
    "mousemove",
    handleMouse,
    false
);
window.addEventListener(
    "click",
    handleMouse,
    false
);
