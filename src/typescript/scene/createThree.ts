import { Scene, PerspectiveCamera, AmbientLight,PointLight,Vector2, WebGLRenderer, Color, Object3D, ReinhardToneMapping, AxesHelper, BoxGeometry, MeshBasicMaterial, Mesh, Group } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer";

export let width = 0; // 渲染dom的宽度
export let height = 0; // 渲染dom的高度
let tDom = null;
export let scene = null;
export let renderer = null
export let camera = null
export let controls = null
export let css2drenderer = null
export let mapGroup = new Group()

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
    animate()
}

const createScene = () => {
    scene = new Scene()
    scene.background = new Color('#071832')
    scene.add(mapGroup)
}
const createCamera = () => {
    camera = new PerspectiveCamera(45, width / height, 1, 10000)
    camera.position.z = 100;
    // camera.position.y = -300;
    if (scene) scene.add(camera)
}
const createRender = () => {
    const render = new WebGLRenderer();
    render.setSize(width, height);
    render.toneMapping = ReinhardToneMapping;
    if (tDom) {
        tDom.appendChild(render.domElement);
        renderer = render
    }
}

const createCss2dRenderer = ()=>{
    css2drenderer = new CSS2DRenderer();
    css2drenderer.setSize(width, height);
    css2drenderer.domElement.style.position = "absolute";
    css2drenderer.domElement.style.top = "0";
    css2drenderer.domElement.style.pointerEvents = "none";
    tDom.appendChild(css2drenderer.domElement);
}
const createAxesHelper = () => {
    const axesHelper = new AxesHelper(500);

    if (scene) {
        scene.add(axesHelper);
    }
}
// 控制器
const createControls = () => {
    if (camera && renderer && renderer?.domElement)
        controls = new OrbitControls(camera, renderer?.domElement);
    if (controls) {
        controls.addEventListener('change', (e) => {
            // console.log(camera?.position);
        })
    }
}
const createLight = () => {
    var ambientLight = new AmbientLight(0xcccccc, 0.4);
    scene&&scene.add(ambientLight);
    var pointLight = new PointLight(0xffffff, 0.8);
    camera.add(pointLight);
}
export const animate = () => {
    requestAnimationFrame(render);
    if (controls) {
        controls.update();
    }
}

const render = () => {
    animate();
    css2drenderer.render(scene, camera);
    renderer.render(scene, camera);
}