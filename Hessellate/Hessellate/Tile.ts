/// <reference path="Graphics.ts" />
/// <reference path="Point.ts" />
/// <reference path="Polygon.ts" />

namespace Hessellate {
    export class Tile {
        private center: Point;
        private mainPolygon: Polygon;
        private innerPolygons: Polygon[];

        constructor(center: Point, mainPolygon: Polygon, innerPolygons: Polygon[]) {
            this.center = center;
            this.mainPolygon = mainPolygon;
            this.innerPolygons = innerPolygons;
        }

        public getVertex(i: number): Point { return this.mainPolygon.getVertex(i); }

        public reflect(V: Point | Line, firstVertex: number, reverseDirection = false): Tile {
            let rcenter = V.reflect(this.center);
            let rmain = this.mainPolygon.reflect(V, firstVertex, reverseDirection);
            let rinner = this.innerPolygons.map((polygon) => polygon.reflect(V, 1));
            return new Tile(rcenter, rmain, rinner);
        }

        /**
         * Rotate around the tile center.
         */
        public rotateInnerPolygons(t: number): Tile {
            if (t === 0) { return this; }
            let rinner = this.innerPolygons.map((polygon) => polygon.moebius(this.center, t).moebius(this.center.negate(), 0));
            return new Tile(this.center, this.mainPolygon, rinner);
        }

        /**
         * Moebius transform.
         * @param z0
         * @param t
         * @param detailLevel If > 0, then null will be returned if the center of the tile is further away.
         */
        public moebius(z0: Point, t: number, detailLevel = 0): Tile {
            let mcenter = this.center.moebius(z0, t);
            if ((detailLevel > 0) && (mcenter.norm() > detailLevel)) { return null; }

            let mmain = this.mainPolygon.moebius(z0, t);
            let minner = this.innerPolygons.map((polygon) => polygon.moebius(z0, t));
            return new Tile(mcenter, mmain, minner);
        }

        public fill(g: Graphics, color: Color): void {
            if (this.innerPolygons && this.innerPolygons.length) {
                this.innerPolygons.forEach((polygon) => polygon && polygon.fill(g, color));
            } else if (this.mainPolygon) {
                this.mainPolygon.fill(g, color);
            }
        }

        public stroke(g: Graphics, color: Color): void {
            if (this.mainPolygon) {
                this.mainPolygon.stroke(g, color);
            }
        }
    }
}