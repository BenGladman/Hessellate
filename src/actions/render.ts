import { getState, setState } from "../store";
import { render } from "../draw/render";
import Graphics from "../draw/Graphics";

export default function (g?: Graphics) {
    const state = getState();

    if (g) {
        setState({ g });
    } else {
        g = state.g;
    }

    if (g) {
        render(state.tiles, g, state);
    }
}