import Line from "./Line";
import Point from "./Point";
import Polygon from "./Polygon";
import Tile from "./Tile";

export interface GenerateParameters {
    /**
     * The number of sides on a polygon.
     */
    n?: number;

    /**
     * Vertex valence, the number of polygons that meet at each vertex.
     */
    k?: number;

    /**
     * The number of layers of polygons to display.
     */
    layers?: number;

    quasiregular?: boolean;

    patternDefn?: number[][][];

    /**
     * How the pattern repeats:
     * 1 = Repeat for each side, 2 = Repeat every other side.
     */
    patternRepeat?: number;
}

export function defaultGenerateParameters(): GenerateParameters {
    return {
        n: 5,
        k: 4,
        quasiregular: false,
        layers: 3,
        patternDefn: [
            [[0.6, 0.5], [1, 0.1], [1, 0.9]]
        ],
        patternRepeat: 1,
    };
}

function countTiles(par: GenerateParameters) {
    const layer = par.layers;
    // Determine
    //   totalTiles:  the number of tiles there are through that many layers
    //   innerTiles:  the number through one less layer
    let totalTiles = 1;    // count the central tile
    let innerTiles = 0;
    let a = par.n * (par.k - 3);  // tiles in first layer joined by a vertex
    let b = par.n;        // tiles in first layer joined by an edge
    let next_a: number;
    let next_b: number;
    if (par.k === 3) {
        for (let l = 1; l <= layer; ++l) {
            innerTiles = totalTiles;
            next_a = a + b;
            next_b = (par.n - 6) * a + (par.n - 5) * b;
            totalTiles += a + b;
            a = next_a;
            b = next_b;
        }
    } else { // k >= 4
        for (let l = 1; l <= layer; ++l) {
            innerTiles = totalTiles;
            next_a = ((par.n - 2) * (par.k - 3) - 1) * a
                + ((par.n - 3) * (par.k - 3) - 1) * b;
            next_b = (par.n - 2) * a + (par.n - 3) * b;
            totalTiles += a + b;
            a = next_a;
            b = next_b;
        }
    }

    return { totalTiles, innerTiles };
}

/* Rule codes
 *   0:  initial polygon.  Needs neighbors on all n sides
 *   1:  polygon already has 2 neighbors, but one less around corner needed
 *   2:  polygon already has 2 neighbors
 *   3:  polygon already has 3 neighbors
 *   4:  polygon already has 4 neighbors
 */

function determineTiles(innerTiles: number, par: GenerateParameters) {
    const tiles: Tile[] = [];
    const rule: number[] = [];
    tiles[0] = constructCenterTile(par);
    rule[0] = 0;
    let j = 1; // index of the next tile to create
    for (let i = 0; i < innerTiles; ++i) {
        j = applyRule(i, j, tiles, rule, par);
    }
    return tiles;
}

function applyRule(i: number, j: number, tiles: Tile[], rule: number[], par: GenerateParameters): number {
    let r = rule[i];
    let special = (r === 1);
    if (special) { r = 2; }
    let start = (r === 4) ? 3 : 2;
    let quantity = (par.k === 3 && r !== 0) ? par.n - r - 1 : par.n - r;
    for (let s = start; s < start + quantity; ++s) {
        // Create a tile adjacent to P[i]
        tiles[j] = createNextTile(tiles[i], s % par.n, par);
        rule[j] = (par.k === 3 && s === start && r !== 0) ? 4 : 3;
        j++;

        let m = 0;
        if (special) { m = 2; }
        else if (s === 2 && r !== 0) { m = 1; }

        for (; m < par.k - 3; ++m) {
            // Create a tile adjacent to P[j-1]
            tiles[j] = createNextTile(tiles[j - 1], 1, par);
            rule[j] = (par.n === 3 && m === par.k - 4) ? 1 : 2;
            j++;
        }
    }
    return j;
}

function constructCenterTile(par: GenerateParameters): Tile {
    // Initialize P as the center polygon in an n-k regular or quasiregular tiling.
    // Let ABC be a triangle in a regular (n,k0-tiling, where
    //    A is the center of an n-gon (also center of the disk),
    //    B is a vertex of the n-gon, and
    //    C is the midpoint of a side of the n-gon adjacent to B.
    let angleA = Math.PI / par.n;
    let angleB = Math.PI / par.k;
    let angleC = Math.PI / 2.0;
    // For a regular tiling, we need to compute the distance s from A to B.
    let sinA = Math.sin(angleA);
    let sinB = Math.sin(angleB);
    let s = Math.sin(angleC - angleB - angleA)
        / Math.sqrt(1.0 - sinB * sinB - sinA * sinA);
    // But for a quasiregular tiling, we need the distance s from A to C.
    if (par.quasiregular) {
        s = (s * s + 1.0) / (2.0 * s * Math.cos(angleA));
        s = s - Math.sqrt(s * s - 1.0);
    }

    // Now determine the coordinates of the n vertices of the n-gon.
    // They're all at distance s from the center of the Poincare disk.
    let vertices: Point[] = [];
    for (let i = 0; i < par.n; ++i) {
        vertices.push(Point.fromPolar(s, (2 * i * angleA)));
    }
    const mainPolygon = new Polygon(vertices);

    const innerPolygons: Polygon[] = [];

    for (s = 1; s < par.n + 1; s += par.patternRepeat) {
        const v0arg = mainPolygon.getVertex(s).arg();
        let v1arg = mainPolygon.getVertex(s + 1).arg();
        if (v1arg < v0arg) { v1arg += 2 * Math.PI; }
        const arc = v1arg - v0arg;

        par.patternDefn.forEach((ppoly) => {
            innerPolygons.push(new Polygon(ppoly.map((pvert, i) => {
                const rayangle = v0arg + arc * pvert[1];
                const ray = new Line(Point.origin, Point.fromPolar(1, rayangle));

                const side = pvert[1] < 0 ? mainPolygon.getEdge(s - 1)
                    : pvert[1] <= 1 ? mainPolygon.getEdge(s)
                        : mainPolygon.getEdge(s + 1);

                const raysideintersection = side.intersection(ray);
                if (raysideintersection[0]) {
                    const disttoside = raysideintersection[0].norm();
                    return Point.fromPolar(pvert[0] * disttoside, rayangle);
                } else {
                    return Point.origin;
                }
            })));
        });
    }

    return new Tile(Point.origin, mainPolygon, innerPolygons);
}

/**
 * Reflect P thru the point or the side indicated by the side s.
 */
function createNextTile(tile: Tile, s: number, par: GenerateParameters): Tile {
    let rotateAngle = Math.PI * 2 * (par.patternRepeat - 1) / par.n;
    if (par.quasiregular) {
        let V = tile.getVertex(s);
        return tile.rotateInnerPolygons(rotateAngle).reflect(V, par.n - s);
    } else {
        // regular
        let C = new Line(tile.getVertex(s), tile.getVertex((s + 1) % par.n));
        return tile.rotateInnerPolygons(rotateAngle).reflect(C, par.n + s + 1, true);
    }
}

export function generate(par: GenerateParameters) {
    const { innerTiles } = countTiles(par);
    const tiles = determineTiles(innerTiles, par);
    return tiles;
}
