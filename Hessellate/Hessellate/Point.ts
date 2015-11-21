namespace Hessellate {
    /**
     * Adapted to Typescript by Ben Gladman, 2015.
     * From http://aleph0.clarku.edu/~djoyce/poincare/PoincareB.html
     */
    export class Point {
        public x: number;
        public y: number;

        constructor(xVal: number = 0, yVal: number = 0) {
            this.x = xVal;
            this.y = yVal;
            if (!isFinite(this.x) || isNaN(this.x) || !isFinite(this.y) || isNaN(this.y)) {
                console.error(`Point undefined: ${this}`);
            }
        }

        public toString(): string {
            return `(${this.x},${this.y})`;
        }

        /**
         * Create a point from polar coordinates.
         * @param r Magintude
         * @param t Argument (angle)
         */
        static fromPolar(r: number, t: number) {
            return new Point(r * Math.cos(t), r * Math.sin(t))
        }

        /**
         * Reflect the point A through this point B to get the returned point C.
         * The rule for computing A thru B (as Point numbers) is:		|
         *
         *            B - t A	         where t = (1+BB')/2, and
         * A |> B = -----------               B' is the Point
         *           t -  A B'                conjugate of B
         */
        public reflect(A: Point): Point {
            let t = (1.0 + this.normSquared()) / 2.0;
            // compute the numerator as  B - t * A
            let numerator = this.minus(A.times(t));
            // compute the denominator as  t - A * B'
            let denominator = Point.subtract(t, A.times(this.conjugate()));
            return numerator.over(denominator);
        }

        /**
         * Moebius transform
         * http://archive.ncsa.illinois.edu/Classes/MATH198/whubbard/GRUMC/geometryExplorer/help/noneuclid/examples-moebius.html
         */
        public moebius(z0: Point, t: number): Point {
            // e ^ it = cos(t) + i sin(t)
            let eit = new Point(Math.cos(t), Math.sin(t));
            let numerator = this.minus(z0);
            let denominator = Point.subtract(1, this.times(z0.conjugate()));
            return eit.times(numerator).over(denominator);
        }

        public translate(translateX: number, translateY: number): Point {
            return this.moebius(new Point(-translateX, -translateY), 0);
        }

        public rotate(t: number): Point {
            return this.moebius(Point.origin, t);
        }

        static origin = new Point(0, 0);

        // Complex number methods

        /**
         * Find the inner product when the numbers are treated as vectors
         */
        public innerProduct(w: Point): number {
            return this.x * w.x + this.y * w.y;
        }

        public static innerProduct(z: Point, w: Point): number {
            return z.x * w.x + z.y * w.y;
        }

        public normSquared(): number {
            return this.x * this.x + this.y * this.y;
        }

        public norm(): number {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        }

        /**
         * Argument of point (angle from X axis)
         */
        public arg(): number {
           return  Math.atan2(this.y, this.x);
        }

        public conjugate(): Point {
            return new Point(this.x, -this.y);
        }

        public negate(): Point {
            return new Point(-this.x, -this.y);
        }

        public minus(w: Point | number): Point {
            if (w instanceof Point) {
                return new Point(this.x - w.x, this.y - w.y);
            } else if (typeof w === "number") {
                return new Point(this.x - w, this.y);
            } else {
                return Point.origin;
            }
        }

        public static subtract(z: Point | number, w: Point | number): Point {
            if (z instanceof Point && w instanceof Point) {
                return new Point(z.x - w.x, z.y - w.y);
            } else if (typeof z === "number" && w instanceof Point) {
                return new Point(z - w.x, -w.y);
            } else if (z instanceof Point && typeof w === "number") {
                return new Point(z.x - w, z.y);
            } else if (typeof z === "number" && typeof w === "number") {
                return new Point(z - w, 0);
            } else {
                return Point.origin;
            }
        }

        public plus(w: Point | number): Point {
            if (w instanceof Point) {
                return new Point(this.x + w.x, this.y + w.y);
            } else if (typeof w === "number") {
                return new Point(this.x + w, this.y);
            } else {
                return Point.origin;
            }
        }

        public static add(z: Point | number, w: Point | number): Point {
            if (z instanceof Point && w instanceof Point) {
                return new Point(z.x + w.x, z.y + w.y);
            } else if (typeof z === "number" && w instanceof Point) {
                return new Point(z + w.x, w.y);
            } else if (z instanceof Point && typeof w === "number") {
                return new Point(z.x + w, z.y);
            } else if (typeof z === "number" && typeof w === "number") {
                return new Point(z + w, 0);
            } else {
                return Point.origin;
            }
        }

        public times(w: Point | number): Point {
            if (w instanceof Point) {
                return new Point(this.x * w.x - this.y * w.y, this.y * w.x + this.x * w.y);
            } else if (typeof w === "number") {
                return new Point(w * this.x, w * this.y);
            } else {
                return Point.origin;
            }
        }

        public static multiply(z: Point | number, w: Point | number): Point {
            if (z instanceof Point && w instanceof Point) {
                return new Point(z.x * w.x - z.y * w.y, z.y * w.x + z.x * w.y);
            } else if (typeof z === "number" && w instanceof Point) {
                return new Point(z * w.x, z * w.y);
            } else if (z instanceof Point && typeof w === "number") {
                return new Point(w * z.x, w * z.y);
            } else if (typeof z === "number" && typeof w === "number") {
                return new Point(z * w, 0);
            } else {
                return Point.origin;
            }
        }

        public reciprocal(): Point {
            let den = this.normSquared();
            return new Point(this.x / den, -this.y / den);
        }

        public over(w: Point | number): Point {
            if (w instanceof Point) {
                let den = w.normSquared();
                return new Point((this.x * w.x + this.y * w.y) / den, (this.y * w.x - this.x * w.y) / den);
            } else if (typeof w === "number") {
                return new Point(this.x / w, this.y / w);
            }
        }

        public static divide(z: Point | number, w: Point | number): Point {
            if (z instanceof Point && w instanceof Point) {
                let den = w.normSquared();
                return new Point((z.x * w.x + z.y * w.y) / den, (z.y * w.x - z.x * w.y) / den);
            } else if (typeof z === "number" && w instanceof Point) {
                let den = w.normSquared();
                return new Point(z * w.x / den, -z * w.y / den);
            } else if (z instanceof Point && typeof w === "number") {
                return new Point(z.x / w, z.y / w);
            } else if (typeof z === "number" && typeof w === "number") {
                return new Point(z / w, 0);
            } else {
                return Point.origin;
            }
        }
    }
}