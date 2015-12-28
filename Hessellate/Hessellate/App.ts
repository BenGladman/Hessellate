/// <reference path="Disk.ts" />
/// <reference path="Graphics.ts" />
/// <reference path="Parameters.ts" />
/// <reference path="UI.Canvas.ts" />
/// <reference path="UI.Controls.ts" />

window.onload = () => {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const controls = document.getElementById("controls") as HTMLFieldSetElement;

    const g = new Hessellate.Graphics(canvas);
    const par = new Hessellate.Parameters();

    const d = new Hessellate.Disk(par, g);

    Hessellate.UI.Canvas.init(canvas, par, d);
    Hessellate.UI.Controls.init(controls, par, d);

    d.init();
    d.update();
};