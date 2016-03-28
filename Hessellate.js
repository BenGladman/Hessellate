var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
System.register("ScreenCoordinateList", [], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var ScreenCoordinateList;
    return {
        setters:[],
        execute: function() {
            /**
             * Adapted to Typescript by Ben Gladman, 2015.
             * From http://aleph0.clarku.edu/~djoyce/poincare/PoincareB.html
             */
            ScreenCoordinateList = (function () {
                function ScreenCoordinateList(link, x, y) {
                    if (link === void 0) { link = null; }
                    if (x === void 0) { x = 0; }
                    if (y === void 0) { y = 0; }
                    this.x = x;
                    this.y = y;
                    this.link = link;
                }
                return ScreenCoordinateList;
            }());
            exports_1("default", ScreenCoordinateList);
        }
    }
});
System.register("Color", [], function(exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    var Color;
    return {
        setters:[],
        execute: function() {
            Color = (function () {
                /**
                 * @param h hue integer 0-359
                 * @param s saturation integer 0-100
                 * @param l lightness integer 0-100
                 */
                function Color(h, s, l) {
                    if (h === void 0) { h = 0; }
                    if (s === void 0) { s = 0; }
                    if (l === void 0) { l = 0; }
                    this.h = Math.floor(h);
                    this.s = Math.floor(s);
                    this.l = Math.floor(l);
                }
                Object.defineProperty(Color.prototype, "css", {
                    /**
                     * CSS color string
                     */
                    get: function () {
                        var css = "hsl(" + this.h + "," + this.s + "%," + this.l + "%)";
                        return css;
                    },
                    enumerable: true,
                    configurable: true
                });
                /**
                 * Return similar colour with different lightness.
                 * @param lightnessDelta Change in lightness.
                 */
                Color.prototype.shade = function (lightnessDelta) {
                    var newl = Math.floor(this.l + lightnessDelta);
                    newl = Math.max(0, newl);
                    newl = Math.min(100, newl);
                    return new Color(this.h, this.s, newl);
                };
                Color.randomGray = function () {
                    return new Color(0, // hue irrelevant
                    0, // no satuation
                    Math.random() * 100 // lightness
                    );
                };
                Color.randomColor = function (s, l) {
                    return new Color(Math.random() * 360, // hue
                    s, // saturation
                    l // full lightness
                    );
                };
                Color.prototype.toIx = function () {
                    switch (this) {
                        case Color.Red: return 0;
                        case Color.Orange: return 1;
                        case Color.Yellow: return 2;
                        case Color.Green: return 3;
                        case Color.Blue: return 4;
                        case Color.Purple: return 5;
                        case Color.Black: return 6;
                        case Color.Grey1: return 7;
                        case Color.Grey2: return 8;
                        default: return 9;
                    }
                };
                Color.fromIx = function (ix) {
                    switch (ix) {
                        case 0: return Color.Red;
                        case 1: return Color.Orange;
                        case 2: return Color.Yellow;
                        case 3: return Color.Green;
                        case 4: return Color.Blue;
                        case 5: return Color.Purple;
                        case 6: return Color.Black;
                        case 7: return Color.Grey1;
                        case 8: return Color.Grey2;
                        default: return Color.White;
                    }
                };
                Color.Red = new Color(0, 50, 40);
                Color.Orange = new Color(30, 50, 40);
                Color.Yellow = new Color(60, 50, 60);
                Color.Green = new Color(120, 30, 40);
                Color.Blue = new Color(240, 30, 40);
                Color.Purple = new Color(313, 50, 60);
                Color.Black = new Color(0, 0, 10);
                Color.Grey1 = new Color(0, 0, 30);
                Color.Grey2 = new Color(0, 0, 80);
                Color.White = new Color(0, 0, 100);
                return Color;
            }());
            exports_2("default", Color);
        }
    }
});
System.register("Graphics", [], function(exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    var Graphics;
    return {
        setters:[],
        execute: function() {
            Graphics = (function () {
                function Graphics(canvas) {
                    this.ctx = canvas.getContext("2d");
                    this.width = canvas.width;
                    this.height = canvas.height;
                    this.x_center = this.width / 2;
                    this.y_center = this.height / 2;
                    this.ctx.lineWidth = 0.5;
                }
                Graphics.prototype.path = function (pointList) {
                    this.ctx.beginPath();
                    var pl = pointList;
                    this.ctx.moveTo(pl.x, pl.y);
                    for (pl = pl.link; pl != null; pl = pl.link) {
                        this.ctx.lineTo(pl.x, pl.y);
                    }
                    this.ctx.closePath();
                };
                Graphics.prototype.strokePolygon = function (pointList, color) {
                    this.path(pointList);
                    this.ctx.strokeStyle = color.css;
                    this.ctx.stroke();
                };
                Graphics.prototype.fillPolygon = function (pointList, color) {
                    this.path(pointList);
                    this.ctx.fillStyle = color.css;
                    this.ctx.fill();
                };
                Graphics.prototype.fillRect = function (x, y, w, h, color) {
                    this.ctx.fillStyle = color.css;
                    this.ctx.fillRect(x, y, w, h);
                };
                Graphics.prototype.fillCircle = function (x, y, radius, color) {
                    this.ctx.fillStyle = color.css;
                    this.ctx.beginPath();
                    this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
                    this.ctx.fill();
                };
                return Graphics;
            }());
            exports_3("default", Graphics);
        }
    }
});
System.register("Curve", ["ScreenCoordinateList"], function(exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    var ScreenCoordinateList_1;
    var Curve;
    return {
        setters:[
            function (ScreenCoordinateList_1_1) {
                ScreenCoordinateList_1 = ScreenCoordinateList_1_1;
            }],
        execute: function() {
            /**
             * Adapted to Typescript by Ben Gladman, 2015.
             * From http://aleph0.clarku.edu/~djoyce/poincare/PoincareB.html
             */
            Curve = (function () {
                function Curve() {
                }
                Curve.prototype.setScreen = function (x_center, y_center, radius) {
                    this.x_center = x_center;
                    this.y_center = y_center;
                    this.radius = radius;
                };
                Curve.prototype.xScreen = function (t) {
                    return Math.round(this.x_center + this.radius * this.x(t));
                };
                Curve.prototype.yScreen = function (t) {
                    return Math.round(this.y_center + this.radius * this.y(t));
                };
                // Determine if a curve between t=a and t=b is bent at t=c.  
                // Say it is if C is outside a narrow ellipse.
                // If it is bent there, subdivide the interval.
                Curve.prototype.bent = function (a, b, c, list) {
                    var a1 = this.xScreen(a);
                    var a2 = this.yScreen(a);
                    var b1 = this.xScreen(b);
                    var b2 = this.yScreen(b);
                    var c1 = this.xScreen(c);
                    var c2 = this.yScreen(c);
                    var excess = Math.sqrt((a1 - c1) * (a1 - c1) + (a2 - c2) * (a2 - c2)) +
                        Math.sqrt((b1 - c1) * (b1 - c1) + (b2 - c2) * (b2 - c2)) -
                        Math.sqrt((a1 - b1) * (a1 - b1) + (a2 - b2) * (a2 - b2));
                    if (excess > 0.03) {
                        list = this.interpolate(list, a, c);
                        list = this.interpolate(list, c, b);
                    }
                    return list;
                };
                // Add to the list the coordinates of the curve (f(t),g(t)) for t
                // between a and b. It is assumed that the point (f(a),g(a)) is 
                // already on the list. Enough points will be interpolated between a 
                // and b so that the approximating polygon looks like the curve.  
                // The last point to be included will be (f(b),g(b)).}
                Curve.prototype.interpolate = function (list, a, b) {
                    // try bending at 5 points
                    var bendpoints = [0.5, 0.167, 0.833, 0.333, 0.667];
                    for (var i = 0; i < 5; ++i) {
                        var t = bendpoints[i];
                        var result = this.bent(a, b, t * a + (1.0 - t) * b, list);
                        if (result != list)
                            return result;
                    }
                    // it's a straight line
                    var b1 = this.xScreen(b);
                    var b2 = this.yScreen(b);
                    if ((list.x != b1 || list.y != b2) && !isNaN(b1) && !isNaN(b2)) {
                        list = new ScreenCoordinateList_1.default(list, b1, b2);
                    }
                    return list; // it's a straight line
                };
                return Curve;
            }());
            exports_4("default",Curve);
        }
    }
});
System.register("CircularCurve", ["Curve"], function(exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    var Curve_1;
    var CircularCurve;
    return {
        setters:[
            function (Curve_1_1) {
                Curve_1 = Curve_1_1;
            }],
        execute: function() {
            /**
             * Adapted to Typescript by Ben Gladman, 2015.
             * From http://aleph0.clarku.edu/~djoyce/poincare/PoincareB.html
             */
            CircularCurve = (function (_super) {
                __extends(CircularCurve, _super);
                function CircularCurve(x, y, r) {
                    _super.call(this);
                    this.set(x, y, r);
                }
                CircularCurve.prototype.set = function (x, y, r) {
                    this.x_coord = x;
                    this.y_coord = y;
                    this.r = r;
                };
                CircularCurve.prototype.x = function (t) {
                    return this.x_coord + this.r * Math.cos(t);
                };
                CircularCurve.prototype.y = function (t) {
                    return this.y_coord + this.r * Math.sin(t);
                };
                return CircularCurve;
            }(Curve_1.default));
            exports_5("default", CircularCurve);
        }
    }
});
System.register("Point", [], function(exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
    var Point;
    return {
        setters:[],
        execute: function() {
            /**
             * Adapted to Typescript by Ben Gladman, 2015.
             * From http://aleph0.clarku.edu/~djoyce/poincare/PoincareB.html
             */
            Point = (function () {
                function Point(xVal, yVal) {
                    if (xVal === void 0) { xVal = 0; }
                    if (yVal === void 0) { yVal = 0; }
                    this.x = xVal;
                    this.y = yVal;
                    if (!isFinite(this.x) || isNaN(this.x) || !isFinite(this.y) || isNaN(this.y)) {
                        console.error("Point undefined: " + this);
                    }
                }
                Point.prototype.toString = function () {
                    return "(" + this.x + "," + this.y + ")";
                };
                /**
                 * Create a point from polar coordinates.
                 * @param r Magintude
                 * @param t Argument (angle)
                 */
                Point.fromPolar = function (r, t) {
                    return new Point(r * Math.cos(t), r * Math.sin(t));
                };
                /**
                 * Reflect the point A through this point B to get the returned point C.
                 * The rule for computing A thru B (as Point numbers) is:		|
                 *
                 *            B - t A	         where t = (1+BB')/2, and
                 * A |> B = -----------               B' is the Point
                 *           t -  A B'                conjugate of B
                 */
                Point.prototype.reflect = function (A) {
                    var t = (1 + this.normSquared()) / 2;
                    // compute the numerator as  B - t * A
                    var numerator = this.minus(A.times(t));
                    // compute the denominator as  t - A * B'
                    var denominator = Point.subtract(t, A.times(this.conjugate()));
                    return numerator.over(denominator);
                };
                /**
                 * Moebius transform
                 * http://archive.ncsa.illinois.edu/Classes/MATH198/whubbard/GRUMC/geometryExplorer/help/noneuclid/examples-moebius.html
                 */
                Point.prototype.moebius = function (z0, t) {
                    var numerator = Point.fromPolar(1, t).times(this.minus(z0));
                    var denominator = Point.subtract(1, this.times(z0.conjugate()));
                    return numerator.over(denominator);
                };
                Point.prototype.translate = function (translateX, translateY) {
                    return this.moebius(new Point(-translateX, -translateY), 0);
                };
                Point.prototype.rotate = function (t) {
                    return this.moebius(Point.origin, t);
                };
                // Complex number methods
                /**
                 * Find the inner product when the numbers are treated as vectors
                 */
                Point.prototype.innerProduct = function (w) {
                    return this.x * w.x + this.y * w.y;
                };
                Point.innerProduct = function (z, w) {
                    return z.x * w.x + z.y * w.y;
                };
                Point.prototype.normSquared = function () {
                    return this.x * this.x + this.y * this.y;
                };
                Point.prototype.norm = function () {
                    return Math.sqrt(this.x * this.x + this.y * this.y);
                };
                /**
                 * Argument of point (angle from X axis)
                 */
                Point.prototype.arg = function () {
                    return Math.atan2(this.y, this.x);
                };
                Point.prototype.conjugate = function () {
                    return new Point(this.x, -this.y);
                };
                Point.prototype.negate = function () {
                    return new Point(-this.x, -this.y);
                };
                Point.prototype.minus = function (w) {
                    if (w instanceof Point) {
                        return new Point(this.x - w.x, this.y - w.y);
                    }
                    else if (typeof w === "number") {
                        return new Point(this.x - w, this.y);
                    }
                    else {
                        return Point.origin;
                    }
                };
                Point.subtract = function (t, w) {
                    return new Point(t - w.x, -w.y);
                };
                Point.prototype.plus = function (w) {
                    if (w instanceof Point) {
                        return new Point(this.x + w.x, this.y + w.y);
                    }
                    else if (typeof w === "number") {
                        return new Point(this.x + w, this.y);
                    }
                    else {
                        return Point.origin;
                    }
                };
                Point.add = function (t, w) {
                    return new Point(t + w.x, w.y);
                };
                Point.prototype.times = function (w) {
                    if (w instanceof Point) {
                        return new Point(this.x * w.x - this.y * w.y, this.y * w.x + this.x * w.y);
                    }
                    else if (typeof w === "number") {
                        return new Point(w * this.x, w * this.y);
                    }
                    else {
                        return Point.origin;
                    }
                };
                Point.multiply = function (t, w) {
                    return new Point(t * w.x, t * w.y);
                };
                Point.prototype.reciprocal = function () {
                    var den = this.normSquared();
                    return new Point(this.x / den, -this.y / den);
                };
                Point.prototype.over = function (w) {
                    if (w instanceof Point) {
                        var den = w.normSquared();
                        return new Point((this.x * w.x + this.y * w.y) / den, (this.y * w.x - this.x * w.y) / den);
                    }
                    else if (typeof w === "number") {
                        return new Point(this.x / w, this.y / w);
                    }
                    else {
                        return Point.origin;
                    }
                };
                Point.divide = function (t, w) {
                    var den = w.normSquared();
                    return new Point(t * w.x / den, -t * w.y / den);
                };
                Point.origin = new Point(0, 0);
                return Point;
            }());
            exports_6("default", Point);
        }
    }
});
System.register("Line", ["CircularCurve", "Point", "ScreenCoordinateList"], function(exports_7, context_7) {
    "use strict";
    var __moduleName = context_7 && context_7.id;
    var CircularCurve_1, Point_1, ScreenCoordinateList_2;
    var Line;
    return {
        setters:[
            function (CircularCurve_1_1) {
                CircularCurve_1 = CircularCurve_1_1;
            },
            function (Point_1_1) {
                Point_1 = Point_1_1;
            },
            function (ScreenCoordinateList_2_1) {
                ScreenCoordinateList_2 = ScreenCoordinateList_2_1;
            }],
        execute: function() {
            /**
             * Adapted to Typescript by Ben Gladman, 2015.
             * From http://aleph0.clarku.edu/~djoyce/poincare/PoincareB.html
             */
            Line = (function () {
                function Line(A, B) {
                    this.A = A;
                    this.B = B;
                    // first determine if its a line or a circle
                    var den = A.x * B.y - B.x * A.y;
                    this.isStraight = (Math.abs(den) < 1.0e-14);
                    if (this.isStraight) {
                        this.P = A; // a point on the line}
                        // find a unit vector D in the direction of the line}
                        den = Math.sqrt((A.x - B.x) * (A.x - B.x) + (A.y - B.y) * (A.y - B.y));
                        this.D = new Point_1.default((B.x - A.x) / den, (B.y - A.y) / den);
                    }
                    else {
                        // find the center of the circle thru these points}
                        var s1 = (1.0 + A.x * A.x + A.y * A.y) / 2.0;
                        var s2 = (1.0 + B.x * B.x + B.y * B.y) / 2.0;
                        this.C = new Point_1.default((s1 * B.y - s2 * A.y) / den, (A.x * s2 - B.x * s1) / den);
                        this.r = Math.sqrt(this.C.x * this.C.x + this.C.y * this.C.y - 1.0);
                    }
                }
                Line.prototype.toString = function () {
                    return "[" + this.A + "," + this.B + "]";
                };
                /**
                 * Reflect the point R thru the this line to get the returned point
                 */
                Line.prototype.reflect = function (R) {
                    if (this.isStraight) {
                        var factor = 2.0 * ((R.x - this.P.x) * this.D.x + (R.y - this.P.y) * this.D.y);
                        return this.P.times(2).plus(this.D.times(factor).minus(R));
                    }
                    else {
                        // it's a circle
                        var factor = this.r * this.r / ((R.x - this.C.x) * (R.x - this.C.x) + (R.y - this.C.y) * (R.y - this.C.y));
                        return this.C.plus(R.minus(this.C).times(factor));
                    }
                };
                /**
                 * Calculate intersection point (or points) of this line and another.
                 */
                Line.prototype.intersection = function (L) {
                    if (this.isStraight && L.isStraight) {
                        return [Line.ssIntersection(this, L), null];
                    }
                    else if (this.isStraight) {
                        return Line.scIntersection(this, L);
                    }
                    else if (L.isStraight) {
                        return Line.scIntersection(L, this);
                    }
                    else {
                        // todo
                        throw new Error("Not supported.");
                    }
                };
                /**
                 * Calculate intersection point of two straight lines.
                 * From http://stackoverflow.com/questions/385305/efficient-maths-algorithm-to-calculate-intersections
                 */
                Line.ssIntersection = function (s1, s2) {
                    var x1 = s1.A.x;
                    var y1 = s1.A.y;
                    var x2 = s1.B.x;
                    var y2 = s1.B.y;
                    var x3 = s2.A.x;
                    var y3 = s2.A.y;
                    var x4 = s2.B.x;
                    var y4 = s2.B.y;
                    var x12 = x1 - x2;
                    var x34 = x3 - x4;
                    var y12 = y1 - y2;
                    var y34 = y3 - y4;
                    var c = x12 * y34 - y12 * x34;
                    if (Math.abs(c) < 0.01) {
                        // No intersection
                        return null;
                    }
                    else {
                        // Intersection
                        var a = x1 * y2 - y1 * x2;
                        var b = x3 * y4 - y3 * x4;
                        var x = (a * x34 - b * x12) / c;
                        var y = (a * y34 - b * y12) / c;
                        return new Point_1.default(x, y);
                    }
                };
                /**
                 * Calculate intersection point(s) of a straight line and a circle.
                 * From http://stackoverflow.com/questions/13053061/circle-line-intersection-points
                 */
                Line.scIntersection = function (straight, circle) {
                    var baX = straight.B.x - straight.A.x;
                    var baY = straight.B.y - straight.A.y;
                    var caX = circle.C.x - straight.A.x;
                    var caY = circle.C.y - straight.A.y;
                    var a = baX * baX + baY * baY;
                    var bBy2 = baX * caX + baY * caY;
                    var c = caX * caX + caY * caY - circle.r * circle.r;
                    var pBy2 = bBy2 / a;
                    var q = c / a;
                    var disc = pBy2 * pBy2 - q;
                    if (disc < 0) {
                        return [null, null];
                    }
                    // if disc == 0 ... dealt with later
                    var tmpSqrt = Math.sqrt(disc);
                    var abScalingFactor1 = -pBy2 + tmpSqrt;
                    var abScalingFactor2 = -pBy2 - tmpSqrt;
                    var p1 = new Point_1.default(straight.A.x - baX * abScalingFactor1, straight.A.y - baY * abScalingFactor1);
                    if (disc === 0) {
                        return [p1, null];
                    }
                    var p2 = new Point_1.default(straight.A.x - baX * abScalingFactor2, straight.A.y - baY * abScalingFactor2);
                    if (p1.norm() < p2.norm()) {
                        return [p1, p2];
                    }
                    else {
                        return [p2, p1];
                    }
                };
                /**
                 * Append screen coordinates to the list in order to draw the line.
                 */
                Line.prototype.appendScreenCoordinates = function (list, g) {
                    var x_center = g.x_center;
                    var y_center = g.y_center;
                    var radius = Math.min(x_center, y_center);
                    var x = Math.round(this.A.x * radius + x_center);
                    var y = Math.round(this.A.y * radius + y_center);
                    if ((list == null || x != list.x || y != list.y)
                        && !isNaN(x) && !isNaN(y))
                        list = new ScreenCoordinateList_2.default(list, x, y);
                    if (this.isStraight) {
                        x = Math.round(this.B.x * radius + x_center);
                        y = Math.round(this.B.y * radius + y_center);
                        if (x != list.x || y != list.y)
                            list = new ScreenCoordinateList_2.default(list, x, y);
                    }
                    else {
                        // determine starting and ending angles
                        var alpha = Math.atan2((this.A.y - this.C.y), (this.A.x - this.C.x));
                        var beta = Math.atan2((this.B.y - this.C.y), (this.B.x - this.C.x));
                        if (Math.abs(beta - alpha) > Math.PI)
                            if (beta < alpha)
                                beta += 2.0 * Math.PI;
                            else
                                alpha += 2.0 * Math.PI;
                        var curve = new CircularCurve_1.default(this.C.x, this.C.y, this.r);
                        curve.setScreen(x_center, y_center, radius);
                        list = curve.interpolate(list, alpha, beta);
                    }
                    return list;
                };
                Line.prototype.draw = function (g) {
                    var x_center = g.x_center;
                    var y_center = g.y_center;
                    var radius = Math.min(x_center, y_center);
                    // *** yet to write ***
                };
                return Line;
            }());
            exports_7("default", Line);
        }
    }
});
System.register("Parameters", ["Color", "Point"], function(exports_8, context_8) {
    "use strict";
    var __moduleName = context_8 && context_8.id;
    var Color_1, Point_2;
    var Parameters;
    return {
        setters:[
            function (Color_1_1) {
                Color_1 = Color_1_1;
            },
            function (Point_2_1) {
                Point_2 = Point_2_1;
            }],
        execute: function() {
            /**
             * Adapted to Typescript by Ben Gladman, 2015.
             * From http://aleph0.clarku.edu/~djoyce/poincare/PoincareB.html
             */
            Parameters = (function () {
                function Parameters() {
                    /**
                     * The number of sides on a polygon.
                     */
                    this.n = 5;
                    /**
                     * Vertex valence, the number of polygons that meet at each vertex.
                     */
                    this.k = 4;
                    /**
                     * The number of layers of polygons to display.
                     */
                    this.layers = 3;
                    /**
                     * Smallest tile to render (closer to 1 is smaller).
                     */
                    this.detailLevel = 0.99;
                    this.bgColor = Color_1.default.Black;
                    this.diskColor = Color_1.default.Red;
                    this.outline = true;
                    this.outlineColor = Color_1.default.Red;
                    this.fill = true;
                    this.fillColor = Color_1.default.Red;
                    this.highlightTileColor = Color_1.default.White;
                    /**
                     * Z0 argument in moebius transform.
                     */
                    this.moebiusZ0 = Point_2.default.origin;
                    /**
                     * t argument in moebius transform.
                     */
                    this.moebiusT = 0;
                    /**
                     * Whether to highlight the center tile.
                     */
                    this.highlightCenter = false;
                    /**
                     * Show or hide pattern.
                     */
                    this.pattern = true;
                    this.patternDefn = [
                        [[0.6, 0.5], [1, 0.1], [1, 0.9]]
                    ];
                    this.patternColors = [
                        Color_1.default.Red
                    ];
                    /**
                     * How the pattern repeats:
                     * 1 = Repeat for each side, 2 = Repeat every other side.
                     */
                    this.patternRepeat = 1;
                }
                Parameters.prototype.checkPars = function () {
                    // n should be between 3 and 20
                    this.n = Math.max(this.n, 3);
                    this.n = Math.min(this.n, 20);
                    // k should be large enough, but no larger than 20
                    if (this.n == 3) {
                        this.k = Math.max(this.k, 7);
                    }
                    else if (this.n == 4) {
                        this.k = Math.max(this.k, 5);
                    }
                    else if (this.n < 7) {
                        this.k = Math.max(this.k, 4);
                    }
                    else {
                        this.k = Math.max(this.k, 3);
                    }
                    this.k = Math.min(this.k, 20);
                    // layers shouldn't be too big
                    if (this.n == 3 || this.k == 3) {
                        this.layers = Math.min(this.layers, 5);
                    }
                    else {
                        this.layers = Math.min(this.layers, 4);
                    }
                };
                Parameters.prototype.toString = function () {
                    return ("[n=" + this.n + ",k=" + this.k + ",layers=" + this.layers)
                        + (",quasiregular=" + this.quasiregular + "]");
                };
                return Parameters;
            }());
            exports_8("default", Parameters);
        }
    }
});
System.register("Polygon", ["Line"], function(exports_9, context_9) {
    "use strict";
    var __moduleName = context_9 && context_9.id;
    var Line_1;
    var Polygon;
    return {
        setters:[
            function (Line_1_1) {
                Line_1 = Line_1_1;
            }],
        execute: function() {
            /**
             * Adapted to Typescript by Ben Gladman, 2015.
             * From http://aleph0.clarku.edu/~djoyce/poincare/PoincareB.html
             */
            Polygon = (function () {
                function Polygon(vertices) {
                    this.n = vertices.length;
                    this.vertices = vertices;
                    this.edges = vertices.map(function (v, i, arr) { return new Line_1.default(v, arr[(i + 1) % arr.length]); });
                }
                Polygon.prototype.getVertex = function (i) { return this.vertices[i % this.n]; };
                Polygon.prototype.getEdge = function (i) { return this.edges[i % this.n]; };
                Polygon.prototype.toString = function () {
                    var S = "[";
                    for (var i = 0; i < this.n; ++i) {
                        S += this.vertices[i];
                        if (i < this.n - 1) {
                            S += ",";
                        }
                    }
                    S += "]";
                    return S;
                };
                /**
                 * Reflect Polygon through a point or line.
                 * @param V The point or line to reflect through.
                 * @param firstVertex Index of the vertex in the returned polygon which is the reflected vertex 0 in this.
                 * @param reverseDirection If true then the order of the vertices in the returned polygon will be the reverse order of this.
                 */
                Polygon.prototype.reflect = function (V, firstVertex, reverseDirection) {
                    var _this = this;
                    if (reverseDirection === void 0) { reverseDirection = false; }
                    var vertices = [];
                    var j = firstVertex % this.n;
                    this.vertices.forEach(function (vertex) {
                        vertices[j] = V.reflect(vertex);
                        if (reverseDirection) {
                            j -= 1;
                            if (j === -1) {
                                j = _this.n - 1;
                            }
                        }
                        else {
                            j += 1;
                            if (j === _this.n) {
                                j = 0;
                            }
                        }
                    });
                    return new Polygon(vertices);
                };
                /**
                 * Moebius transform
                 */
                Polygon.prototype.moebius = function (z0, t) {
                    var vertices = [];
                    this.vertices.forEach(function (vertex) {
                        var vt = vertex.moebius(z0, t);
                        vertices.push(vt);
                    });
                    return new Polygon(vertices);
                };
                Polygon.prototype.setScreenCoordinateArrays = function (g) {
                    var pointList = null;
                    this.edges.forEach(function (edge) {
                        pointList = edge.appendScreenCoordinates(pointList, g);
                    });
                    return pointList;
                };
                Polygon.prototype.fill = function (g, color) {
                    var pointList = this.setScreenCoordinateArrays(g);
                    g.fillPolygon(pointList, color);
                };
                Polygon.prototype.stroke = function (g, color) {
                    var pointList = this.setScreenCoordinateArrays(g);
                    g.strokePolygon(pointList, color);
                };
                return Polygon;
            }());
            exports_9("default", Polygon);
        }
    }
});
System.register("Tile", [], function(exports_10, context_10) {
    "use strict";
    var __moduleName = context_10 && context_10.id;
    var Tile;
    return {
        setters:[],
        execute: function() {
            Tile = (function () {
                function Tile(center, mainPolygon, innerPolygons) {
                    this.center = center;
                    this.mainPolygon = mainPolygon;
                    this.innerPolygons = innerPolygons;
                    this.shadeLightness = 10 + 30 * (1 - center.norm());
                }
                Tile.prototype.getVertex = function (i) { return this.mainPolygon.getVertex(i); };
                Tile.prototype.reflect = function (V, firstVertex, reverseDirection) {
                    if (reverseDirection === void 0) { reverseDirection = false; }
                    var rcenter = V.reflect(this.center);
                    var rmain = this.mainPolygon.reflect(V, firstVertex, reverseDirection);
                    var rinner = this.innerPolygons.map(function (polygon) { return polygon.reflect(V, 1); });
                    return new Tile(rcenter, rmain, rinner);
                };
                /**
                 * Rotate around the tile center.
                 */
                Tile.prototype.rotateInnerPolygons = function (t) {
                    var _this = this;
                    if (t === 0) {
                        return this;
                    }
                    var rinner = this.innerPolygons.map(function (polygon) { return polygon.moebius(_this.center, t).moebius(_this.center.negate(), 0); });
                    return new Tile(this.center, this.mainPolygon, rinner);
                };
                /**
                 * Moebius transform.
                 * @param z0
                 * @param t
                 * @param detailLevel If > 0, then null will be returned if the center of the tile is further away.
                 */
                Tile.prototype.moebius = function (z0, t, detailLevel) {
                    if (detailLevel === void 0) { detailLevel = 0; }
                    var mcenter = this.center.moebius(z0, t);
                    if ((detailLevel > 0) && (mcenter.norm() > detailLevel)) {
                        return null;
                    }
                    var mmain = this.mainPolygon.moebius(z0, t);
                    var minner = this.innerPolygons.map(function (polygon) { return polygon.moebius(z0, t); });
                    return new Tile(mcenter, mmain, minner);
                };
                Tile.prototype.fill = function (g, color) {
                    this.mainPolygon.fill(g, color.shade(this.shadeLightness));
                };
                Tile.prototype.fillInner = function (g, colors) {
                    if (this.innerPolygons && this.innerPolygons.length) {
                        this.innerPolygons.forEach(function (polygon, i) {
                            if (polygon) {
                                var color = colors[i % colors.length];
                                polygon.fill(g, color);
                            }
                        });
                    }
                };
                Tile.prototype.stroke = function (g, color) {
                    if (this.mainPolygon) {
                        this.mainPolygon.stroke(g, color);
                    }
                };
                return Tile;
            }());
            exports_10("default", Tile);
        }
    }
});
System.register("Disk", ["Line", "Point", "Polygon", "Tile"], function(exports_11, context_11) {
    "use strict";
    var __moduleName = context_11 && context_11.id;
    var Line_2, Point_3, Polygon_1, Tile_1;
    var Disk;
    return {
        setters:[
            function (Line_2_1) {
                Line_2 = Line_2_1;
            },
            function (Point_3_1) {
                Point_3 = Point_3_1;
            },
            function (Polygon_1_1) {
                Polygon_1 = Polygon_1_1;
            },
            function (Tile_1_1) {
                Tile_1 = Tile_1_1;
            }],
        execute: function() {
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
            Disk = (function () {
                function Disk(par, g) {
                    this.par = par;
                    this.g = g;
                }
                Disk.prototype.init = function () {
                    this.par.checkPars();
                    this.countTiles(this.par.layers);
                    this.determineTiles();
                };
                Disk.prototype.countTiles = function (layer) {
                    // Determine
                    //   totalTiles:  the number of tiles there are through that many layers
                    //   innerTiles:  the number through one less layer
                    this.totalTiles = 1; // count the central tile
                    this.innerTiles = 0;
                    var a = this.par.n * (this.par.k - 3); // tiles in first layer joined by a vertex
                    var b = this.par.n; // tiles in first layer joined by an edge
                    var next_a;
                    var next_b;
                    if (this.par.k == 3) {
                        for (var l = 1; l <= layer; ++l) {
                            this.innerTiles = this.totalTiles;
                            next_a = a + b;
                            next_b = (this.par.n - 6) * a + (this.par.n - 5) * b;
                            this.totalTiles += a + b;
                            a = next_a;
                            b = next_b;
                        }
                    }
                    else {
                        for (var l = 1; l <= layer; ++l) {
                            this.innerTiles = this.totalTiles;
                            next_a = ((this.par.n - 2) * (this.par.k - 3) - 1) * a
                                + ((this.par.n - 3) * (this.par.k - 3) - 1) * b;
                            next_b = (this.par.n - 2) * a + (this.par.n - 3) * b;
                            this.totalTiles += a + b;
                            a = next_a;
                            b = next_b;
                        }
                    }
                };
                /* Rule codes
                 *   0:  initial polygon.  Needs neighbors on all n sides
                 *   1:  polygon already has 2 neighbors, but one less around corner needed
                 *   2:  polygon already has 2 neighbors
                 *   3:  polygon already has 3 neighbors
                 *   4:  polygon already has 4 neighbors
                 */
                Disk.prototype.determineTiles = function () {
                    this.P = [];
                    this.rule = [];
                    this.P[0] = this.constructCenterTile();
                    this.rule[0] = 0;
                    var j = 1; // index of the next tile to create
                    for (var i = 0; i < this.innerTiles; ++i) {
                        j = this.applyRule(i, j);
                    }
                };
                Disk.prototype.applyRule = function (i, j) {
                    var r = this.rule[i];
                    var special = (r == 1);
                    if (special) {
                        r = 2;
                    }
                    var start = (r == 4) ? 3 : 2;
                    var quantity = (this.par.k == 3 && r != 0) ? this.par.n - r - 1 : this.par.n - r;
                    for (var s = start; s < start + quantity; ++s) {
                        // Create a tile adjacent to P[i]
                        this.P[j] = this.createNextTile(this.P[i], s % this.par.n);
                        this.rule[j] = (this.par.k == 3 && s == start && r != 0) ? 4 : 3;
                        j++;
                        var m = 0;
                        if (special) {
                            m = 2;
                        }
                        else if (s == 2 && r != 0) {
                            m = 1;
                        }
                        for (; m < this.par.k - 3; ++m) {
                            // Create a tile adjacent to P[j-1]
                            this.P[j] = this.createNextTile(this.P[j - 1], 1);
                            this.rule[j] = (this.par.n == 3 && m == this.par.k - 4) ? 1 : 2;
                            j++;
                        }
                    }
                    return j;
                };
                Disk.prototype.constructCenterTile = function () {
                    // Initialize P as the center polygon in an n-k regular or quasiregular tiling.
                    // Let ABC be a triangle in a regular (n,k0-tiling, where
                    //    A is the center of an n-gon (also center of the disk),
                    //    B is a vertex of the n-gon, and
                    //    C is the midpoint of a side of the n-gon adjacent to B.
                    var angleA = Math.PI / this.par.n;
                    var angleB = Math.PI / this.par.k;
                    var angleC = Math.PI / 2.0;
                    // For a regular tiling, we need to compute the distance s from A to B.
                    var sinA = Math.sin(angleA);
                    var sinB = Math.sin(angleB);
                    var s = Math.sin(angleC - angleB - angleA)
                        / Math.sqrt(1.0 - sinB * sinB - sinA * sinA);
                    // But for a quasiregular tiling, we need the distance s from A to C.
                    if (this.par.quasiregular) {
                        s = (s * s + 1.0) / (2.0 * s * Math.cos(angleA));
                        s = s - Math.sqrt(s * s - 1.0);
                    }
                    // Now determine the coordinates of the n vertices of the n-gon.
                    // They're all at distance s from the center of the Poincare disk.
                    var vertices = [];
                    for (var i = 0; i < this.par.n; ++i) {
                        vertices.push(Point_3.default.fromPolar(s, (2 * i * angleA)));
                    }
                    var mainPolygon = new Polygon_1.default(vertices);
                    var innerPolygons = [];
                    for (s = 1; s < this.par.n + 1; s += this.par.patternRepeat) {
                        var v0arg = mainPolygon.getVertex(s).arg();
                        var v1arg = mainPolygon.getVertex(s + 1).arg();
                        if (v1arg < v0arg) {
                            v1arg += 2 * Math.PI;
                        }
                        var arc = v1arg - v0arg;
                        this.par.patternDefn.forEach(function (ppoly) {
                            innerPolygons.push(new Polygon_1.default(ppoly.map(function (pvert, i) {
                                var rayangle = v0arg + arc * pvert[1];
                                var ray = new Line_2.default(Point_3.default.origin, Point_3.default.fromPolar(1, rayangle));
                                var side = pvert[1] < 0 ? mainPolygon.getEdge(s - 1)
                                    : pvert[1] <= 1 ? mainPolygon.getEdge(s)
                                        : mainPolygon.getEdge(s + 1);
                                var raysideintersection = side.intersection(ray);
                                if (raysideintersection[0]) {
                                    var disttoside = raysideintersection[0].norm();
                                    return Point_3.default.fromPolar(pvert[0] * disttoside, rayangle);
                                }
                                else {
                                    return Point_3.default.origin;
                                }
                            })));
                        });
                    }
                    return new Tile_1.default(Point_3.default.origin, mainPolygon, innerPolygons);
                };
                /**
                 * Reflect P thru the point or the side indicated by the side s.
                 */
                Disk.prototype.createNextTile = function (tile, s) {
                    var rotateAngle = Math.PI * 2 * (this.par.patternRepeat - 1) / this.par.n;
                    if (this.par.quasiregular) {
                        var V = tile.getVertex(s);
                        return tile.rotateInnerPolygons(rotateAngle).reflect(V, this.par.n - s);
                    }
                    else {
                        // regular
                        var C = new Line_2.default(tile.getVertex(s), tile.getVertex((s + 1) % this.par.n));
                        return tile.rotateInnerPolygons(rotateAngle).reflect(C, this.par.n + s + 1, true);
                    }
                };
                Disk.prototype.update = function () {
                    var _this = this;
                    var x_center = this.g.x_center;
                    var y_center = this.g.y_center;
                    var radius = Math.min(x_center, y_center);
                    this.g.fillRect(0, 0, this.g.width, this.g.height, this.par.bgColor);
                    this.g.fillCircle(x_center, y_center, radius, this.par.diskColor);
                    var tile2s = this.P.map(function (tile) { return tile.moebius(_this.par.moebiusZ0, _this.par.moebiusT, _this.par.detailLevel); });
                    if (this.par.fill) {
                        tile2s.forEach(function (tile2, i) {
                            if (tile2) {
                                var c = (i === 0 && _this.par.highlightCenter)
                                    ? _this.par.highlightTileColor
                                    : _this.par.fillColor;
                                tile2.fill(_this.g, c);
                            }
                        });
                    }
                    if (this.par.outline) {
                        tile2s.forEach(function (tile2) {
                            if (tile2) {
                                tile2.stroke(_this.g, _this.par.outlineColor);
                            }
                        });
                    }
                    if (this.par.pattern && this.par.patternDefn) {
                        tile2s.forEach(function (tile2, i) {
                            if (tile2) {
                                tile2.fillInner(_this.g, _this.par.patternColors);
                            }
                        });
                    }
                };
                return Disk;
            }());
            exports_11("default", Disk);
        }
    }
});
System.register("UiCanvas", ["Point"], function(exports_12, context_12) {
    "use strict";
    var __moduleName = context_12 && context_12.id;
    var Point_4;
    var UiCanvas;
    return {
        setters:[
            function (Point_4_1) {
                Point_4 = Point_4_1;
            }],
        execute: function() {
            UiCanvas = (function () {
                function UiCanvas(c, par, disk) {
                    var _this = this;
                    this.rotate = false;
                    this.startPosition = Point_4.default.origin;
                    this.startAngle = 0;
                    this.eventPosition = function (ev) {
                        var ox = 0;
                        var oy = 0;
                        if (ev instanceof MouseEvent) {
                            ox = ev.offsetX;
                            oy = ev.offsetY;
                        }
                        else if (ev instanceof TouchEvent) {
                            ox = ev.touches[0].pageX - _this.canvas.offsetLeft;
                            oy = ev.touches[0].pageY - _this.canvas.offsetTop;
                        }
                        var tx = (2 * ox / _this.canvas.width) - 1;
                        var ty = (2 * oy / _this.canvas.height) - 1;
                        return new Point_4.default(tx, ty);
                    };
                    this.pointerStart = function (ev) {
                        var ep = _this.eventPosition(ev);
                        if (ep.norm() > 1) {
                            _this.rotate = true;
                            _this.startAngle = ep.arg() - _this.par.moebiusT;
                        }
                        else {
                            _this.rotate = false;
                            _this.startAngle = Math.PI - _this.par.moebiusT;
                            _this.startPosition = ep.rotate(_this.startAngle).minus(_this.par.moebiusZ0);
                        }
                    };
                    this.mouseMove = function (ev) {
                        if (ev.which !== 1) {
                            _this.mouseUp(ev);
                            return;
                        }
                        _this.pointerMove(ev);
                    };
                    this.touchMove = function (ev) {
                        _this.pointerMove(ev);
                    };
                    this.pointerMove = function (ev) {
                        if (_this.rotate) {
                            _this.par.moebiusT = _this.eventPosition(ev).arg() - _this.startAngle;
                        }
                        else {
                            var newZ0 = _this.eventPosition(ev).rotate(_this.startAngle).minus(_this.startPosition);
                            var r = newZ0.norm();
                            if (r > _this.par.detailLevel) {
                                newZ0 = Point_4.default.fromPolar(_this.par.detailLevel, newZ0.arg());
                            }
                            _this.par.moebiusZ0 = newZ0;
                        }
                        _this.par.highlightCenter = true;
                        _this.disk.update();
                    };
                    this.mouseUp = function (ev) {
                        _this.canvas.removeEventListener("mousemove", _this.mouseMove);
                        _this.canvas.removeEventListener("mouseup", _this.mouseUp);
                        _this.pointerEnd(ev);
                    };
                    this.touchEnd = function (ev) {
                        _this.canvas.removeEventListener("touchmove", _this.touchMove);
                        _this.canvas.removeEventListener("touchend", _this.touchEnd);
                        _this.pointerEnd(ev);
                    };
                    this.pointerEnd = function (ev) {
                        _this.par.highlightCenter = false;
                        _this.disk.update();
                    };
                    this.canvas = c;
                    this.par = par;
                    this.disk = disk;
                    c.addEventListener("mousedown", function (ev) {
                        _this.pointerStart(ev);
                        _this.canvas.addEventListener("mousemove", _this.mouseMove);
                        _this.canvas.addEventListener("mouseup", _this.mouseUp);
                    });
                    c.addEventListener("touchstart", function (ev) {
                        _this.pointerStart(ev);
                        _this.canvas.addEventListener("touchmove", _this.touchMove);
                        _this.canvas.addEventListener("touchend", _this.touchEnd);
                    });
                }
                return UiCanvas;
            }());
            exports_12("default", UiCanvas);
        }
    }
});
System.register("UiControls", ["Color"], function(exports_13, context_13) {
    "use strict";
    var __moduleName = context_13 && context_13.id;
    var Color_2;
    var UiControls;
    return {
        setters:[
            function (Color_2_1) {
                Color_2 = Color_2_1;
            }],
        execute: function() {
            UiControls = (function () {
                function UiControls() {
                }
                UiControls.init = function (controls, par, disk) {
                    controls.addEventListener("change", function (ev) {
                        var el = ev.target;
                        switch (el.name) {
                            case "control-n":
                            case "control-k":
                            case "control-quasiregular":
                                par.n = UiControls.getRadioValue(controls, "control-n");
                                par.k = UiControls.getRadioValue(controls, "control-k");
                                par.quasiregular = UiControls.getCheckboxValue(controls, "control-quasiregular");
                                disk.init();
                                UiControls.updateControls(controls, par);
                                break;
                            case "control-fill":
                                par.fill = UiControls.getCheckboxValue(controls, "control-fill");
                                break;
                            case "control-outline":
                                par.outline = UiControls.getCheckboxValue(controls, "control-outline");
                                break;
                            case "control-pattern":
                                par.pattern = UiControls.getCheckboxValue(controls, "control-pattern");
                                break;
                            case "control-diskcolor":
                                par.diskColor = Color_2.default.fromIx(UiControls.getRadioValue(controls, "control-diskcolor"));
                                break;
                            case "control-fillcolor":
                                par.fillColor = Color_2.default.fromIx(UiControls.getRadioValue(controls, "control-fillcolor"));
                                break;
                            case "control-outlinecolor":
                                par.outlineColor = Color_2.default.fromIx(UiControls.getRadioValue(controls, "control-outlinecolor"));
                                break;
                            case "control-patterncolor":
                                par.patternColors[0] = Color_2.default.fromIx(UiControls.getRadioValue(controls, "control-patterncolor"));
                                break;
                        }
                        disk.update();
                    });
                    UiControls.updateControls(controls, par);
                };
                UiControls.getRadioValue = function (controls, radioName) {
                    var qs = "input[name=\"" + radioName + "\"]:checked";
                    var el = controls.querySelector(qs);
                    if (!el) {
                        return 0;
                    }
                    var n = parseInt(el.value, 10);
                    return n;
                };
                UiControls.setRadioValue = function (controls, radioName, val) {
                    var qs = "input[name=\"" + radioName + "\"][value=\"" + val + "\"]";
                    var el = controls.querySelector(qs);
                    if (el) {
                        el.checked = true;
                    }
                };
                UiControls.getCheckboxValue = function (controls, checkboxName) {
                    var qs = "input[name=\"" + checkboxName + "\"]";
                    var el = controls.querySelector(qs);
                    return el ? el.checked : false;
                };
                UiControls.setCheckboxValue = function (controls, checkboxName, val) {
                    var qs = "input[name=\"" + checkboxName + "\"]";
                    var el = controls.querySelector(qs);
                    if (el) {
                        el.checked = val;
                    }
                };
                UiControls.updateControls = function (controls, par) {
                    UiControls.setRadioValue(controls, "control-n", par.n);
                    UiControls.setRadioValue(controls, "control-k", par.k);
                    UiControls.setCheckboxValue(controls, "control-quasiregular", par.quasiregular);
                    UiControls.setRadioValue(controls, "control-diskcolor", par.diskColor.toIx());
                    UiControls.setCheckboxValue(controls, "control-fill", par.fill);
                    UiControls.setRadioValue(controls, "control-fillcolor", par.fillColor.toIx());
                    UiControls.setCheckboxValue(controls, "control-outline", par.outline);
                    UiControls.setRadioValue(controls, "control-outlinecolor", par.outlineColor.toIx());
                    UiControls.setCheckboxValue(controls, "control-pattern", par.pattern);
                    UiControls.setRadioValue(controls, "control-patterncolor", par.patternColors[0].toIx());
                };
                return UiControls;
            }());
            exports_13("default", UiControls);
        }
    }
});
System.register("App", ["Disk", "Graphics", "Parameters", "UiCanvas", "UiControls"], function(exports_14, context_14) {
    "use strict";
    var __moduleName = context_14 && context_14.id;
    var Disk_1, Graphics_1, Parameters_1, UiCanvas_1, UiControls_1;
    var App;
    return {
        setters:[
            function (Disk_1_1) {
                Disk_1 = Disk_1_1;
            },
            function (Graphics_1_1) {
                Graphics_1 = Graphics_1_1;
            },
            function (Parameters_1_1) {
                Parameters_1 = Parameters_1_1;
            },
            function (UiCanvas_1_1) {
                UiCanvas_1 = UiCanvas_1_1;
            },
            function (UiControls_1_1) {
                UiControls_1 = UiControls_1_1;
            }],
        execute: function() {
            App = (function () {
                function App() {
                }
                App.init = function () {
                    var canvas = document.getElementById("canvas");
                    var controls = document.getElementById("controls");
                    var g = new Graphics_1.default(canvas);
                    var par = new Parameters_1.default();
                    var d = new Disk_1.default(par, g);
                    new UiCanvas_1.default(canvas, par, d);
                    UiControls_1.default.init(controls, par, d);
                    d.init();
                    d.update();
                };
                return App;
            }());
            exports_14("default", App);
        }
    }
});
//# sourceMappingURL=Hessellate.js.map