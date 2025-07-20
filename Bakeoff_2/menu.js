class menu {
  constructor(x,y,w,col){
      this.x=x;
      this.y=y;
      this.width=w;
      this.col=col;
  }
  clicked(mouse_x, mouse_y){
    return (
      mouse_x >= this.x && mouse_x <= this.x + this.width + 20 && 
        mouse_y >= this.y && mouse_y <= this.y + 40
      )
  }
  draw()
  {
    let centerX = this.x + (this.width + 20) / 2;
    let centerY = this.y + 40 / 2;
    textFont("Arial", 20);
    textStyle(BOLD);
    textAlign(RIGHT, BOTTOM);
    // Draw target
    switch(this.col){
      case 0:
        fill(color(255, 62, 62));
        rect(this.x , this.y , this.width + 20, 40);
        fill(color(0,0,0));
        textAlign(CENTER, CENTER);
        text("Ba", centerX, centerY);
        break;
      case 1:
        fill(color(255, 108, 32));
        rect(this.x, this.y, this.width + 20, 40);
        fill(color(0,0,0));
        textAlign(CENTER, CENTER);
        text("Be", centerX, centerY);
        break;
      case 2:
        fill(color(255, 255, 88));
        rect(this.x , this.y , this.width + 20, 40);
        fill(color(0,0,0));
        textAlign(CENTER, CENTER);
        text("Bh", centerX, centerY);
        break;
      case 3:
        fill(color(88, 255, 88));
        rect(this.x , this.y , this.width + 20, 40);
        fill(color(0,0,0));
        textAlign(CENTER, CENTER);
        text("Bi", centerX, centerY);
        break;
      case 4:
        fill(color(10,175,175));
        rect(this.x , this.y , this.width + 20, 40);
        fill(color(0,0,0));
        textAlign(CENTER, CENTER);
        text("Bl", centerX, centerY);
        break;
      case 5:
        fill(color(255, 88, 255));
        rect(this.x , this.y,  this.width + 20, 40);
        fill(color(0,0,0));
        textAlign(CENTER, CENTER);
        text("Bn", centerX, centerY);
        break;
      case 6:
        fill(color(20, 255, 255));
        rect(this.x , this.y , this.width + 20, 40);
        fill(color(0,0,0));
        textAlign(CENTER, CENTER);
        text("Bo", centerX, centerY);
        break;
      case 7:
        fill(color(108, 108, 255));
        rect(this.x , this.y , this.width + 20, 40);
        fill(color(0,0,0));
        textAlign(CENTER, CENTER);
        text("Br", centerX, centerY);
        break;
      case 8:
        fill(color(174, 103, 255));
        rect(this.x , this.y , this.width + 20 , 40);
        fill(color(0,0,0));
        textAlign(CENTER, CENTER);
        text("Bu", centerX, centerY);
        break;
      case 9:
        fill(color(255, 165, 165));
        rect(this.x, this.y, this.width + 20, 40);
        fill(color(0,0,0));
        textAlign(CENTER, CENTER);
        text("By", centerX, centerY);
        break;
    }
    noStroke();
    // Draw label
  }
}