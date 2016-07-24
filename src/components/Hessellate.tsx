import * as React from "react";
import { State, initialiseStore } from "../store";
import GenerateControls from "./GenerateControls";
import RenderControls from "./RenderControls";
import Graphics from "../draw/Graphics";
import Tile from "../draw/Tile";
import { generate, GenerateParameters } from "../draw/generate";
import { render, RenderParameters } from "../draw/render";

interface Props {
    gpars?: GenerateParameters;
    rpars?: RenderParameters;
}

export default class Hessellate extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {};
        Object.assign(this.state, props.gpars, props.rpars);

        initialiseStore(
            () => this.state,
            (state) => this.setState(state)
        );
    }

    private g: Graphics;
    private tiles: Tile[];

    private generateTiles() {
        this.tiles = generate(this.state);
    }

    private renderDisk() {
        render(this.tiles, this.g, this.state);
    }

    componentDidMount() {
        console.log("Hessellate component did mount");
        this.generateTiles();
        this.renderDisk();
    }

    componentDidUpdate(prevProps: Props, prevState: State) {
        console.log("Hessellate component did update");
        if (prevState.n !== this.state.n || prevState.k !== this.state.k || prevState.quasiregular !== this.state.quasiregular) {
            this.generateTiles();
        }
        this.renderDisk();
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
                <GenerateControls gpars={this.state} />
                <RenderControls rpars={this.state} />
                <h2>Ben Gladman, 2016</h2>
                <a href="http://aleph0.clarku.edu/~djoyce/poincare/PoincareB.html">Adapted from work by D.Joyce</a>
                <br />
                <a href="https://github.com/BenGladman/Hessellate">View source on GitHub</a>
            </article>
        );
    }
}