namespace Hessellate {
    export class Color {
        private h: number;
        private s: number;
        private v: number;

        constructor(h: number, s: number, v: number) {
            this.h = h;
            this.s = s;
            this.v = v;
        }

        static random(grayScale: boolean): Color {
            if (grayScale) {
                return new Color(
                    0, // hue irrelevant
                    0, // no satuation
                    Math.random() // brightness
                );
            } else {
                return new Color(
                    Math.random(), // hue
                    Math.random(), // saturation
                    1 // full brightness
                );
            }
        }

        static black = new Color(0, 0, 0);
    }
}