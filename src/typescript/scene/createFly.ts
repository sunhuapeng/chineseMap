import * as THREE from 'three'
import { lineGroup, _Fly } from '../scene/createThree'

// export let _Fly = new initFly({});

export const handleFlyLine = (data: any) => {
    let shapeArr = [];
    for (let i = 0; i < data.paths.length; i++) {
        let path = data.paths[i];
        var shapes = path.toShapes(true);

        shapes.forEach(shape => {
            if (path.userData.node.id.indexOf("fly") !== -1) {
                shapeArr.push(shape);
            }
        });
    }
    // let b = new THREE.Box3();
    // b.expandByObject(lineGroup);
    // let center = new THREE.Vector3();
    // b.getCenter(center).negate();
    // lineGroup.position.copy(center);

    interval(shapeArr);
}

// 定时器
function interval(shapeArr) {
    let index = 0;
    var time = setInterval(() => {
        let shape = shapeArr[index];

        if (index === shapeArr.length - 1) {
            clearInterval(time);
        }
        let geoPlane = new THREE.ShapeGeometry(shape);

        const { count, itemSize, array } = geoPlane.attributes.position
        const points = []
        for (let i = 0; i < count; i++) {
            const v3 = new THREE.Vector3(array[i * itemSize], array[i * itemSize + 1], array[i * itemSize + 2])
            points.push(v3)
        }

        setLine(points);
        index++;
    });
}

function setLine(points) {
    var curve = new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.0001);
    var point = null;

    try {
        point = curve.getPoints(1000);
    } catch (err) {
        if (!point) {
            return;
        }
    }

    setFlyLine(point);
}
// 放置飞线
function setFlyLine(points) {
    // for (let i = 0; i < points.length; i++) {
    //     console.log('points', points[i]);
    //     const geometry = new THREE.BoxGeometry(5, 5, 5);
    //     const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    //     const cube = new THREE.Mesh(geometry, material);
    //     cube.position.copy(points[i])
    //     lineGroup.add(cube);
    // }
    var flyMesh = _Fly.addFly({
        color: getRandomColor(),
        curve: points,
        width: 100,
        length: 100,
        speed: 200,
        // repeat: Infinity
    } as any);
    lineGroup.rotation.set(Math.PI * 0.5, 0, 0);
    lineGroup.position.setY(2)
    lineGroup.add(flyMesh);
}
function getRandomColor() {
    var rgb =
        "rgb(" +
        Math.floor(Math.random() * 255) +
        "," +
        Math.floor(Math.random() * 255) +
        "," +
        Math.floor(Math.random() * 255) +
        ")";
    return rgb;
}