let np = 300;
let startcol;
let radius = 100;
let overFrame = 0;
function setup() {
  let canvas = createCanvas(600, 400);
  canvas.parent('perlin-container');
  background(252);
  noFill();
  noiseSeed(random(17));
  startcol = 0;
  stroke(0);
  strokeWeight(0.1);
}

function draw() {
  //background(252);
  beginShape();
  let sx, sy;
  for(let i = 0; i < np; i++) {
    let angle = map(i, 0, np, 0, TWO_PI);
    let cx = (frameCount-overFrame)*1.5 -50;
    let cy = height / 2 + 50 * sin((frameCount-overFrame) / 50)*noise(sin((frameCount-overFrame) / 50));
    let xx = radius * cos(angle + cx / 20);
    let yy = radius * sin(angle + cx / 20);
    let v = createVector(xx, yy);
    xx = (xx + cx) / 150; 
    yy = (yy + cy) / 150;
    v.mult(1 + 6 * noise(xx, yy));
    vertex(cx + v.x, cy + v.y);
    if(i == 0) {
      sx = cx + v.x;
      sy = cy + v.y;
    }
  }
  //colorMode(HSB);
  //let hue = cx / 10 - startcol;
  //if(hue < 0) hue += 255;

  //vertex(sx, sy);
  endShape(CLOSE);
  if((frameCount-overFrame) > width + 500) {
    //noLoop();
      overFrame = frameCount;
      background(252)
  }
    
}