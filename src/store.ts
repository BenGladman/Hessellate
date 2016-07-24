import { RenderParameters } from "./draw/render";
import { GenerateParameters } from "./draw/generate";

export interface State extends GenerateParameters, RenderParameters {
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