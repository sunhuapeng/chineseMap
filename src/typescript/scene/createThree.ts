import { Scene, PerspectiveCamera, Fog, AmbientLight, PointLight, Vector2, WebGLRenderer, Color, Object3D, ReinhardToneMapping, AxesHelper, BoxGeometry, MeshBasicMaterial, Mesh, Group } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer";
import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import * as THREE from 'three'
import initFly from '../../assets/js/fly'
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';

// import {_Fly} from './createFly'
export let width = 0; // 渲染dom的宽度
export let height = 0; // 渲染dom的高度
let tDom = null;
export let scene = null;
export let renderer = null
export let camera = null
export let controls = null
export let css2drenderer = null
export let mapGroup = new Group() // 地图组
export let mountainGroup = new Group() // 山峰组
export let riversGroup = new Group() // 河流组
export let otherGroup = new Group()  // 其他组
export let lineGroup = new Group()  // 飞线组
var mouse = new THREE.Vector2(); //鼠标位置
let thatMesh = null
export let _Fly = new initFly({});
let clock = new THREE.Clock();

const runCameraPosition = new THREE.Vector3(771, 215, 380)
const params = {
    positionX: 0,
    positionY: 0,
    positionZ: 0,
    scaleX: 1,
    scaleY: 1,
    scaleZ: 1,
};

export const create = (dom) => {
    tDom = dom
    width = dom.offsetWidth
    height = dom.offsetHeight
    createScene()
    createCamera()
    createCss2dRenderer()
    createRender()
    createAxesHelper()
    createControls()
    createLight()
    initSky()

    animate()
    guiUtil()

    // 监听鼠标抬起
    window.addEventListener(
        "click",
        handleEVent,
        false
    );
    // 监听鼠标抬起
    window.addEventListener(
        "keydown",
        handleEVent,
        false
    );
}

const createScene = () => {
    scene = new Scene()
    scene.background = new Color('#071832')
    scene.fog = new Fog(0xc1c9c8, -2000, 8000)
    scene.add(mapGroup)
    scene.add(mountainGroup)
    scene.add(riversGroup)
    scene.add(otherGroup)
    scene.add(lineGroup)
}

const createCamera = () => {
    camera = new PerspectiveCamera(45, width / height, 1, 20000)
    // camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, -20000, 20000 );
    // camera.position.set(458, 215, 380)
    camera.position.set(777, 321, -728)
    // camera.position.set(0, 5000, 0)
    if (scene) scene.add(camera)
}

const createRender = () => {
    const render = new WebGLRenderer({
        antialias: true //抗锯齿
    });
    render.setSize(width, height);
    render.toneMapping = ReinhardToneMapping;
    if (tDom) {
        tDom.appendChild(render.domElement);
        renderer = render
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 0.5;
    }
}

const createCss2dRenderer = () => {
    css2drenderer = new CSS2DRenderer();
    css2drenderer.setSize(width, height);
    css2drenderer.domElement.style.position = "absolute";
    css2drenderer.domElement.style.top = "0";
    css2drenderer.domElement.style.pointerEvents = "none";
    tDom.appendChild(css2drenderer.domElement);
}

const createAxesHelper = () => {
    const axesHelper = new AxesHelper(500);
    const helper = new THREE.GridHelper(10000, 20, 0xffffff, 0xffffff);
    if (scene) {
        scene.add(helper);
        scene.add(axesHelper);
    }
}

// 控制器
const createControls = () => {
    if (camera && renderer && renderer?.domElement)
        controls = new OrbitControls(camera, renderer?.domElement);
    if (controls) {
        controls.addEventListener('change', (e) => {
            console.log(camera?.position);
        })
    }
}

const createLight = () => {
    var ambientLight = new AmbientLight(0xcccccc, 0.4);
    scene && scene.add(ambientLight);
    var pointLight = new PointLight(0xffffff, 0.8);
    camera.add(pointLight);
}

export const animate = () => {
    requestAnimationFrame(render);
    if (controls) {
        controls.update();
    }
}

function initSky() {

    let sky = new Sky();
    sky.scale.setScalar(450000);
    scene.add(sky);

    var sun = new THREE.Vector3();

    /// GUI

    const effectController = {
        turbidity: 0,
        rayleigh: 0.361,
        mieCoefficient: 0.016,
        mieDirectionalG: 0.508,
        elevation: 10.3,
        azimuth: 180,
        exposure: 0.4223
    };

    const guiChanged = () => {

        const uniforms = sky.material.uniforms;
        uniforms['turbidity'].value = effectController.turbidity
        uniforms['rayleigh'].value = effectController.rayleigh
        uniforms['mieCoefficient'].value = effectController.mieCoefficient
        uniforms['mieDirectionalG'].value = effectController.mieDirectionalG

        const phi = THREE.MathUtils.degToRad(90 - effectController.elevation);
        const theta = THREE.MathUtils.degToRad(effectController.azimuth);

        sun.setFromSphericalCoords(1, phi, theta);

        uniforms['sunPosition'].value.copy(sun);

        renderer.toneMappingExposure = effectController.exposure;

    }

    guiChanged();

}

// GUI工具
const guiUtil = () => {
    const gui = new GUI();

    gui.add(params, 'positionX', -10000, 10000, 10);
    gui.add(params, 'positionY', -20, 20, 10);
    gui.add(params, 'positionZ', -10000, 10000, 10);
    gui.add(params, 'scaleX', -10, 10);
    gui.add(params, 'scaleY', -10, 10);
    gui.add(params, 'scaleZ', -10, 10);
    gui.close();
}

const render = () => {
    animate();
    css2drenderer.render(scene, camera);
    renderer.render(scene, camera);
    // if (thatMesh) {
    //     const { positionX, positionY, positionZ, scaleX, scaleY, scaleZ } = params
    //     thatMesh.position.set(positionX, positionY, positionZ)
    //     thatMesh.scale.set(scaleX, scaleY, scaleZ)
    // }
    // 更新动画
    TWEEN.update();
    // 更新飞线
    var delta = clock.getDelta();
    if (_Fly) {
        // console.log(_Fly);

        _Fly.animation(delta)
    }
    // console.log(params.scaleZ);

}


// 处理鼠标监听
const handleEVent = (e: any) => {
    const { type, key } = e
    if (type === 'click') {
        handleClick(e)
    } else if (type === 'keydown') {
        console.log('keydown', e);
        if (key === 'a') {
            console.log('动画', camera.position);
            const newCameraPosition = runCameraPosition;
            new TWEEN.Tween(camera.position).to(newCameraPosition, 5000).start();
        }
    }
}

const handleClick = (event: any) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    // 光线投射Raycaster
    var raycaster = new THREE.Raycaster();
    // 更新射线
    raycaster.setFromCamera(mouse, camera);
    // 检测交互  检测和射线相交的一组物体, 
    // 第二个参数设置为false，不检测后代，否则会误检到装饰线
    const rayMesh = raycaster.intersectObjects(mountainGroup.children, false);

    console.log(rayMesh);
    if (rayMesh.length !== 0) {
        // 模型在object字段里
        if (rayMesh[0].object) {
            
            thatMesh = rayMesh[0].object

            params.positionX = thatMesh.position.x
            params.positionY = thatMesh.position.y
            params.positionZ = thatMesh.position.z
            params.scaleZ = thatMesh.scale.z
            params.scaleX = thatMesh.scale.x
            params.scaleY = thatMesh.scale.y
        }
    }
}
