import { create, mapGroup, mountainGroup, riversGroup } from './scene/createThree'
import { objLoader, objMtlLoader, svgLoader } from './scene/loader'
import { buildMaterial } from './scene/material'
import { Mesh, Group } from 'three'
import * as THREE from 'three'
import { createFloor, initReflector } from './scene/createMesh'
import { handleFlyLine } from './scene/createFly'
const init = async function () {
    const mapDom = document.querySelector('#map')
    let dalian: any | null = null

    if (mapDom) {
        create(mapDom);
        // 地图
        objLoader('./static/model/obj/dalian.obj', handleCity, (xhr: any) => {
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

        svgLoader('./static/model/svg/flyline.svg', handleFlyLine)

        // getsvg('./static/model/svg/flyline(1).svg')

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
            const mesh:any = obj.children[0]
            // const mesh2 = mesh.clone()

            mesh.position.set(-670, 4, -890)
            mesh.scale.set(1.2, 0.6, 0.6)
            mesh.material = new THREE.MeshLambertMaterial({
                color: 0x3ea807,   //颜色
                transparent: true,   // 是否透明
                side: THREE.DoubleSide,//两面可见
                opacity: 1,         //透明度
            })

            // mesh2.position.set(-330, 3, -1380)
            // mesh2.scale.set(7.3, 0.2, 3)
            // mesh2.material = new THREE.MeshLambertMaterial({
            //     color: 0x3ea807,   //颜色
            //     transparent: true,   // 是否透明
            //     side: THREE.DoubleSide,//两面可见
            //     opacity: 1,         //透明度
            // })
            mountainGroup.add(mesh)
            // mountainGroup.add(mesh2)
        }
    }


}
init()

