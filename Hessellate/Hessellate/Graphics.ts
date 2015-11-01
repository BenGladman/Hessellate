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
        }

        public setColor(color: Color) {
            this.ctx.strokeStyle = "#888";
            this.ctx.lineWidth = 0.3;
        }

        public drawPolygon(ix: number[], iy: number[], icount: number) {
            this.ctx.beginPath();
            this.ctx.moveTo(ix[0], iy[0]);
            for (let n = 1; n < icount; n++) {
                this.ctx.lineTo(ix[n], iy[n]);
            }
            this.ctx.closePath();
            this.ctx.stroke();
        }

        public fillPolygon(ix: number[], iy: number[], icount: number) {
        }

        public fillRect(x: number, y: number, w: number, h: number) {
            this.ctx.fillStyle = "#fff";
            this.ctx.fillRect(x, y, w, h);
        }

        public fillCircle(x: number, y: number, radius: number) {
            this.ctx.fillStyle = "#eee";
            this.ctx.beginPath();
            this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
            this.ctx.fill();
        }
    }
}
