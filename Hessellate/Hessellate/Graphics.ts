/// <reference path="ScreenCoordinateList.ts" />

namespace Hessellate {
    export class Graphics {
        private ctx: CanvasRenderingContext2D;
        width: number;
        height: number;
        x_center: number;
        y_center: number;

        constructor(canvas: HTMLCanvasElement) {
            this.ctx = canvas.getContext("2d");
            this.width = canvas.width;
            this.height = canvas.height;
            this.x_center = this.width / 2;
            this.y_center = this.height / 2;
            this.ctx.lineWidth = 0.5;
        }

        private path(pointList: ScreenCoordinateList) {
            this.ctx.beginPath();

            let pl = pointList;
            this.ctx.moveTo(pl.x, pl.y);

            for (pl = pl.link; pl != null; pl = pl.link) {
                this.ctx.lineTo(pl.x, pl.y);
            }

            this.ctx.closePath();
        }

        public strokePolygon(pointList: ScreenCoordinateList, color: Color) {
            this.path(pointList);
            this.ctx.strokeStyle = color.css;
            this.ctx.stroke();
        }

        public fillPolygon(pointList: ScreenCoordinateList, color: Color) {
            this.path(pointList);
            this.ctx.fillStyle = color.css;
            this.ctx.fill();
        }

        public fillRect(x: number, y: number, w: number, h: number, color: Color) {
            this.ctx.fillStyle = color.css;
            this.ctx.fillRect(x, y, w, h);
        }

        public fillCircle(x: number, y: number, radius: number, color: Color) {
            this.ctx.fillStyle = color.css;
            this.ctx.beginPath();
            this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
            this.ctx.fill();
        }
    }
}
