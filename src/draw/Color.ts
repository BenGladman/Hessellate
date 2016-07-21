export default class Color {
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
        const css = `hsl(${this.h},${this.s}%,${this.l}%)`;
        return css;
    }

    /**
     * Return similar colour with different lightness.
     * @param lightnessDelta Change in lightness.
     */
    public shade(lightnessDelta: number): Color {
        let newl = Math.floor(this.l + lightnessDelta);
        newl = Math.max(0, newl);
        newl = Math.min(100, newl);
        return new Color(this.h, this.s, newl);
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

    static Red = new Color(0, 50, 40);
    static Orange = new Color(30, 50, 40);
    static Yellow = new Color(60, 50, 60);
    static Green = new Color(120, 30, 40);
    static Blue = new Color(240, 30, 40);
    static Purple = new Color(313, 50, 60);
    static Black = new Color(0, 0, 10);
    static Grey1 = new Color(0, 0, 30);
    static Grey2 = new Color(0, 0, 80);
    static White = new Color(0, 0, 100);

    toIx(): number {
        switch (this) {
            case Color.Red: return 0;
            case Color.Orange: return 1;
            case Color.Yellow: return 2;
            case Color.Green: return 3;
            case Color.Blue: return 4;
            case Color.Purple: return 5;
            case Color.Black: return 6;
            case Color.Grey1: return 7;
            case Color.Grey2: return 8;
            default: return 9;
        }
    }

    static fromIx(ix: number): Color {
        switch (ix) {
            case 0: return Color.Red;
            case 1: return Color.Orange;
            case 2: return Color.Yellow;
            case 3: return Color.Green;
            case 4: return Color.Blue;
            case 5: return Color.Purple;
            case 6: return Color.Black;
            case 7: return Color.Grey1;
            case 8: return Color.Grey2;
            default: return Color.White;
        }
    }
}
