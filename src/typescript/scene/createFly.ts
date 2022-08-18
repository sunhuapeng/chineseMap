import * as THREE from 'three'
import { lineGroup, _Fly } from '../scene/createThree'
import { flyStyle } from './material'
const flyGroup = new THREE.Group()
lineGroup.add(flyGroup)
export const handleFlyLine = (data: any) => {
    let shapeArr = [];
    for (let i = 0; i < data.paths.length; i++) {
        let path = data.paths[i];
        var shapes = path.toShapes(true);

        shapes.forEach(shape => {
            shapeArr.push(shape);
        });
    }

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
        let geoPlane = new THREE.ShapeBufferGeometry(shape);

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
    // 通过判断线段长度 进行飞线点数的划分
    var point = null;
    let length = 0
    let lastPoint = curve.points[0]
    for (let i = 1; i < curve.points.length; i++) {
        const newPoint = curve.points[i]
        const L = lastPoint.clone().sub(newPoint).length();
        length += L
    }

    try {
        point = curve.getPoints(Math.floor(length / 2));
    } catch (err) {
        if (!point) {
            return;
        }
    }

    setFlyLine(point);
}
// 放置飞线
function setFlyLine(points) {
    var flyMesh = _Fly.addFly(flyStyle(points));

    flyGroup.add(flyMesh);
}
