import * as React from "react";
import * as ReactDOM from "react-dom";
import { defaultGenerateParameters } from "./draw/generate";
import { defaultRenderParameters } from "./draw/render";
import Hessellate from "./components/Hessellate";
import "./app.css";

const elem = (<Hessellate
    gpars={defaultGenerateParameters()}
    rpars={defaultRenderParameters()}
    />);

ReactDOM.render(elem, document.getElementById("app"));
