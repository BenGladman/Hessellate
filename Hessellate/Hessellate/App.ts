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

    var d = new Hessellate.Disk(par);
    d.init();
    d.update(g);
};