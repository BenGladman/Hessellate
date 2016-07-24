import { RenderParameters } from "./draw/render";
import { GenerateParameters } from "./draw/generate";
import Graphics from "./draw/Graphics";
import Tile from "./draw/Tile";

export interface State extends GenerateParameters, RenderParameters {
    g?: Graphics;
    tiles?: Tile[];
}

export let getState = (): State => {
    console.warn("getState not initialised.");
    return {};
};

export let setState = (state: State): void => {
    console.warn("setState not initialised.");
};

export let initialiseStore = (newGetState: () => State, newSetState: (state: State) => void) => {
    getState = newGetState;
    setState = newSetState;
};