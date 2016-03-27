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
        var css = `hsl(${this.h},${this.s}%,${this.l}%)`;
        return css;
    }

    public shade(seed: number, range: number): Color {
        const lmin = Math.max(0, this.l - range);
        const lmax = Math.min(100, this.l + range);

        seed = (seed * 9301 + 49297) % 233280;
        const rnd = seed / 233280;

        const newl = Math.floor(lmin + rnd * (lmax - lmin));
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

    static Black = new Color(0, 0, 0);
    static White = new Color(0, 0, 100);
    static MidGrey = new Color(0, 0, 80);
    static DarkGrey = new Color(0, 0, 20);
    static Purple = new Color(313, 70, 50);
    static Orange = new Color(46, 70, 50);
    static Yellow = new Color(60, 70, 50);
}