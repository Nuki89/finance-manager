// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-particles-background',
//   standalone: true,
//   imports: [],
//   templateUrl: './particles-background.component.html',
//   styleUrl: './particles-background.component.css'
// })
// export class ParticlesBackgroundComponent {

// }

import { Component, AfterViewInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-particles-background',
  standalone: true,
  templateUrl: './particles-background.component.html',
  styleUrls: ['./particles-background.component.scss']
})
export class ParticlesBackgroundComponent implements AfterViewInit {
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private particlesArray: Particle[] = [];

  ngAfterViewInit() {
    this.canvas = document.getElementById('canvas1') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.initParticles();
    this.animate();
  }

  private initParticles() {
    this.particlesArray = [];
    let numberOfParticles = (this.canvas.height * this.canvas.width) / 15000;

    for (let i = 0; i < numberOfParticles; i++) {
      let size = Math.random() * 5 + 1;
      let x = Math.random() * (innerWidth - size * 2 - size * 2) + size * 2;
      let y = Math.random() * (innerHeight - size * 2 - size * 2) + size * 2;
      // let directionX = Math.random() * 3 - 1;
      // let directionY = Math.random() * 3 - 1;
      let directionX = (Math.random() * 0.6) - 0.5;
      let directionY = (Math.random() * 0.6) - 0.5;
      let color = '#000000';

      this.particlesArray.push(new Particle(x, y, directionX, directionY, size, color, this.ctx));
    }
  }

  private animate() {
    requestAnimationFrame(() => this.animate());
    this.ctx.clearRect(0, 0, innerWidth, innerHeight);

    this.particlesArray.forEach(particle => particle.update());
    this.connectParticles();
  }

  private connectParticles() {
    let opacityValue = 1;
    for (let a = 0; a < this.particlesArray.length; a++) {
      for (let b = a; b < this.particlesArray.length; b++) {
        let distance =
          (this.particlesArray[a].x - this.particlesArray[b].x) ** 2 +
          (this.particlesArray[a].y - this.particlesArray[b].y) ** 2;

        if (distance < (this.canvas.width / 12) * (this.canvas.height / 7)) {
          opacityValue = 1 - distance / 15000;
          this.ctx.strokeStyle = `rgba(0,0,0,${opacityValue})`;
          this.ctx.lineWidth = 1;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particlesArray[a].x, this.particlesArray[a].y);
          this.ctx.lineTo(this.particlesArray[b].x, this.particlesArray[b].y);
          this.ctx.stroke();
        }
      }
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.initParticles();
  }
}

class Particle {
  constructor(
    public x: number,
    public y: number,
    public directionX: number,
    public directionY: number,
    public size: number,
    public color: string,
    private ctx: CanvasRenderingContext2D
  ) {}

  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
  }

  update() {
    if (this.x > window.innerWidth || this.x < 0) {
      this.directionX = -this.directionX;
    }
    if (this.y > window.innerHeight || this.y < 0) {
      this.directionY = -this.directionY;
    }

    this.x += this.directionX;
    this.y += this.directionY;
    this.draw();
  }
}
