/// <reference path="Graphics.ts" />
/// <reference path="Point.ts" />
/// <reference path="ScreenCoordinateList.ts" />

namespace Hessellate {
    /**
     * Adapted to Typescript by Ben Gladman, 2015.
     * From http://aleph0.clarku.edu/~djoyce/poincare/PoincareB.html
     */
    export class Line {
        /**
         * Start of line segment.
         */
        private A: Point;

        /**
         * End of line segment.
         */
        private B: Point;

        private isStraight: boolean;

        /*
         * Center of circle (if not straight).
         */
        private C: Point;

        /**
         * Radius of circle (if not straight).
         */
        private r: number;

        /**
         * Point on line (if straight).
         */
        private P: Point;

        /**
         * Direction (if straight).
         */
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

        /**
         * Calculate intersection point (or points) of this line and another.
         */
        public intersection(L: Line): [Point, Point] {
            if (this.isStraight && L.isStraight) {
                return [Line.ssIntersection(this, L), null];

            } else if (this.isStraight) {
                return Line.scIntersection(this, L);

            } else if (L.isStraight) {
                return Line.scIntersection(L, this);

            } else {
                // todo
                throw new Error("Not supported.");
            }
        }

        /**
         * Calculate intersection point of two straight lines.
         * From http://stackoverflow.com/questions/385305/efficient-maths-algorithm-to-calculate-intersections
         */
        private static ssIntersection(s1: Line, s2: Line): Point {

            const x1 = s1.A.x;
            const y1 = s1.A.y;
            const x2 = s1.B.x;
            const y2 = s1.B.y;
            const x3 = s2.A.x;
            const y3 = s2.A.y;
            const x4 = s2.B.x;
            const y4 = s2.B.y;

            const x12 = x1 - x2;
            const x34 = x3 - x4;
            const y12 = y1 - y2;
            const y34 = y3 - y4;

            const c = x12 * y34 - y12 * x34;

            if (Math.abs(c) < 0.01) {
                // No intersection
                return null;
            } else {
                // Intersection
                const a = x1 * y2 - y1 * x2;
                const b = x3 * y4 - y3 * x4;

                const x = (a * x34 - b * x12) / c;
                const y = (a * y34 - b * y12) / c;

                return new Point(x, y);
            }
        }

        /**
         * Calculate intersection point(s) of a straight line and a circle.
         * From http://stackoverflow.com/questions/13053061/circle-line-intersection-points
         */
        private static scIntersection(straight: Line, circle: Line): [Point, Point] {
            const baX = straight.B.x - straight.A.x;
            const baY = straight.B.y - straight.A.y;
            const caX = circle.C.x - straight.A.x;
            const caY = circle.C.y - straight.A.y;

            const a = baX * baX + baY * baY;
            const bBy2 = baX * caX + baY * caY;
            const c = caX * caX + caY * caY - circle.r * circle.r;

            const pBy2 = bBy2 / a;
            const q = c / a;

            const disc = pBy2 * pBy2 - q;
            if (disc < 0) {
                return [null, null];
            }

            // if disc == 0 ... dealt with later
            const tmpSqrt = Math.sqrt(disc);
            const abScalingFactor1 = -pBy2 + tmpSqrt;
            const abScalingFactor2 = -pBy2 - tmpSqrt;

            const p1 = new Point(straight.A.x - baX * abScalingFactor1, straight.A.y - baY * abScalingFactor1);
            if (disc === 0) { // abScalingFactor1 == abScalingFactor2
                return [p1, null];
            }

            const p2 = new Point(straight.A.x - baX * abScalingFactor2, straight.A.y - baY * abScalingFactor2);
            if (p1.norm() < p2.norm()) {
                return [p1, p2];
            } else {
                return [p2, p1];
            }
        }

        /**
         * Append screen coordinates to the list in order to draw the line.
         */
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