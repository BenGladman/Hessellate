/// <reference path="Color.ts" />
/// <reference path="Graphics.ts" />
/// <reference path="Polygon.ts" />

namespace Hessellate {
    /*----------------------------------------------------------------------+
    |   Title:  PoincareDisk.java                                           |
    |                                                                       |
    |   Author: David E. Joyce                                              |
    |           Department of Mathematics and Computer Science              |
    |           Clark University                                            |
    |           Worcester, MA 01610-1477                                    |
    |           U.S.A.                                                      |                                                                       |
    |           http://aleph0.clarku.edu/~djoyce/                           |
    |                                                                       |
    |   Date:   April, 1987.  Pascal version for tektronix terminal         |
    |           December, 2002.  Java applet version                        |
    +----------------------------------------------------------------------*/

    /**
     * Adapted to Typescript by Ben Gladman, 2015.
     * From http://aleph0.clarku.edu/~djoyce/poincare/PoincareB.html
     */
    export class Disk {

        private par: Parameters; // parameters
        private alternating: boolean;

        private P: Polygon[]; // the list of polygons
        private rule: number[]; // previously created neighbors for the polygons
        private totalPolygons: number; // the total number of polygons in all the layers
        private innerPolygons: number; // the number through one less layer
        private C: Color[]; // this list of colors for the polygons

        constructor(par: Parameters) {
            this.par = par;
        }

        public init(): void {
            this.alternating = this.par.alternating && (this.par.k % 2 == 0);
            this.countPolygons(this.par.layers);
            this.determinePolygons();
        }

        private countPolygons(layer: number): void {
            // Determine
            //   totalPolygons:  the number of polygons there are through that many layers
            //   innerPolygons:  the number through one less layer
            this.totalPolygons = 1;    // count the central polygon
            this.innerPolygons = 0;
            let a = this.par.n * (this.par.k - 3);  // polygons in first layer joined by a vertex
            let b = this.par.n;        // polygons in first layer joined by an edge
            let next_a: number;
            let next_b: number;
            if (this.par.k == 3) {
                for (let l = 1; l <= layer; ++l) {
                    this.innerPolygons = this.totalPolygons;
                    next_a = a + b;
                    next_b = (this.par.n - 6) * a + (this.par.n - 5) * b;
                    this.totalPolygons += a + b;
                    a = next_a;
                    b = next_b;
                }
            } else { // k >= 4
                for (let l = 1; l <= layer; ++l) {
                    this.innerPolygons = this.totalPolygons;
                    next_a = ((this.par.n - 2) * (this.par.k - 3) - 1) * a
                    + ((this.par.n - 3) * (this.par.k - 3) - 1) * b;
                    next_b = (this.par.n - 2) * a + (this.par.n - 3) * b;
                    this.totalPolygons += a + b;
                    a = next_a;
                    b = next_b;
                }
            }
        }

        /* Rule codes
         *   0:  initial polygon.  Needs neighbors on all n sides
         *   1:  polygon already has 2 neighbors, but one less around corner needed
         *   2:  polygon already has 2 neighbors
         *   3:  polygon already has 3 neighbors
         *   4:  polygon already has 4 neighbors
         */

        private determinePolygons(): void {
            this.P = [];
            this.rule = [];
            this.C = [];
            this.P[0] = Polygon.constructCenterPolygon(this.par.n, this.par.k, this.par.quasiregular);
            this.rule[0] = 0;
            this.C[0] = this.randomColor();
            let j = 1; // index of the next polygon to create
            for (let i = 0; i < this.innerPolygons; ++i) {
                j = this.applyRule(i, j);
            }
        }

        private applyRule(i: number, j: number): number {
            let r = this.rule[i];
            let special = (r == 1);
            if (special) { r = 2; }
            let start = (r == 4) ? 3 : 2;
            let quantity = (this.par.k == 3 && r != 0) ? this.par.n - r - 1 : this.par.n - r;
            for (let s = start; s < start + quantity; ++s) {
                // Create a polygon adjacent to P[i]
                this.P[j] = this.createNextPolygon(this.P[i], s % this.par.n);
                this.rule[j] = (this.par.k == 3 && s == start && r != 0) ? 4 : 3;
                if (this.alternating && j > 1) {
                    this.C[j] = (this.C[i] == this.C[0]) ? this.C[1] : this.C[0];
                } else {
                    this.C[j] = this.randomColor();
                }
                j++;

                let m = 0;
                if (special) { m = 2; }
                else if (s == 2 && r != 0) { m = 1; }

                for (; m < this.par.k - 3; ++m) {
                    // Create a polygon adjacent to P[j-1]
                    this.P[j] = this.createNextPolygon(this.P[j - 1], 1);
                    this.rule[j] = (this.par.n == 3 && m == this.par.k - 4) ? 1 : 2;
                    if (this.alternating) {
                        this.C[j] = (this.C[j - 1] == this.C[0]) ? this.C[1] : this.C[0];
                    } else {
                        this.C[j] = this.randomColor();
                    }
                    j++;
                }
            }
            return j;
        }
  
        /**
         * Reflect P thru the point or the side indicated by the side s
         * to produce the resulting polygon Q
         */
        private createNextPolygon(P: Polygon, s: number): Polygon {
            if (this.par.quasiregular) {
                let V = P.getVertex(s);
                return P.reflect(V, this.par.n - s);
            } else {
                // regular
                let C = new Line(P.getVertex(s), P.getVertex((s + 1) % this.par.n));
                return P.reflect(C, this.par.n + s + 1, true);
            }
        }

        private randomColor(): Color {
            if (this.par.grayScale) {
                return Color.randomGray();
            } else {
                return Color.randomColor(30, 60);
            }
        }

        public update(g: Graphics): void {
            let x_center = g.x_center;
            let y_center = g.y_center;
            let radius = Math.min(x_center, y_center);
            g.fillRect(0, 0, g.width, g.height, this.par.bgColor);
            g.fillCircle(x_center, y_center, radius, this.par.diskColor);

            this.P.forEach((polygon, i) => {
                let polygon2 = polygon.moebius(this.par.moebiusZ0, this.par.moebiusT, this.par.detailLevel);
                if (polygon2) {
                    let c = this.C[i];
                    if (i === 0 && this.par.highlightCenter) {
                        c = this.par.highlightPolygonColor;
                    }
                    if (this.par.fill) { polygon2.fill(g, c); }
                    polygon2.stroke(g, this.par.lineColor);
                }
            });
        }
    }
}