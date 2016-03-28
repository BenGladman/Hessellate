import Disk from "./Disk";
import Graphics from "./Graphics";
import Parameters from "./Parameters";
import UiCanvas from "./UiCanvas";
import UiControls from "./UiControls";

export default class App {
    static init = () => {
        const canvas = document.getElementById("canvas") as HTMLCanvasElement;
        const controls = document.getElementById("controls") as HTMLFieldSetElement;

        const g = new Graphics(canvas);
        const par = new Parameters();

        const d = new Disk(par, g);

        new UiCanvas(canvas, par, d);
        UiControls.init(controls, par, d);

        d.init();
        d.update();
    }
}