import { create, mapGroup, mountainGroup, riversGroup, lineGroup } from './scene/createThree'
import { objLoader, objMtlLoader, svgLoader, SVGLoader } from './scene/loader'
import { buildMaterial, mountainMaterial } from './scene/material'
import { Mesh, Group } from 'three'
import * as THREE from 'three'
import { getMeshCenter } from './utils/index'
import { createFloor, initReflector, createRoad } from './scene/createMesh'
import { handleFlyLine } from './scene/createFly'
const init = async function () {
    const mapDom = document.querySelector('#map')
    let dalian: any | null = null

    if (mapDom) {
        create(mapDom);
        // 地图
        objLoader('./static/model/obj/2.obj', handleCity, (xhr: any) => {
            if (xhr.lengthComputable) {
                const percentComplete = xhr.loaded / xhr.total * 100;
                console.log(Math.floor(percentComplete) + '% downloaded');
            }
        });
        objMtlLoader('./static/model/obj/mountain1.mtl', './static/model/obj/mountain1.obj', handleMountain, (xhr: any) => {
            if (xhr.lengthComputable) {
                const percentComplete = xhr.loaded / xhr.total * 100;
                console.log(Math.floor(percentComplete) + '% downloaded');
            }
        });

        svgLoader('./static/model/svg/road.svg', handleRoad)
        // svgLoader('./static/model/svg/flyline.svg', handleFlyLine)

        // 底色
        const floor = createFloor()
        floor.rotation.x = Math.PI / 2

        // 湖水
        const reflector = initReflector()
        reflector.position.set(2780, 1, 570)
        riversGroup.add(reflector)


        mapGroup.add(floor)
    }

    // 处理城市模型
    function handleCity(obj: Group) {
        if (obj) {
            dalian = obj
            dalian.rotation.y = Math.PI
            dalian.traverse((mesh) => {
                if (mesh.isMesh) {
                    mesh.material = buildMaterial
                }
            })

            mapGroup.add(dalian)
        }

    }

    // 处理山峰
    function handleMountain(obj: Group) {
        if (obj) {
            const mesh: any = obj.children[0]
            // const mesh2 = mesh.clone()

            mesh.position.set(-200, 4, -1090)
            mesh.scale.set(2, 0.6, 2)


            mesh.material = mountainMaterial
            mountainGroup.add(mesh)
            // mountainGroup.add(mesh2)
        }
    }
    function handleRoad(svg: any) {
        svgLoader('./static/model/svg/flyroad.svg', handleFlyLine)
        const { paths } = svg;
        const group = createRoad(paths)
        lineGroup.add(group)
        lineGroup.scale.set(1.35,1.35,1)
        lineGroup.rotation.set(Math.PI / 2,0,0)
        const v3 = new THREE.Vector3()
        getMeshCenter(lineGroup, v3)
        const v3n= v3.negate()
        lineGroup.position.set(v3n.x, v3n.y, v3n.z-10)

    }
}
init()

