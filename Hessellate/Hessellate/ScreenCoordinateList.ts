namespace Hessellate {

    /**
     * Adapted to Typescript by Ben Gladman, 2015.
     * From http://aleph0.clarku.edu/~djoyce/poincare/PoincareB.html
     */
    export class ScreenCoordinateList {
        x: number;
        y: number; // coordinate pair
        link: ScreenCoordinateList; // link to next one
 
        constructor(link: ScreenCoordinateList = null, x: number = 0, y: number = 0) {
            this.x = x;
            this.y = y;
            this.link = link;
        }

    }
}