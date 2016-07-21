import Parameters from "./draw/Parameters";
import Disk from "./draw/Disk";
import Point from "./draw/Point";

export default class UiCanvas {
    private rotate = false;
    private startPosition = Point.origin;
    private startAngle = 0;
    private par: Parameters;
    private canvas: HTMLCanvasElement;
    private disk: Disk;

    constructor(c: HTMLCanvasElement, par: Parameters, disk: Disk) {
        this.canvas = c;
        this.par = par;
        this.disk = disk;

        c.addEventListener("mousedown", (ev) => {
            this.pointerStart(ev);
            this.canvas.addEventListener("mousemove", this.mouseMove);
            this.canvas.addEventListener("mouseup", this.mouseUp);
        });

        c.addEventListener("touchstart", (ev) => {
            this.pointerStart(ev);
            this.canvas.addEventListener("touchmove", this.touchMove);
            this.canvas.addEventListener("touchend", this.touchEnd);
        });
    }

    private eventPosition = (ev: Event) => {
        let ox = 0;
        let oy = 0;

        if (ev instanceof MouseEvent) {
            ox = ev.offsetX;
            oy = ev.offsetY;
        } else if (ev instanceof TouchEvent) {
            ox = ev.touches[0].pageX - this.canvas.offsetLeft;
            oy = ev.touches[0].pageY - this.canvas.offsetTop;
        }

        let tx = (2 * ox / this.canvas.width) - 1;
        let ty = (2 * oy / this.canvas.height) - 1;
        return new Point(tx, ty);
    }

    private pointerStart = (ev: MouseEvent | TouchEvent) => {
        let ep = this.eventPosition(ev);
        if (ep.norm() > 1) {
            this.rotate = true;
            this.startAngle = ep.arg() - this.par.moebiusT;
        } else {
            this.rotate = false;
            this.startAngle = Math.PI - this.par.moebiusT;
            this.startPosition = ep.rotate(this.startAngle).minus(this.par.moebiusZ0);
        }
    }

    private mouseMove = (ev: MouseEvent) => {
        if (ev.which !== 1) {
            this.mouseUp(ev);
            return;
        }

        this.pointerMove(ev);
    }

    private touchMove = (ev: TouchEvent) => {
        this.pointerMove(ev);
        ev.preventDefault();
    }

    private pointerMove = (ev: Event) => {
        if (this.rotate) {
            this.par.moebiusT = this.eventPosition(ev).arg() - this.startAngle;
        } else {
            let newZ0 = this.eventPosition(ev).rotate(this.startAngle).minus(this.startPosition);
            let r = newZ0.norm();
            if (r > this.par.detailLevel) { newZ0 = Point.fromPolar(this.par.detailLevel, newZ0.arg()); }
            this.par.moebiusZ0 = newZ0;
        }
        this.par.highlightCenter = true;
        this.disk.update();
    }

    private mouseUp = (ev: MouseEvent) => {
        this.canvas.removeEventListener("mousemove", this.mouseMove);
        this.canvas.removeEventListener("mouseup", this.mouseUp);
        this.pointerEnd(ev);
    }

    private touchEnd = (ev: TouchEvent) => {
        this.canvas.removeEventListener("touchmove", this.touchMove);
        this.canvas.removeEventListener("touchend", this.touchEnd);
        this.pointerEnd(ev);
    }

    private pointerEnd = (ev: Event) => {
        this.par.highlightCenter = false;
        this.disk.update();
    }
}