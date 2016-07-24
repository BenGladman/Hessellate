import * as React from "react";
import { State, initialiseStore } from "../store";
import Graphics from "../draw/Graphics";
import { generate, GenerateParameters } from "../draw/generate";
import { RenderParameters } from "../draw/render";
import render from "../actions/render";

interface Props {
    gpars?: GenerateParameters;
    rpars?: RenderParameters;
}

export default class Hessellate extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {};
        Object.assign(this.state, props.gpars, props.rpars);

        this.state.tiles = generate(props.gpars);

        initialiseStore(
            () => this.state,
            (state) => this.setState(state)
        );
    }

    private g: Graphics;

    componentDidMount() {
        console.log("Hessellate component did mount");
        render(this.g);
    }

    render() {
        const canvasInit = (canvas: HTMLCanvasElement) => {
            if (canvas) {
                this.g = new Graphics(canvas);
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