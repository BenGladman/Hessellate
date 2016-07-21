import Disk from "./draw/Disk";
import Color from "./draw/Color";
import Parameters from "./draw/Parameters";

export default class UiControls {
    static init(controls: HTMLFieldSetElement, par: Parameters, disk: Disk): void {
        controls.addEventListener("change", (ev) => {
            const el = ev.target as HTMLInputElement;
            switch (el.name) {
                case "control-n":
                case "control-k":
                case "control-quasiregular":
                    par.n = UiControls.getRadioValue(controls, "control-n");
                    par.k = UiControls.getRadioValue(controls, "control-k");
                    par.quasiregular = UiControls.getCheckboxValue(controls, "control-quasiregular");
                    disk.init();
                    UiControls.updateControls(controls, par);
                    break;
                case "control-fill":
                    par.fill = UiControls.getCheckboxValue(controls, "control-fill");
                    break;
                case "control-outline":
                    par.outline = UiControls.getCheckboxValue(controls, "control-outline");
                    break;
                case "control-pattern":
                    par.pattern = UiControls.getCheckboxValue(controls, "control-pattern");
                    break;
                case "control-diskcolor":
                    par.diskColor = Color.fromIx(UiControls.getRadioValue(controls, "control-diskcolor"));
                    break;
                case "control-fillcolor":
                    par.fillColor = Color.fromIx(UiControls.getRadioValue(controls, "control-fillcolor"));
                    break;
                case "control-outlinecolor":
                    par.outlineColor = Color.fromIx(UiControls.getRadioValue(controls, "control-outlinecolor"));
                    break;
                case "control-patterncolor":
                    par.patternColors[0] = Color.fromIx(UiControls.getRadioValue(controls, "control-patterncolor"));
                    break;
            }
            disk.update();
        });

        UiControls.updateControls(controls, par);
    }

    private static getRadioValue(controls: HTMLFieldSetElement, radioName: string): number {
        const qs = `input[name="${radioName}"]:checked`;
        const el = controls.querySelector(qs) as HTMLInputElement;
        if (!el) { return 0; }
        const n = parseInt(el.value, 10);
        return n;
    }

    private static setRadioValue(controls: HTMLFieldSetElement, radioName: string, val: number): void {
        const qs = `input[name="${radioName}"][value="${val}"]`;
        const el = controls.querySelector(qs) as HTMLInputElement;
        if (el) { el.checked = true; }
    }

    private static getCheckboxValue(controls: HTMLFieldSetElement, checkboxName: string): boolean {
        const qs = `input[name="${checkboxName}"]`;
        const el = controls.querySelector(qs) as HTMLInputElement;
        return el ? el.checked : false;
    }

    private static setCheckboxValue(controls: HTMLFieldSetElement, checkboxName: string, val: boolean): void {
        const qs = `input[name="${checkboxName}"]`;
        const el = controls.querySelector(qs) as HTMLInputElement;
        if (el) { el.checked = val; }
    }

    private static updateControls(controls: HTMLFieldSetElement, par: Parameters): void {
        UiControls.setRadioValue(controls, "control-n", par.n);
        UiControls.setRadioValue(controls, "control-k", par.k);
        UiControls.setCheckboxValue(controls, "control-quasiregular", par.quasiregular);
        UiControls.setRadioValue(controls, "control-diskcolor", par.diskColor.toIx());
        UiControls.setCheckboxValue(controls, "control-fill", par.fill);
        UiControls.setRadioValue(controls, "control-fillcolor", par.fillColor.toIx());
        UiControls.setCheckboxValue(controls, "control-outline", par.outline);
        UiControls.setRadioValue(controls, "control-outlinecolor", par.outlineColor.toIx());
        UiControls.setCheckboxValue(controls, "control-pattern", par.pattern);
        UiControls.setRadioValue(controls, "control-patterncolor", par.patternColors[0].toIx());
    }
}