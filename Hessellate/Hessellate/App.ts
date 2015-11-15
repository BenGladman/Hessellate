/// <reference path="Disk.ts" />
/// <reference path="Graphics.ts" />
/// <reference path="Parameters.ts" />

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

    let dragHandler = function (ev: MouseEvent) {
        if (ev.which === 0) {
            c.removeEventListener("mousemove", dragHandler);
            return;
        }

        let tx = (2 * ev.offsetX / c.width) - 1;
        let ty = (2 * ev.offsetY / c.height) - 1;
        if (Math.sqrt(tx * tx + ty * ty) <= 1) {
            par.translateX = tx;
            par.translateY = ty;
            d.update(g);
        }
    }

    c.addEventListener("mousedown", (ev) => {
        c.addEventListener("mousemove", dragHandler);
    });
};