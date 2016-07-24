import * as React from "react";
import RadioControl from "./RadioControl";
import CheckboxControl from "./CheckboxControl";
import { GenerateParameters } from "../draw/generate";

interface Props {
    gpars: GenerateParameters;
}

const component: React.StatelessComponent<Props> = ({ gpars }) => {
    const noptions: [number, string][] = [
        [3, "3"], [4, "4"], [5, "5"], [6, "6"], [7, "7"], [8, "8"]
    ];

    return (
        <fieldset className="h-controls">
            <RadioControl pname="n" label="Sides per polygon:" value={gpars.n} options={noptions} />
            <RadioControl pname="k" label="Polygons per vertex:" value={gpars.k} options={noptions} />
            <CheckboxControl pname="quasiregular" label="Quasiregular" value={gpars.quasiregular} />
        </fieldset>
    );
};

component.displayName = "GenerateControls";
export default component;