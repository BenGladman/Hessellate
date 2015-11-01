/// <reference path="Complex.ts" />

namespace Hessellate {
    /**
     * Adapted to Typescript by Ben Gladman, 2015.
     * From http://aleph0.clarku.edu/~djoyce/poincare/PoincareB.html
     */
    export class Point extends Complex {

        constructor(xVal: number = 0, yVal: number = 0) {
            super(xVal, yVal);
            if (!isFinite(this.x) || isNaN(this.x) || !isFinite(this.y) || isNaN(this.y)) {
                console.error(`Point undefined: ${this}`);
            }
        }

        public toString(): string {
            return `(${this.x},${this.y})`;
        }

        /* Reflect the point A through this point B to get the returned point C.
         * The rule for computing A thru B (as complex numbers) is:		|
         *
         *            B - t A	         where t = (1+BB')/2, and
         * A |> B = -----------               B' is the complex
         *           t -  A B'                conjugate of B
         */
        public reflect(A: Point): Point {
            let t = (1.0 + this.normSquared()) / 2.0;
            // compute the numerator as  B - t * A
            let numerator = this.minus(A.times(t));
            // compute the denominator as  t - A * B'
            let denominator = Complex.subtract(t, A.times(this.conjugate()));
            let C = numerator.over(denominator);
            return new Point(C.x, C.y);
        }
    }
}