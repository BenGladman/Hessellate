/// <reference path="Graphics.ts" />
/// <reference path="Point.ts" />
/// <reference path="ScreenCoordinateList.ts" />

namespace Hessellate {
    /**
     * Adapted to Typescript by Ben Gladman, 2015.
     * From http://aleph0.clarku.edu/~djoyce/poincare/PoincareB.html
     */
    export class Polygon {

        private n: number;  // the number of sides
        private V: Point[]; // the list of vertices

        constructor(n: number = 0) {
            this.n = n;
            this.V = [];
        }

        public getVertex(i: number): Point { return this.V[i]; }

        public setVertex(i: number, P: Point): void { this.V[i] = P; }

        public toString(): string {
            let S = "[";
            for (let i = 0; i < this.n; ++i) {
                S += this.V[i];
                if (i < this.n - 1) { S += ","; }
            }
            S += "]";
            return S;
        }

        public static constructCenterPolygon(n: number, k: number, quasiregular: boolean): Polygon {
            // Initialize P as the center polygon in an n-k regular or quasiregular tiling.
            // Let ABC be a triangle in a regular (n,k0-tiling, where
            //    A is the center of an n-gon (also center of the disk),
            //    B is a vertex of the n-gon, and
            //    C is the midpoint of a side of the n-gon adjacent to B.
            let angleA = Math.PI / n;
            let angleB = Math.PI / k;
            let angleC = Math.PI / 2.0;
            // For a regular tiling, we need to compute the distance s from A to B.
            let sinA = Math.sin(angleA);
            let sinB = Math.sin(angleB);
            let s = Math.sin(angleC - angleB - angleA)
                / Math.sqrt(1.0 - sinB * sinB - sinA * sinA);
            // But for a quasiregular tiling, we need the distance s from A to C.
            if (quasiregular) {
                s = (s * s + 1.0) / (2.0 * s * Math.cos(angleA));
                s = s - Math.sqrt(s * s - 1.0);
            }
            // Now determine the coordinates of the n vertices of the n-gon.
            // They're all at distance s from the center of the Poincare disk.
            let P = new Polygon(n);
            for (let i = 0; i < n; ++i) {
                P.V[i] = new Point(s * Math.cos((3 + 2 * i) * angleA),
                    s * Math.sin((3 + 2 * i) * angleA));
            }
            return P;
        }

        // in, ix, and iy are set in setScreenCoordinateArrays
        private icount: number;  // length of ix and iy
        private ix: number[];
        private iy: number[];

        private setScreenCoordinateArrays(g: Graphics): void {
            // first construct a list of all the points
            let pointList: ScreenCoordinateList = null;
            for (let i = 0; i < this.n; ++i) {
                pointList = (new Line(this.V[i], this.V[(i + 1) % this.n])).appendScreenCoordinates(pointList, g);
            }
            // determine its length
            this.icount = 0;
            for (let pl = pointList; pl != null; pl = pl.link)
                this.icount++;
            this.ix = [];
            this.iy = [];
            // now store the coordinates
            let pl = pointList;
            for (let i = 0; i < this.icount; i++) {
                this.ix[i] = pl.x;
                this.iy[i] = pl.y;
                pl = pl.link;
            }
            // implicitly return in, ix, and iy
        }

        public fill(g: Graphics): void {
            this.setScreenCoordinateArrays(g);
            g.fillPolygon(this.ix, this.iy, this.icount);
        }

        public draw(g: Graphics): void {
            this.setScreenCoordinateArrays(g);
            g.drawPolygon(this.ix, this.iy, this.icount);
        }

    }
}