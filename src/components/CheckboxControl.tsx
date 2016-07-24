import * as React from "react";
import setParameterValue from "../actions/setParameterValue";

interface Props {
    pname: string;
    label: string;
    value: boolean;
}

const component: React.StatelessComponent<Props> = ({ pname, label, value }) => {
    const handleChange: React.FormEventHandler = (ev) => {
        setParameterValue(pname, (ev.currentTarget as HTMLInputElement).checked);
    };

    return (
        <fieldset className="h-row">
            <label className="h-checkbox-label h-label-left">
                <input type="checkbox"
                    name={`control-${pname}`}
                    checked={value}
                    onChange={handleChange}
                    />
                {label}
            </label>
        </fieldset>
    );
};

component.displayName = "CheckboxControl";
export default component;