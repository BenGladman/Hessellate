import * as React from "react";
import Disk from "../draw/Disk";
import Graphics from "../draw/Graphics";
import Parameters from "../draw/Parameters";

interface Props {
}

interface State {
    par: Parameters;
    disk: Disk;
}

export default class Hessellate extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        const par = new Parameters();
        const disk = new Disk();
        disk.setParameters(par);

        this.state = {
            par,
            disk,
        };
    }

    render() {
        const canvasInit = (canvas: HTMLCanvasElement) => {
            if (canvas) {
                const g = new Graphics(canvas);
                const d = this.state.disk;
                d.setGraphics(g);
                d.init();
                d.update();
            }
        };

        return (
            <article>
                <h1>Hessellate</h1>
                <h2>Hyperbolic Tessellations on the Poincaré Disk</h2>
                <canvas ref={canvasInit} height={300} width={300} />
                <h2>Ben Gladman, 2016</h2>
                <a href="http://aleph0.clarku.edu/~djoyce/poincare/PoincareB.html">Adapted from work by D.Joyce</a>
                <br />
                <a href="https://github.com/BenGladman/Hessellate">View source on GitHub</a>
            </article>
        );
    }
}