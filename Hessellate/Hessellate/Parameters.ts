/// <reference path="Color.ts" />
/// <reference path="Point.ts" />

namespace Hessellate {
    /**
     * Adapted to Typescript by Ben Gladman, 2015.
     * From http://aleph0.clarku.edu/~djoyce/poincare/PoincareB.html
     */
    export class Parameters {

        n: number; // the number of sides on a polygon
        k: number; // vertex valence, the number of polygons that meet at each vertex
        quasiregular: boolean;
        layers: number; // the number of layers of polygons to display
        detailLevel: number = 0.995;
        bgColor: Color = Color.White;
        diskColor: Color = Color.MidGrey;
        lineColor: Color = Color.DarkGrey;
        highlightTileColor: Color = Color.White;
        fill: boolean;
        grayScale: boolean;
        alternating: boolean; // alternating colors
        moebiusZ0: Point = Point.origin;
        moebiusT: number = 0;
        highlightCenter: boolean = false;

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
                +`,quasiregular=${this.quasiregular },alternating=${this.alternating }]`;
        }

    }
}