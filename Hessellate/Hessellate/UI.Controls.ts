/// <reference path="Disk.ts" />
/// <reference path="Parameters.ts" />

namespace Hessellate.UI.Controls {
    export function init(controls: HTMLFieldSetElement, par: Parameters, disk: Disk) {
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
            setCheckboxValue("control-alternating", par.alternating);
            setRadioValue("control-rotatetile", par.rotateTile);
        }

        controls.addEventListener("change", (ev) => {
            const el = ev.target as HTMLInputElement;
            switch (el.name) {
                case "control-n":
                case "control-k":
                case "control-quasiregular":
                case "control-alternating":
                case "control-rotatetile":
                    par.n = getRadioValue("control-n");
                    par.k = getRadioValue("control-k");
                    par.quasiregular = getCheckboxValue("control-quasiregular");
                    par.alternating = getCheckboxValue("control-alternating");
                    par.rotateTile = getRadioValue("control-rotatetile");
                    disk.init();
                    updateControls();
                    disk.update();
                    break;
            }
        });

        updateControls();
    }
}