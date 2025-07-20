// Target class (position and width)
class Target
{
  constructor(x, y, w, l, id)
  {
    this.x      = x;
    this.y      = y;
    this.width  = w;
    this.label  = l;
    this.id     = id;
    this.marked = false;
    this.letter = 0;
  }
  
  // Checks if a mouse click took place
  // within the target
  clicked(mouse_x, mouse_y){
    return (
        mouse_x >= this.x && mouse_x <= this.x + this.width + 40 && 
        mouse_y >= this.y && mouse_y <= this.y + 80
    );
  }
  
  // Draws the target (i.e., a circle)
  // and its label
  draw()
  {
    // Draw target
    switch(this.label[1]){
      case 'a':
        fill(color(255, 62, 62/*20, 255, 255*/));
        if (this.marked == true){
          stroke(255); // Cor do contorno (branco)
          strokeWeight(9);
        }
        this.letter = 1;
        break;
      case 'e':
        fill(color(255, 108, 32/*88, 255, 88*/));
        if (this.marked == true){
          stroke(255); // Cor do contorno (branco)
          strokeWeight(9);
        }
        this.letter = 2;
        break;
      case 'é':
        fill(color(255, 108, 32/*88, 255, 88*/));
        if (this.marked == true){
          stroke(255); // Cor do contorno (branco)
          strokeWeight(9);
        }
        this.letter = 2;
        break;
      case 'h':
        fill(color(255, 255, 88/*108, 108, 255*/));
        if (this.marked == true){
          stroke(255); // Cor do contorno (branco)
          strokeWeight(9);
        }
        this.letter = 3;
        break;
      case 'i':
        fill(color(88, 255, 88/*255, 255, 88*/));
        if (this.marked == true){
          stroke(255); // Cor do contorno (branco)
          strokeWeight(9);
        }
        this.letter = 4;
        break;
      case 'l':
        fill(color(10,175,175));
        if (this.marked == true){
          stroke(255); // Cor do contorno (branco)
          strokeWeight(9);
        }
        this.letter = 5;
        break;
      case 'n':
        fill(color(255, 88, 255));
        if (this.marked == true){
          stroke(255); // Cor do contorno (branco)
          strokeWeight(9);
        }
        this.letter = 6;
        break;
      case 'o':
        fill(color(20, 255, 255/*255, 128, 62*/));
        if (this.marked == true){
          stroke(255); // Cor do contorno (branco)
          strokeWeight(9);
        }
        this.letter = 7;
        break;
      case 'r':
        fill(color(108, 108, 255/*255, 62, 62*/));
        if (this.marked == true){
          stroke(255); // Cor do contorno (branco)
          strokeWeight(9);
        }
        this.letter = 8;
        break;
      case 'u':
        fill(color(174, 103, 255));
        if (this.marked == true){
          stroke(255); // Cor do contorno (branco)
          strokeWeight(9);
        }
        this.letter = 9;
        break;
      case 'y':
        fill(color(255, 165, 165));
        if (this.marked == true){
          stroke(255); // Cor do contorno (branco)
          strokeWeight(9);
        }
        this.letter = 10;
        break;
    }
     

    rect(this.x, this.y, this.width + 40, 80, 10);
    noStroke();
    // Draw label
    let centerX = this.x + (this.width + 40) / 2;
    let centerY = this.y + 80 / 2;

    textFont("Arial", 20); // Define o tamanho do texto
    textStyle(BOLD);
    fill(color(0,0,0));
    textAlign(CENTER, CENTER);
    text(this.label, centerX, centerY); // Desenha o texto
  }
}