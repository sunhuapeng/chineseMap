import { create,scene } from './scene/createThree'
import { objLoad } from './scene/loading'
import * as THREE from 'three'

const init = async function () {
    const body = document.querySelector('body')
    let city
    const getCity = async function () {
        city = await objLoad('./static/model/obj/city.obj')
    }
    if (body) {
        create(body);
        await getCity();
        console.log(city);
        city.traverse((mesh:any)=>{
            console.log('mesh',mesh);
            if(mesh.isMesh) {
                mesh.material = new THREE.MeshLambertMaterial({
                    color: 0xffee33,
                    side: THREE.DoubleSide//两面可见
                })
                
            }
            
        })
        scene&&scene.add(city)
    }

}

init()




