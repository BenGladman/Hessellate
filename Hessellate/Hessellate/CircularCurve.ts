import Curve from "./Curve";

/**
 * Adapted to Typescript by Ben Gladman, 2015.
 * From http://aleph0.clarku.edu/~djoyce/poincare/PoincareB.html
 */
export default class CircularCurve extends Curve {
    // The circle in the complex plane
    private x_coord: number;
    private y_coord: number; // coordinates of the center of the circle
    private r: number;       // radius of the circle

    constructor(x: number, y: number, r: number) {
        super();
        this.set(x, y, r);
    }

    public set(x: number, y: number, r: number): void {
        this.x_coord = x;
        this.y_coord = y;
        this.r = r;
    }

    public x(t: number): number {
        return this.x_coord + this.r * Math.cos(t);
    }

    public y(t: number): number {
        return this.y_coord + this.r * Math.sin(t);
    }
}