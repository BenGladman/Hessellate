import * as React from "react";
import setParameterValue from "../actions/setParameterValue";

interface Props {
    pname: string;
    label: string;
    value: number;
    options: [number, string][];
}

const component: React.StatelessComponent<Props> = ({ pname, label, value, options }) => {
    const handleChange: React.FormEventHandler = (ev) => {
        setParameterValue(pname, +(ev.currentTarget as HTMLInputElement).value);
    };

    return (
        <fieldset className="h-row">
            <label className="h-label-left">{label} </label>
            <fieldset className="h-group">
                {options.map(([k, v]) => (
                    <label className="h-radio-label">
                        <input key={k}
                            type="radio"
                            name={`control-${pname}`}
                            value={k}
                            checked={value === k}
                            onChange={handleChange} />
                        {v}
                    </label>
                ))}
            </fieldset>
        </fieldset>
    );
};

component.displayName = "RadioControl";
export default component;