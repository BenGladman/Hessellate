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

        public moebius(z0: Point, t: number, detailLevel = 0): Tile {
            let mcenter = this.center.moebius(z0, t);
            let mmain = this.mainPolygon.moebius(z0, t, detailLevel);
            let minner = this.innerPolygons.map((polygon) => polygon.moebius(z0, t, detailLevel));
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

        public static constructCenterTile(n: number, k: number, quasiregular: boolean): Tile {
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
            let vertices: Point[] = [];
            for (let i = 0; i < n; ++i) {
                let point = new Point(s * Math.cos((3 + 2 * i) * angleA),
                    s * Math.sin((3 + 2 * i) * angleA));
                vertices.push(point);
            }
            let mainPolygon = new Polygon(vertices);

            let innerPolygon = new Polygon([
                new Point(0.5, 0.15),
                new Point(0.2, 0.15),
                new Point(0.2, -0.15),
                new Point(0.5, -0.15)
            ]);

            return new Tile(Point.origin, mainPolygon, [innerPolygon]);
        }
    }
}