import Graphics from "./Graphics";
import Line from "./Line";
import Parameters from "./Parameters";
import Point from "./Point";
import Polygon from "./Polygon";
import Tile from "./Tile";

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
export default class Disk {

    /**
     * Parameters
     */
    private par: Parameters;

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
     * Graphics object for drawing.
     */
    private g: Graphics;

    constructor(par: Parameters, g: Graphics) {
        this.par = par;
        this.g = g;
    }

    public init(): void {
        this.par.checkPars();
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
        this.P[0] = this.constructCenterTile();
        this.rule[0] = 0;
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
            j++;

            let m = 0;
            if (special) { m = 2; }
            else if (s == 2 && r != 0) { m = 1; }

            for (; m < this.par.k - 3; ++m) {
                // Create a tile adjacent to P[j-1]
                this.P[j] = this.createNextTile(this.P[j - 1], 1);
                this.rule[j] = (this.par.n == 3 && m == this.par.k - 4) ? 1 : 2;
                j++;
            }
        }
        return j;
    }

    public constructCenterTile(): Tile {
        // Initialize P as the center polygon in an n-k regular or quasiregular tiling.
        // Let ABC be a triangle in a regular (n,k0-tiling, where
        //    A is the center of an n-gon (also center of the disk),
        //    B is a vertex of the n-gon, and
        //    C is the midpoint of a side of the n-gon adjacent to B.
        let angleA = Math.PI / this.par.n;
        let angleB = Math.PI / this.par.k;
        let angleC = Math.PI / 2.0;
        // For a regular tiling, we need to compute the distance s from A to B.
        let sinA = Math.sin(angleA);
        let sinB = Math.sin(angleB);
        let s = Math.sin(angleC - angleB - angleA)
            / Math.sqrt(1.0 - sinB * sinB - sinA * sinA);
        // But for a quasiregular tiling, we need the distance s from A to C.
        if (this.par.quasiregular) {
            s = (s * s + 1.0) / (2.0 * s * Math.cos(angleA));
            s = s - Math.sqrt(s * s - 1.0);
        }

        // Now determine the coordinates of the n vertices of the n-gon.
        // They're all at distance s from the center of the Poincare disk.
        let vertices: Point[] = [];
        for (let i = 0; i < this.par.n; ++i) {
            vertices.push(Point.fromPolar(s, (2 * i * angleA)));
        }
        const mainPolygon = new Polygon(vertices);

        const innerPolygons: Polygon[] = [];

        for (s = 1; s < this.par.n + 1; s += this.par.patternRepeat) {
            var v0arg = mainPolygon.getVertex(s).arg();
            var v1arg = mainPolygon.getVertex(s + 1).arg();
            if (v1arg < v0arg) { v1arg += 2 * Math.PI; }
            var arc = v1arg - v0arg;

            this.par.patternDefn.forEach((ppoly) => {
                innerPolygons.push(new Polygon(ppoly.map((pvert, i) => {
                    const rayangle = v0arg + arc * pvert[1];
                    const ray = new Line(Point.origin, Point.fromPolar(1, rayangle));

                    const side = pvert[1] < 0 ? mainPolygon.getEdge(s - 1)
                        : pvert[1] <= 1 ? mainPolygon.getEdge(s)
                            : mainPolygon.getEdge(s + 1)

                    const raysideintersection = side.intersection(ray);
                    if (raysideintersection[0]) {
                        const disttoside = raysideintersection[0].norm();
                        return Point.fromPolar(pvert[0] * disttoside, rayangle);
                    } else {
                        return Point.origin;
                    }
                })))
            });
        }

        return new Tile(Point.origin, mainPolygon, innerPolygons);
    }

    /**
     * Reflect P thru the point or the side indicated by the side s.
     */
    private createNextTile(tile: Tile, s: number): Tile {
        let rotateAngle = Math.PI * 2 * (this.par.patternRepeat - 1) / this.par.n;
        if (this.par.quasiregular) {
            let V = tile.getVertex(s);
            return tile.rotateInnerPolygons(rotateAngle).reflect(V, this.par.n - s);
        } else {
            // regular
            let C = new Line(tile.getVertex(s), tile.getVertex((s + 1) % this.par.n));
            return tile.rotateInnerPolygons(rotateAngle).reflect(C, this.par.n + s + 1, true);
        }
    }

    public update(): void {
        let x_center = this.g.x_center;
        let y_center = this.g.y_center;
        let radius = Math.min(x_center, y_center);
        this.g.fillRect(0, 0, this.g.width, this.g.height, this.par.bgColor);
        this.g.fillCircle(x_center, y_center, radius, this.par.diskColor);

        const tile2s = this.P.map((tile) => tile.moebius(this.par.moebiusZ0, this.par.moebiusT, this.par.detailLevel));

        if (this.par.fill) {
            tile2s.forEach((tile2, i) => {
                if (tile2) {
                    const c = (i === 0 && this.par.highlightCenter)
                        ? this.par.highlightTileColor
                        : this.par.fillColor;
                    tile2.fill(this.g, c);
                }
            });
        }

        if (this.par.outline) {
            tile2s.forEach((tile2) => {
                if (tile2) {
                    tile2.stroke(this.g, this.par.outlineColor);
                }
            });
        }

        if (this.par.pattern && this.par.patternDefn) {
            tile2s.forEach((tile2, i) => {
                if (tile2) {
                    tile2.fillInner(this.g, this.par.patternColors);
                }
            });
        }
    }
}