/// <reference path="Disk.ts" />
/// <reference path="Graphics.ts" />
/// <reference path="Parameters.ts" />
/// <reference path="Point.ts" />

window.onload = () => {
    let c = document.getElementById("canvas") as HTMLCanvasElement;
    let g = new Hessellate.Graphics(c);
    let par = new Hessellate.Parameters();
    par.n = 4;
    par.k = 5;
    par.quasiregular = false;
    par.layers = 3;
    par.skipNumber = 1;
    par.fill = true;
    //par.grayScale = true;
    //par.alternating = true;

    let d = new Hessellate.Disk(par);
    d.init();
    d.update(g);

    let rotate = false;
    let startPosition = Hessellate.Point.origin;
    let startAngle = 0;

    let eventPosition = function (ev: MouseEvent): Hessellate.Point {
        let tx = (2 * ev.offsetX / c.width) - 1;
        let ty = (2 * ev.offsetY / c.height) - 1;
        return new Hessellate.Point(tx, ty);
    }

    let mousemoveHandler = function (ev: MouseEvent) {
        if (ev.which !== 1) {
            c.removeEventListener("mousemove", mousemoveHandler);
            par.highlightCenter = false;
            d.update(g);
            return;
        }

        if (rotate) {
            par.moebiusT = eventPosition(ev).arg() - startAngle;
        } else {
            let newZ0 = eventPosition(ev).rotate(startAngle).minus(startPosition);
            let r = newZ0.norm();
            if (r > par.detailLevel) { newZ0 = Hessellate.Point.fromPolar(par.detailLevel, newZ0.arg()); }
            par.moebiusZ0 = newZ0;
        }
        par.highlightCenter = true;
        d.update(g);
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
};