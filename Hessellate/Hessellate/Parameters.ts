/// <reference path="Color.ts" />
/// <reference path="Point.ts" />

namespace Hessellate {
    /**
     * Adapted to Typescript by Ben Gladman, 2015.
     * From http://aleph0.clarku.edu/~djoyce/poincare/PoincareB.html
     */
    export class Parameters {
        /**
         * The number of sides on a polygon.
         */
        n: number = 5;

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

        bgColor: Color = Color.White;
        diskColor: Color = Color.MidGrey;
        lineColor: Color = Color.DarkGrey;
        highlightTileColor: Color = Color.White;
        fill: boolean = true;
        grayScale: boolean;

        /**
         * Alternating colors
         */
        alternating: boolean;

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
         * Number of sides to rotate adjacent tiles.
         */
        rotateTile: number = 0;

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

            this.alternating = this.alternating && (this.k % 2 == 0);
        }

        public toString(): string {
            return `[n=${this.n},k=${this.k},layers=${this.layers}`
                +`,quasiregular=${this.quasiregular },alternating=${this.alternating }]`;
        }

    }
}