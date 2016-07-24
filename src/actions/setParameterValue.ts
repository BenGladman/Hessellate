import { getState, setState } from "../store";

export default function setParameterValue(key: string, newValue: any) {
    const state = getState();
    const currentValue = (state as any)[key];
    if (currentValue !== newValue) {
        const newState: any = {};
        newState[key] = newValue;
        setState(newState);
    }
}