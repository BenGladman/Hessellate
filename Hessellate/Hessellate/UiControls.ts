import Disk from "./Disk";
import Parameters from "./Parameters";

export default class UiControls {
    static init = (controls: HTMLFieldSetElement, par: Parameters, disk: Disk) => {
        const getRadioValue = function (radioName: string): number {
            const qs = `input[name="${radioName}"]:checked`;
            const el = controls.querySelector(qs) as HTMLInputElement;
            if (!el) { return 0; }
            const n = parseInt(el.value, 10);
            return n;
        };

        const setRadioValue = function (radioName: string, val: number) {
            const qs = `input[name="${radioName}"][value="${val}"]`;
            const el = controls.querySelector(qs) as HTMLInputElement;
            if (el) { el.checked = true; }
        }

        const getCheckboxValue = function (checkboxName: string): boolean {
            const qs = `input[name="${checkboxName}"]`;
            const el = controls.querySelector(qs) as HTMLInputElement;
            return el ? el.checked : false;
        }

        const setCheckboxValue = function (checkboxName: string, val: boolean) {
            const qs = `input[name="${checkboxName}"]`;
            const el = controls.querySelector(qs) as HTMLInputElement;
            if (el) { el.checked = val; }
        }

        const updateControls = function () {
            setRadioValue("control-n", par.n);
            setRadioValue("control-k", par.k);
            setCheckboxValue("control-quasiregular", par.quasiregular);
            setCheckboxValue("control-fill", par.fill);
            setCheckboxValue("control-outline", par.outline);
            setCheckboxValue("control-pattern", par.pattern);
        }

        controls.addEventListener("change", (ev) => {
            const el = ev.target as HTMLInputElement;
            switch (el.name) {
                case "control-n":
                case "control-k":
                case "control-quasiregular":
                    par.n = getRadioValue("control-n");
                    par.k = getRadioValue("control-k");
                    par.quasiregular = getCheckboxValue("control-quasiregular");
                    disk.init();
                    updateControls();
                    disk.update();
                    break;

                case "control-fill":
                case "control-outline":
                case "control-pattern":
                    par.fill = getCheckboxValue("control-fill");
                    par.outline = getCheckboxValue("control-outline");
                    par.pattern = getCheckboxValue("control-pattern");
                    updateControls();
                    disk.update();
                    break;
            }
        });

        updateControls();
    }
}