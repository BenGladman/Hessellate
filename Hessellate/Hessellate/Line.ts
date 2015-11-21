/// <reference path="Graphics.ts" />
/// <reference path="Point.ts" />
/// <reference path="ScreenCoordinateList.ts" />

namespace Hessellate {
    /**
     * Adapted to Typescript by Ben Gladman, 2015.
     * From http://aleph0.clarku.edu/~djoyce/poincare/PoincareB.html
     */
    export class Line {

        private A: Point;
        private B: Point;  // this is the line between A and B

        private isStraight: boolean;

        // if it's a circle, then a center C and radius r are needed

        private C: Point;
        private r: number;

        // if it's is a straight line, then a point P and a direction D
        // are needed

        private P: Point;
        private D: Point;

        constructor(A: Point, B: Point) {
            this.A = A; this.B = B;
            // first determine if its a line or a circle
            let den = A.x * B.y - B.x * A.y;
            this.isStraight = (Math.abs(den) < 1.0e-14);
            if (this.isStraight) {
                this.P = A; // a point on the line}
                // find a unit vector D in the direction of the line}
                den = Math.sqrt((A.x - B.x) * (A.x - B.x) + (A.y - B.y) * (A.y - B.y));
                this.D = new Point((B.x - A.x) / den,
                    (B.y - A.y) / den);
            } else { // it's a circle
                // find the center of the circle thru these points}
                let s1 = (1.0 + A.x * A.x + A.y * A.y) / 2.0;
                let s2 = (1.0 + B.x * B.x + B.y * B.y) / 2.0;
                this.C = new Point((s1 * B.y - s2 * A.y) / den,
                    (A.x * s2 - B.x * s1) / den);
                this.r = Math.sqrt(this.C.x * this.C.x + this.C.y * this.C.y - 1.0);
            }

        }

        public toString(): string {
            return `[${this.A},${this.B}]`;
        }

        /**
         * Reflect the point R thru the this line to get the returned point
         */
        public reflect(R: Point): Point {
            if (this.isStraight) {
                let factor = 2.0 * ((R.x - this.P.x) * this.D.x + (R.y - this.P.y) * this.D.y);
                return this.P.times(2).plus(this.D.times(factor).minus(R));
            } else {
                // it's a circle
                let factor = this.r * this.r / ((R.x - this.C.x) * (R.x - this.C.x) + (R.y - this.C.y) * (R.y - this.C.y));
                return this.C.plus(R.minus(this.C).times(factor));
            }
        }

        // append screen coordinates to the list in order to draw the line
        public appendScreenCoordinates(list: ScreenCoordinateList, g: Graphics) {
            let x_center = g.x_center;
            let y_center = g.y_center;
            let radius = Math.min(x_center, y_center);
            let x = Math.round(this.A.x * radius + x_center);
            let y = Math.round(this.A.y * radius + y_center);
            if ((list == null || x != list.x || y != list.y)
                && !isNaN(x) && !isNaN(y))
                list = new ScreenCoordinateList(list, x, y);
            if (this.isStraight) { // go directly to terminal point B
                x = Math.round(this.B.x * radius + x_center);
                y = Math.round(this.B.y * radius + y_center);
                if (x != list.x || y != list.y)
                    list = new ScreenCoordinateList(list, x, y);
            } else { // its an arc of a circle
                // determine starting and ending angles
                let alpha = Math.atan2((this.A.y - this.C.y), (this.A.x - this.C.x));
                let beta = Math.atan2((this.B.y - this.C.y), (this.B.x - this.C.x));
                if (Math.abs(beta - alpha) > Math.PI)
                    if (beta < alpha)
                        beta += 2.0 * Math.PI;
                    else
                        alpha += 2.0 * Math.PI;
                let curve = new CircularCurve(this.C.x, this.C.y, this.r);
                curve.setScreen(x_center, y_center, radius);
                list = curve.interpolate(list, alpha, beta);
            }
            return list;
        }

        public draw(g: Graphics): void {
            let x_center = g.x_center;
            let y_center = g.y_center;
            let radius = Math.min(x_center, y_center);
            // *** yet to write ***
        }

    }
}