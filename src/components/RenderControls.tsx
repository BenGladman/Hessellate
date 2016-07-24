import * as React from "react";
import RadioControl from "./RadioControl";
import CheckboxControl from "./CheckboxControl";
import { RenderParameters } from "../draw/render";

interface Props {
    rpars: RenderParameters;
}

const component: React.StatelessComponent<Props> = ({ rpars }) => {
    const coloptions: [number, string][] = ([
        [0, "Red"], [1, "Orange"], [2, "Yellow"], [3, "Green"], [4, "Blue"], [5, "Purple"],
        [6, "Black"], [7, "Grey 1"], [8, "Grey 2"], [9, "White"]
    ]);

    return (<div>Render Controls not implemented</div>);
};

component.displayName = "GenerateControls";
export default component;
