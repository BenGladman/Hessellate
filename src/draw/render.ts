import Color from "./Color";
import Point from "./Point";
import Tile from "./Tile";
import Graphics from "./Graphics";

export interface RenderParameters {
    bgColor?: Color;
    diskColor?: Color;
    outline?: boolean;
    outlineColor?: Color;
    fill?: boolean;
    fillColor?: Color;
    highlightCenter?: boolean;
    highlightTileColor?: Color;
    pattern?: boolean;
    patternColors?: Color[];

    /**
     * Z0 argument in moebius transform.
     */
    moebiusZ0?: Point;

    /**
     * t argument in moebius transform.
     */
    moebiusT?: number;

    /**
     * Smallest tile to render (closer to 1 is smaller).
     */
    detailLevel?: number;
}

export function defaultRenderParameters(): RenderParameters {
    return {
        detailLevel: 0.99,
        bgColor: Color.Black,
        diskColor: Color.Red,
        outline: true,
        outlineColor: Color.Red,
        fill: true,
        fillColor: Color.Red,
        highlightCenter: false,
        highlightTileColor: Color.White,
        pattern: true,
        patternColors: [Color.Red],
        moebiusZ0: Point.origin,
        moebiusT: 0,
    };
}

export function render(tiles: Tile[], g: Graphics, par: RenderParameters): void {
    let x_center = g.x_center;
    let y_center = g.y_center;
    let radius = Math.min(x_center, y_center);
    g.fillRect(0, 0, g.width, g.height, par.bgColor);
    g.fillCircle(x_center, y_center, radius, par.diskColor.shade(-5));

    const tile2s = tiles.map((tile) => tile.moebius(par.moebiusZ0, par.moebiusT, par.detailLevel));

    if (par.fill) {
        tile2s.forEach((tile2, i) => {
            if (tile2) {
                const c = (i === 0 && par.highlightCenter)
                    ? par.highlightTileColor
                    : par.fillColor;
                tile2.fill(g, c);
            }
        });
    }

    if (par.outline) {
        tile2s.forEach((tile2) => {
            if (tile2) {
                tile2.stroke(g, par.outlineColor);
            }
        });
    }

    if (par.patternColors) {
        tile2s.forEach((tile2, i) => {
            if (tile2) {
                tile2.fillInner(g, par.patternColors);
            }
        });
    }
}
