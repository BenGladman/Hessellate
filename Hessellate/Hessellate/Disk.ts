﻿/// <reference path="Color.ts" />
/// <reference path="Graphics.ts" />
/// <reference path="Tile.ts" />

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

        /**
         * Parameters
         */
        private par: Parameters;

        private alternating: boolean;

        /**
         * The list of tiles.
         */
        private P: Tile[];

        /**
         * Previously created neighbors for the tiles.
         */
        private rule: number[];

        /**
         * The total number of tiles in all the layers.
         */
        private totalTiles: number;

        /**
         * The number through one less layer.
         */
        private innerTiles: number;

        /**
         * This list of colors for the tiles.
         */
        private C: Color[];

        constructor(par: Parameters) {
            this.par = par;
        }

        public init(): void {
            this.alternating = this.par.alternating && (this.par.k % 2 == 0);
            this.countTiles(this.par.layers);
            this.determineTiles();
        }

        private countTiles(layer: number): void {
            // Determine
            //   totalTiles:  the number of tiles there are through that many layers
            //   innerTiles:  the number through one less layer
            this.totalTiles = 1;    // count the central tile
            this.innerTiles = 0;
            let a = this.par.n * (this.par.k - 3);  // tiles in first layer joined by a vertex
            let b = this.par.n;        // tiles in first layer joined by an edge
            let next_a: number;
            let next_b: number;
            if (this.par.k == 3) {
                for (let l = 1; l <= layer; ++l) {
                    this.innerTiles = this.totalTiles;
                    next_a = a + b;
                    next_b = (this.par.n - 6) * a + (this.par.n - 5) * b;
                    this.totalTiles += a + b;
                    a = next_a;
                    b = next_b;
                }
            } else { // k >= 4
                for (let l = 1; l <= layer; ++l) {
                    this.innerTiles = this.totalTiles;
                    next_a = ((this.par.n - 2) * (this.par.k - 3) - 1) * a
                    + ((this.par.n - 3) * (this.par.k - 3) - 1) * b;
                    next_b = (this.par.n - 2) * a + (this.par.n - 3) * b;
                    this.totalTiles += a + b;
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

        private determineTiles(): void {
            this.P = [];
            this.rule = [];
            this.C = [];
            this.P[0] = Tile.constructCenterTile(this.par.n, this.par.k, this.par.quasiregular);
            this.rule[0] = 0;
            this.C[0] = this.randomColor();
            let j = 1; // index of the next tile to create
            for (let i = 0; i < this.innerTiles; ++i) {
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
                // Create a tile adjacent to P[i]
                this.P[j] = this.createNextTile(this.P[i], s % this.par.n);
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
                    // Create a tile adjacent to P[j-1]
                    this.P[j] = this.createNextTile(this.P[j - 1], 1);
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
         * Reflect P thru the point or the side indicated by the side s.
         */
        private createNextTile(tile: Tile, s: number): Tile {
            if (this.par.quasiregular) {
                let V = tile.getVertex(s);
                return tile.reflect(V, this.par.n - s);
            } else {
                // regular
                let C = new Line(tile.getVertex(s), tile.getVertex((s + 1) % this.par.n));
                return tile.reflect(C, this.par.n + s + 1, true);
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

            this.P.forEach((tile, i) => {
                let tile2 = tile.moebius(this.par.moebiusZ0, this.par.moebiusT, this.par.detailLevel);
                if (tile2) {
                    let c = this.C[i];
                    if (i === 0 && this.par.highlightCenter) {
                        c = this.par.highlightTileColor;
                    }
                    if (this.par.fill) { tile2.fill(g, c); }
                    tile2.stroke(g, this.par.lineColor);
                }
            });
        }
    }
}