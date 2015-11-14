namespace Hessellate {
    export class Color {
        private h: number;
        private s: number;
        private l: number;

        /**
         * @param h hue integer 0-359
         * @param s saturation integer 0-100
         * @param l lightness integer 0-100
         */
        constructor(h: number = 0, s: number = 0, l: number = 0) {
            this.h = Math.floor(h);
            this.s = Math.floor(s);
            this.l = Math.floor(l);
        }

        /**
         * CSS color string
         */
        get css(): string {
            var css = `hsl(${this.h},${this.s}%,${this.l}%)`;
            return css;
        }

        static randomGray(): Color {
            return new Color(
                0, // hue irrelevant
                0, // no satuation
                Math.random() * 100 // lightness
            );
        }

        static randomColor(s: number, l: number) {
            return new Color(
                Math.random() * 360, // hue
                s, // saturation
                l // full lightness
            );
        }

        static Black = new Color(0, 0, 0);
        static White = new Color(0, 0, 100);
        static MidGrey = new Color(0, 0, 80);
        static DarkGrey = new Color(0, 0, 20);
    }
}