import Parameters from "./Parameters";
import Disk from "./Disk";
import Point from "./Point";

export default class UiCanvas {
    static init = (c: HTMLCanvasElement, par: Parameters, disk: Disk) => {
        let rotate = false;
        let startPosition = Point.origin;
        let startAngle = 0;

        let eventPosition = function (ev: MouseEvent): Point {
            let tx = (2 * ev.offsetX / c.width) - 1;
            let ty = (2 * ev.offsetY / c.height) - 1;
            return new Point(tx, ty);
        }

        let mousemoveHandler = function (ev: MouseEvent) {
            if (ev.which !== 1) {
                c.removeEventListener("mousemove", mousemoveHandler);
                par.highlightCenter = false;
                disk.update();
                return;
            }

            if (rotate) {
                par.moebiusT = eventPosition(ev).arg() - startAngle;
            } else {
                let newZ0 = eventPosition(ev).rotate(startAngle).minus(startPosition);
                let r = newZ0.norm();
                if (r > par.detailLevel) { newZ0 = Point.fromPolar(par.detailLevel, newZ0.arg()); }
                par.moebiusZ0 = newZ0;
            }
            par.highlightCenter = true;
            disk.update();
        }

        c.addEventListener("mousedown", (ev) => {
            let ep = eventPosition(ev);
            if (ep.norm() > 1) {
                rotate = true;
                startAngle = ep.arg() - par.moebiusT;
            } else {
                rotate = false;
                startAngle = Math.PI - par.moebiusT;
                startPosition = ep.rotate(startAngle).minus(par.moebiusZ0);
            }
            c.addEventListener("mousemove", mousemoveHandler);
        });
    }
}