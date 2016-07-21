import Color from "./Color";
import Graphics from "./Graphics";
import Line from "./Line";
import Point from "./Point";
import ScreenCoordinateList from "./ScreenCoordinateList";

/**
 * Adapted to Typescript by Ben Gladman, 2015.
 * From http://aleph0.clarku.edu/~djoyce/poincare/PoincareB.html
 */
export default class Polygon {

    /**
     * The number of sides.
     */
    private n: number;

    /**
     * The list of vertices
     */
    private vertices: Point[];

    /*
     * The list of edges
     */
    private edges: Line[];

    constructor(vertices: Point[]) {
        this.n = vertices.length;
        this.vertices = vertices;
        this.edges = vertices.map((v, i, arr) => new Line(v, arr[(i + 1) % arr.length]));
    }

    public getVertex(i: number): Point { return this.vertices[i % this.n]; }

    public getEdge(i: number): Line { return this.edges[i % this.n]; }

    public toString(): string {
        let S = "[";
        for (let i = 0; i < this.n; ++i) {
            S += this.vertices[i];
            if (i < this.n - 1) { S += ","; }
        }
        S += "]";
        return S;
    }

    /**
     * Reflect Polygon through a point or line.
     * @param V The point or line to reflect through.
     * @param firstVertex Index of the vertex in the returned polygon which is the reflected vertex 0 in this.
     * @param reverseDirection If true then the order of the vertices in the returned polygon will be the reverse order of this. 
     */
    public reflect(V: Point | Line, firstVertex: number, reverseDirection = false) {
        let vertices: Point[] = [];
        let j = firstVertex % this.n;

        this.vertices.forEach((vertex) => {
            vertices[j] = V.reflect(vertex);
            if (reverseDirection) {
                j -= 1;
                if (j === -1) { j = this.n - 1; }
            } else {
                j += 1;
                if (j === this.n) { j = 0; }
            }

        });

        return new Polygon(vertices);
    }

    /**
     * Moebius transform
     */
    public moebius(z0: Point, t: number): Polygon {
        let vertices: Point[] = [];

        this.vertices.forEach((vertex) => {
            let vt = vertex.moebius(z0, t);
            vertices.push(vt);
        });

        return new Polygon(vertices);
    }

    private setScreenCoordinateArrays(g: Graphics): ScreenCoordinateList {
        let pointList: ScreenCoordinateList = null;
        this.edges.forEach((edge) => {
            pointList = edge.appendScreenCoordinates(pointList, g);
        });
        return pointList;
    }

    public fill(g: Graphics, color: Color): void {
        let pointList = this.setScreenCoordinateArrays(g);
        g.fillPolygon(pointList, color);
    }

    public stroke(g: Graphics, color: Color): void {
        let pointList = this.setScreenCoordinateArrays(g);
        g.strokePolygon(pointList, color);
    }

}