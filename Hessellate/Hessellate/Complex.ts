namespace Hessellate {

    /**
     * Adapted to Typescript by Ben Gladman, 2015.
     * From http://aleph0.clarku.edu/~djoyce/poincare/PoincareB.html
     */
    export class Complex {

        public x: number;
        public y: number;

        constructor(x: number = 0, y: number = 0) {
            this.x = x;
            this.y = y;
        }

        public toString(): string {
            return `${this.x}+${this.y}i`;
        }

        /**
         * Find the inner product when the numbers are treated as vectors
         */
        public innerProduct(w: Complex): number {
            return this.x * w.x + this.y * w.y;
        }

        public static innerProduct(z: Complex, w: Complex): number {
            return z.x * w.x + z.y * w.y;
        }

        public normSquared(): number {
            return this.x * this.x + this.y * this.y;
        }

        public norm(): number {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        }

        public conjugate(): Complex {
            return new Complex(this.x, -this.y);
        }

        public negation(): Complex {
            return new Complex(-this.x, this.y);
        }

        public minus(w: Complex | number): Complex {
            if (w instanceof Complex) {
                return new Complex(this.x - w.x, this.y - w.y);
            } else if (typeof w === "number") {
                return new Complex(this.x - w, this.y);
            } else {
                return new Complex(0, 0);
            }
        }

        public static subtract(z: Complex | number, w: Complex | number): Complex {
            if (z instanceof Complex && w instanceof Complex) {
                return new Complex(z.x - w.x, z.y - w.y);
            } else if (typeof z === "number" && w instanceof Complex) {
                return new Complex(z - w.x, -w.y);
            } else if (z instanceof Complex && typeof w === "number") {
                return new Complex(z.x - w, z.y);
            } else if (typeof z === "number" && typeof w === "number") {
                return new Complex(z - w, 0);
            } else {
                return new Complex(0, 0);
            }
        }

        public plus(w: Complex | number): Complex {
            if (w instanceof Complex) {
                return new Complex(this.x + w.x, this.y + w.y);
            } else if (typeof w === "number") {
                return new Complex(this.x + w, this.y);
            } else {
                return new Complex(0, 0);
            }
        }

        public static add(z: Complex | number, w: Complex | number): Complex {
            if (z instanceof Complex && w instanceof Complex) {
                return new Complex(z.x + w.x, z.y + w.y);
            } else if (typeof z === "number" && w instanceof Complex) {
                return new Complex(z + w.x, w.y);
            } else if (z instanceof Complex && typeof w === "number") {
                return new Complex(z.x + w, z.y);
            } else if (typeof z === "number" && typeof w === "number") {
                return new Complex(z + w, 0);
            } else {
                return new Complex(0, 0);
            }
        }

        public times(w: Complex | number): Complex {
            if (w instanceof Complex) {
                return new Complex(this.x * w.x - this.y * w.y, this.y * w.x + this.x * w.y);
            } else if (typeof w === "number") {
                return new Complex(w * this.x, w * this.y);
            } else {
                return new Complex(0, 0);
            }
        }

        public static multiply(z: Complex | number, w: Complex | number): Complex {
            if (z instanceof Complex && w instanceof Complex) {
                return new Complex(z.x * w.x - z.y * w.y, z.y * w.x + z.x * w.y);
            } else if (typeof z === "number" && w instanceof Complex) {
                return new Complex(z * w.x, z * w.y);
            } else if (z instanceof Complex && typeof w === "number") {
                return new Complex(w * z.x, w * z.y);
            } else if (typeof z === "number" && typeof w === "number") {
                return new Complex(z * w, 0);
            } else {
                return new Complex(0, 0);
            }
        }

        public reciprocal(): Complex {
            let den = this.normSquared();
            return new Complex(this.x / den, -this.y / den);
        }

        public over(w: Complex | number): Complex {
            if (w instanceof Complex) {
                let den = w.normSquared();
                return new Complex((this.x * w.x + this.y * w.y) / den, (this.y * w.x - this.x * w.y) / den);
            } else if (typeof w === "number") {
                return new Complex(this.x / w, this.y / w);
            }
        }

        public static divide(z: Complex | number, w: Complex | number): Complex {
            if (z instanceof Complex && w instanceof Complex) {
                let den = w.normSquared();
                return new Complex((z.x * w.x + z.y * w.y) / den, (z.y * w.x - z.x * w.y) / den);
            } else if (typeof z === "number" && w instanceof Complex) {
                let den = w.normSquared();
                return new Complex(z * w.x / den, -z * w.y / den);
            } else if (z instanceof Complex && typeof w === "number") {
                return new Complex(z.x / w, z.y / w);
            } else if (typeof z === "number" && typeof w === "number") {
                return new Complex(z / w, 0);
            } else {
                return new Complex(0, 0);
            }
        }
    }
}