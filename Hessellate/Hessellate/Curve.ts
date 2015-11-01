/// <reference path="ScreenCoordinateList.ts" />

namespace Hessellate {
    /**
     * Adapted to Typescript by Ben Gladman, 2015.
     * From http://aleph0.clarku.edu/~djoyce/poincare/PoincareB.html
     */
    export abstract class Curve {

        abstract x(t: number): number;
        abstract y(t: number): number;

        // screen coordinates
        public x_center: number; // x-coordinate of the origin
        public y_center: number; // y-coordinate of the origin
        public radius: number;   // distance to unit circle
  
        public setScreen(x_center: number, y_center: number, radius: number): void {
            this.x_center = x_center;
            this.y_center = y_center;
            this.radius = radius;
        }

        private xScreen(t: number): number {
            return Math.round(this.x_center + this.radius * this.x(t));
        }

        private yScreen(t: number): number {
            return Math.round(this.y_center + this.radius * this.y(t));
        }

        // Determine if a curve between t=a and t=b is bent at t=c.  
        // Say it is if C is outside a narrow ellipse.
        // If it is bent there, subdivide the interval.
        private bent(a: number, b: number, c: number, list: ScreenCoordinateList): ScreenCoordinateList {
            let a1 = this.xScreen(a);
            let a2 = this.yScreen(a);
            let b1 = this.xScreen(b);
            let b2 = this.yScreen(b);
            let c1 = this.xScreen(c);
            let c2 = this.yScreen(c);
            let excess =
                Math.sqrt((a1 - c1) * (a1 - c1) + (a2 - c2) * (a2 - c2)) +
                Math.sqrt((b1 - c1) * (b1 - c1) + (b2 - c2) * (b2 - c2)) -
                Math.sqrt((a1 - b1) * (a1 - b1) + (a2 - b2) * (a2 - b2));
            if (excess > 0.03) {
                list = this.interpolate(list, a, c);
                list = this.interpolate(list, c, b);
            }
            return list;
        }
  
        // Add to the list the coordinates of the curve (f(t),g(t)) for t
        // between a and b. It is assumed that the point (f(a),g(a)) is 
        // already on the list. Enough points will be interpolated between a 
        // and b so that the approximating polygon looks like the curve.  
        // The last point to be included will be (f(b),g(b)).}
        public interpolate(list: ScreenCoordinateList, a: number, b: number): ScreenCoordinateList {
            // first try bending it at the midpoint
            let result = this.bent(a, b, (a + b) / 2.0, list);
            if (result != list) return result;    
            // now try 4 random points
            for (let i = 0; i < 4; ++i) {
                let t = Math.random();
                result = this.bent(a, b, t * a + (1.0 - t) * b, list);
                if (result != list) return result;
            }
            // it's a straight line
            let b1 = this.xScreen(b);
            let b2 = this.yScreen(b);
            if ((list.x != b1 || list.y != b2) && !isNaN(b1) && !isNaN(b2)) {
                list = new ScreenCoordinateList(list, b1, b2);
            }
            return list; // it's a straight line
        }
    }
}