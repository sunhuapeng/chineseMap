import * as THREE from 'three'


export const d3threeD = (exports: any) => {

    const DEGS_TO_RADS = Math.PI / 180;
    const DIGIT_0 = 48, DIGIT_9 = 57, COMMA = 44, SPACE = 32, PERIOD = 46, MINUS = 45;

    exports.transformSVGPath = function transformSVGPath(pathStr: string) {
        const path = new THREE.ShapePath();

        let idx = 1, activeCmd,
            x = 0, y = 0, nx = 0, ny = 0, firstX = null, firstY = null,
            x1 = 0, x2 = 0, y1 = 0, y2 = 0,
            rx = 0, ry = 0, xar = 0, laf = 0, sf = 0, cx, cy;

        const len = pathStr.length;

        function eatNum() {

            let sidx, c, isFloat = false, s;

            // eat delims

            while (idx < len) {

                c = pathStr.charCodeAt(idx);

                if (c !== COMMA && c !== SPACE) break;

                idx++;

            }

            if (c === MINUS) {

                sidx = idx++;

            } else {

                sidx = idx;

            }

            // eat number

            while (idx < len) {

                c = pathStr.charCodeAt(idx);

                if (DIGIT_0 <= c && c <= DIGIT_9) {

                    idx++;
                    continue;

                } else if (c === PERIOD) {

                    idx++;
                    isFloat = true;
                    continue;

                }

                s = pathStr.substring(sidx, idx);
                return isFloat ? parseFloat(s) : parseInt(s);

            }

            s = pathStr.substring(sidx);
            return isFloat ? parseFloat(s) : parseInt(s);

        }

        function nextIsNum() {

            let c;

            // do permanently eat any delims...

            while (idx < len) {

                c = pathStr.charCodeAt(idx);

                if (c !== COMMA && c !== SPACE) break;

                idx++;

            }

            c = pathStr.charCodeAt(idx);
            return (c === MINUS || (DIGIT_0 <= c && c <= DIGIT_9));

        }

        let canRepeat;
        activeCmd = pathStr[0];

        while (idx <= len) {

            canRepeat = true;

            switch (activeCmd) {

                // moveto commands, become lineto's if repeated
                case 'M':
                    x = eatNum();
                    y = eatNum();
                    path.moveTo(x, y);
                    activeCmd = 'L';
                    firstX = x;
                    firstY = y;
                    break;

                case 'm':
                    x += eatNum();
                    y += eatNum();
                    path.moveTo(x, y);
                    activeCmd = 'l';
                    firstX = x;
                    firstY = y;
                    break;

                case 'Z':
                case 'z':
                    canRepeat = false;
                    if (x !== firstX || y !== firstY) path.lineTo(firstX, firstY);
                    break;

                // - lines!
                case 'L':
                case 'H':
                case 'V':
                    nx = (activeCmd === 'V') ? x : eatNum();
                    ny = (activeCmd === 'H') ? y : eatNum();
                    path.lineTo(nx, ny);
                    x = nx;
                    y = ny;
                    break;

                case 'l':
                case 'h':
                case 'v':
                    nx = (activeCmd === 'v') ? x : (x + eatNum());
                    ny = (activeCmd === 'h') ? y : (y + eatNum());
                    path.lineTo(nx, ny);
                    x = nx;
                    y = ny;
                    break;

                // - cubic bezier
                case 'C':
                    x1 = eatNum(); y1 = eatNum();

                case 'S':
                    if (activeCmd === 'S') {

                        x1 = 2 * x - x2;
                        y1 = 2 * y - y2;

                    }

                    x2 = eatNum();
                    y2 = eatNum();
                    nx = eatNum();
                    ny = eatNum();
                    path.bezierCurveTo(x1, y1, x2, y2, nx, ny);
                    x = nx; y = ny;
                    break;

                case 'c':
                    x1 = x + eatNum();
                    y1 = y + eatNum();

                case 's':
                    if (activeCmd === 's') {

                        x1 = 2 * x - x2;
                        y1 = 2 * y - y2;

                    }

                    x2 = x + eatNum();
                    y2 = y + eatNum();
                    nx = x + eatNum();
                    ny = y + eatNum();
                    path.bezierCurveTo(x1, y1, x2, y2, nx, ny);
                    x = nx; y = ny;
                    break;

                // - quadratic bezier
                case 'Q':
                    x1 = eatNum(); y1 = eatNum();

                case 'T':
                    if (activeCmd === 'T') {

                        x1 = 2 * x - x1;
                        y1 = 2 * y - y1;

                    }

                    nx = eatNum();
                    ny = eatNum();
                    path.quadraticCurveTo(x1, y1, nx, ny);
                    x = nx;
                    y = ny;
                    break;

                case 'q':
                    x1 = x + eatNum();
                    y1 = y + eatNum();

                case 't':
                    if (activeCmd === 't') {

                        x1 = 2 * x - x1;
                        y1 = 2 * y - y1;

                    }

                    nx = x + eatNum();
                    ny = y + eatNum();
                    path.quadraticCurveTo(x1, y1, nx, ny);
                    x = nx; y = ny;
                    break;
                default:
                    throw new Error('Wrong path command: ' + activeCmd);

            }

            // just reissue the command

            if (canRepeat && nextIsNum()) continue;

            activeCmd = pathStr[idx++];

        }

        return path;

    };

}

export function initSVGObject(svgPath: string[], info: any) {

    const obj: any = {};

    /// The geo data from Taipei City, Keelung City, Taipei County in SVG form
    obj.paths = svgPath;

    obj.depths = [1];
    // obj.colors = [0xC07000, 0xC08000, 0xC0A000];
    const c = info.center.split(',')
    obj.center = { x: c[0], y: c[1] };

    return obj;

}

export // 获取模型中心点
    const getMeshCenter = (mesh: any, v3: THREE.Vector3) => {
        let b = new THREE.Box3();
        b.expandByObject(mesh);
        // 获取模型整体中心向量，并取反，如果不取反模型不移动到中心
        b.getCenter(v3)
    }
