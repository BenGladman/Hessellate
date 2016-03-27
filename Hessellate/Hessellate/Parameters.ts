import Color from "./Color";
import Point from "./Point";

/**
 * Adapted to Typescript by Ben Gladman, 2015.
 * From http://aleph0.clarku.edu/~djoyce/poincare/PoincareB.html
 */
export default class Parameters {
    /**
     * The number of sides on a polygon.
     */
    n: number = 6;

    /**
     * Vertex valence, the number of polygons that meet at each vertex.
     */
    k: number = 4;

    quasiregular: boolean;

    /**
     * The number of layers of polygons to display.
     */
    layers: number = 3;

    /**
     * Smallest tile to render (closer to 1 is smaller).
     */
    detailLevel: number = 0.99;

    bgColor = Color.White;
    diskColor = Color.MidGrey;

    outline = true;
    outlineColor = Color.DarkGrey;

    fill = true;
    fillColor = Color.Purple;
    highlightTileColor = Color.White;

    /**
     * Z0 argument in moebius transform.
     */
    moebiusZ0: Point = Point.origin;

    /**
     * t argument in moebius transform.
     */
    moebiusT: number = 0;

    /**
     * Whether to highlight the center tile.
     */
    highlightCenter: boolean = false;

    /**
     * Show or hide pattern.
     */
    pattern = false;

    patternDefn = [
        [[0.1, 0.5], [0.9, 0.1], [0.9, 0.9]]
    ];

    patternColors = [
        Color.Orange,
        Color.Yellow
    ];

    /**
     * How the pattern repeats:
     * 1 = Repeat for each side, 2 = Repeat every other side.
     */
    patternRepeat = 1;

    public checkPars(): void {
        // n should be between 3 and 20
        this.n = Math.max(this.n, 3);
        this.n = Math.min(this.n, 20);

        // k should be large enough, but no larger than 20
        if (this.n == 3) { this.k = Math.max(this.k, 7); }
        else if (this.n == 4) { this.k = Math.max(this.k, 5); }
        else if (this.n < 7) { this.k = Math.max(this.k, 4); }
        else { this.k = Math.max(this.k, 3); }

        this.k = Math.min(this.k, 20);

        // layers shouldn't be too big
        if (this.n == 3 || this.k == 3) {
            this.layers = Math.min(this.layers, 5);
        } else {
            this.layers = Math.min(this.layers, 4);
        }

    }

    public toString(): string {
        return `[n=${this.n},k=${this.k},layers=${this.layers}`
            + `,quasiregular=${this.quasiregular}]`;
    }
}