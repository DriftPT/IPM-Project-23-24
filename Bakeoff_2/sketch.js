// Bake-off #2 -- Seleção em Interfaces Densas
// IPM 2023-24, Período 3
// Entrega: até às 23h59, dois dias úteis antes do sexto lab (via Fenix)
// Bake-off: durante os laboratórios da semana de 18 de Março

// p5.js reference: https://p5js.org/reference/

// Database (CHANGE THESE!)
const GROUP_NUMBER        = 8;      // Add your group number here as an integer (e.g., 2, 3)
const RECORD_TO_FIREBASE  = true;  // Set to 'true' to record user results to Firebase

// Pixel density and setup variables (DO NOT CHANGE!)
let PPI, PPCM;
const NUM_OF_TRIALS       = 12;     // The numbers of trials (i.e., target selections) to be completed
let continue_button;
let legendas;                       // The item list from the "legendas" CSV

// Metrics (DO NOT CHANGE!)
let testStartTime, testEndTime;     // time between the start and end of one attempt (8 trials)
let hits 			      = 0;      // number of successful selections
let misses 			      = 0;      // number of missed selections (used to calculate accuracy)
let database;                       // Firebase DB  

// Study control parameters (DO NOT CHANGE!)
let draw_targets          = false;  // used to control what to show in draw()
let trials;                         // contains the order of targets that activate in the test
let current_trial         = 0;      // the current trial number (indexes into trials array above)
let attempt               = 0;      // users complete each test twice to account for practice (attemps 0 and 1)

// Target list and layout variables
let targets               = [];
let letter = 0;
const GRID_ROWS           = 8;      // We divide our 80 targets in a 8x10 grid
const GRID_COLUMNS        = 10;     // We divide our 80 targets in a 8x10 grid

// Ensures important data is loaded before the program starts
function preload()
{
  // id,city,...
  legendas = loadTable('legendas.csv', 'csv', 'header', function(table) {
    // Sort the rows based on the "city" column in alphabetical order
    table.rows.sort((a, b) => a.obj.city.localeCompare(b.obj.city));
  });
}

// Runs once at the start
function setup()
{
  createCanvas(700, 500);    // window size in px before we go into fullScreen()
  frameRate(60);             // frame rate (DO NOT CHANGE!)
  
  randomizeTrials();         // randomize the trial order at the start of execution
  drawUserIDScreen();        // draws the user start-up screen (student ID and display size)
  
}

// Runs every frame and redraws the screen
function draw()
{
  if (draw_targets && attempt < 2)
  {     
    // The user is interacting with the 6x3 target grid
    background(color(0,0,0));        // sets background to black
    
    // Print trial count at the top left-corner of the canvas
    textFont("Arial", 16);
    fill(color(255,255,255));
    textAlign(LEFT);
    text("Trial " + (current_trial + 1) + " of " + trials.length, 50, 20);
        
    // Draw all targets
	for (var i = 0; i < legendas.getRowCount(); i++) {
      if(letter == 0 || targets[i].letter == letter)
      targets[i].draw();
    }
    for (var j = legendas.getRowCount(); j < legendas.getRowCount()+10; j++){
      targets[j].draw();
    }
    
    // Draws the target label to be selected in the current trial. We include 
    // a black rectangle behind the trial label for optimal contrast in case 
    // you change the background colour of the sketch (DO NOT CHANGE THESE!)
    fill(color(0,0,0));
    rect(0, height - 40, width, 40);
 
    textFont("Arial", 20); 
    fill(color(255,255,255)); 
    textAlign(CENTER); 
    text(legendas.getString(trials[current_trial],1), width/2, height - 20);
  }
}

// Print and save results at the end of 54 trials
function printAndSavePerformance()
{
  // DO NOT CHANGE THESE! 
  let accuracy			= parseFloat(hits * 100) / parseFloat(hits + misses);
  let test_time         = (testEndTime - testStartTime) / 1000;
  let time_per_target   = nf((test_time) / parseFloat(hits + misses), 0, 3);
  let penalty           = constrain((((parseFloat(95) - (parseFloat(hits * 100) / parseFloat(hits + misses))) * 0.2)), 0, 100);
  let target_w_penalty	= nf(((test_time) / parseFloat(hits + misses) + penalty), 0, 3);
  let timestamp         = day() + "/" + month() + "/" + year() + "  " + hour() + ":" + minute() + ":" + second();
  
  textFont("Arial", 18);
  background(color(0,0,0));   // clears screen
  fill(color(255,255,255));   // set text fill color to white
  textAlign(LEFT);
  text(timestamp, 10, 20);    // display time on screen (top-left corner)
  
  textAlign(CENTER);
  text("Attempt " + (attempt + 1) + " out of 2 completed!", width/2, 60); 
  text("Hits: " + hits, width/2, 100);
  text("Misses: " + misses, width/2, 120);
  text("Accuracy: " + accuracy + "%", width/2, 140);
  text("Total time taken: " + test_time + "s", width/2, 160);
  text("Average time per target: " + time_per_target + "s", width/2, 180);
  text("Average time for each target (+ penalty): " + target_w_penalty + "s", width/2, 220);

  // Saves results (DO NOT CHANGE!)
  let attempt_data = 
  {
        project_from:       GROUP_NUMBER,
        assessed_by:        student_ID,
        test_completed_by:  timestamp,
        attempt:            attempt,
        hits:               hits,
        misses:             misses,
        accuracy:           accuracy,
        attempt_duration:   test_time,
        time_per_target:    time_per_target,
        target_w_penalty:   target_w_penalty,
  }
  
  // Sends data to DB (DO NOT CHANGE!)
  if (RECORD_TO_FIREBASE)
  {
    // Access the Firebase DB
    if (attempt === 0)
    {
      firebase.initializeApp(firebaseConfig);
      database = firebase.database();
    }
    
    // Adds user performance results
    let db_ref = database.ref('G' + GROUP_NUMBER);
    db_ref.push(attempt_data);
  }
}

// Mouse button was pressed - lets test to see if hit was in the correct target
function mousePressed() 
{
  // Only look for mouse releases during the actual test
  // (i.e., during target selections)
  if (draw_targets)
  {
    for (var i = 0; i < legendas.getRowCount(); i++)
    {
      // Check if the user clicked over one of the targets
      if (targets[i].clicked(mouseX, mouseY)) 
      {
        // Checks if it was the correct target
        if (targets[i].id === targets[trials[current_trial]].id){
          targets[i].marked = true;
          hits++;
        } 
        else misses++;
        targets[i].draw();
        current_trial++;              // Move on to the next trial/target
        resetPosition();
        letter = 0;
        break;
      }
    }
    for (var j = legendas.getRowCount(); j < legendas.getRowCount()+10; j++){
      if(targets[j].clicked(mouseX, mouseY)){
        resetPosition();
        letter = targets[j].col+1;
        adjustPosition();
        //print(letter);
      }
    }
    
    // Check if the user has completed all trials
    if (current_trial === NUM_OF_TRIALS)
    {
      testEndTime = millis();
      draw_targets = false;          // Stop showing targets and the user performance results
      printAndSavePerformance();     // Print the user's results on-screen and send these to the DB
      attempt++;                      
      
      // If there's an attempt to go create a button to start this
      if (attempt < 2)
      {
        continue_button = createButton('START 2ND ATTEMPT');
        continue_button.mouseReleased(continueTest);
        continue_button.position(width/2 - continue_button.size().width/2, height/2 - continue_button.size().height/2);
      }
    }
    // Check if this was the first selection in an attempt
    else if (current_trial === 1) testStartTime = millis(); 
  }
}

function adjustPosition(){
    let display        = new Display({ diagonal: display_size }, window.screen);
  
    // Make your decisions in 'cm', so that targets have the same size for all participants
    // Below we find out out white space we can have between 2 cm targets
    let screen_width   = display.width * 2.54;             // screen width
    let screen_height  = display.height * 2.54;            // screen height
      
  for(i=0; i<legendas.getRowCount();i++){
    if (targets[i].letter === letter) {
      switch(letter){
        case 1:
          targets[i].y = targets[i].y + (screen_height * 18.5 / 35 * PPCM);
          break;
        case 2:
          targets[i].y = targets[i].y + (screen_height * 14.9 / 35 * PPCM);
          break;
        case 3:
          if (targets[i].id == 53){
            targets[i].x = targets[i].x + (screen_width * 442/ 1000 * PPCM);
            targets[i].y = targets[i].y + (screen_height * 11.3 / 35 * PPCM);
          } 
          else{
            targets[i].y = targets[i].y + (screen_height * 14.9 / 35 * PPCM);
            targets[i].x = targets[i].x - (screen_width * 540 / 1000 * PPCM);
          }
          break;
        case 4:
          targets[i].y = targets[i].y + (screen_height * 11.3 / 35 * PPCM);
          targets[i].x = targets[i].x - (screen_height * 100/ 1000 * PPCM);
          break;
        case 5:
          targets[i].y = (screen_height * 27.6 / 35 * PPCM);
          targets[i].x = screen_width * 454 / 1000 * PPCM;
          break;
        case 6:
          targets[i].y = (screen_height * 27.6 / 35 * PPCM);
          targets[i].x = screen_width * 510 / 1000 * PPCM;
          break;
        case 7:
          targets[i].y = (screen_height * 27.6 / 35 * PPCM);
          targets[i].x = targets[i].x + (screen_height * 340/ 1000 * PPCM);
          break;
        case 8:
          targets[i].y = targets[i].y + (screen_height * 4 / 35 * PPCM);
          break;
        case 9:
          if (targets[i].id == 35){
            targets[i].y = targets[i].y + (screen_height * 4 / 35 * PPCM);
            targets[i].x = screen_width * 20 / 1100 * PPCM;
          }
          else{
            targets[i].y = targets[i].y + (screen_height * 0.35 / 35 * PPCM);
            targets[i].x = targets[i].x + (screen_height * 170/ 1000 * PPCM);
          }
          break;
        case 10:
          targets[i].y = (screen_height * 27.6 / 35 * PPCM);
          targets[i].x = targets[i].x - (screen_height * 350/ 1000 * PPCM);
          break;
      }
    }
  }
}

function resetPosition(){
  
  let display        = new Display({ diagonal: display_size }, window.screen);
  
    // Make your decisions in 'cm', so that targets have the same size for all participants
    // Below we find out out white space we can have between 2 cm targets
    let screen_width   = display.width * 2.54;             // screen width
    let screen_height  = display.height * 2.54;            // screen height
  
  for(i=0; i<legendas.getRowCount();i++){
    if (targets[i].letter === letter) {
      switch(letter){
        case 1:
          targets[i].y = targets[i].y - (screen_height * 18.5 / 35 * PPCM);
          break;
        case 2:
          targets[i].y = targets[i].y - (screen_height * 14.9 / 35 * PPCM);
          break;
        case 3:
          if (targets[i].id == 53){
            targets[i].x = targets[i].x - (screen_width * 442 / 1000 * PPCM);
            targets[i].y = targets[i].y - (screen_height * 11.3 / 35 * PPCM);
          }
          else{
            targets[i].y = targets[i].y - (screen_height * 14.9 / 35 * PPCM);
            targets[i].x = targets[i].x + (screen_width * 540 / 1000 * PPCM);
          }
          break;
        case 4:
          targets[i].y = targets[i].y - (screen_height * 11.3 / 35 * PPCM);
          targets[i].x = targets[i].x + (screen_height * 100/ 1000 * PPCM);
          break;
        case 5:
          targets[i].y = (screen_height * 285  / 500 * PPCM);
          targets[i].x = screen_width * 20 / 1100 * PPCM;
          break;
        case 6:
          targets[i].y = (screen_height * 285  / 500 * PPCM);
          targets[i].x = screen_width * 128 / 1100 * PPCM;
          break;
        case 7:
          targets[i].y = (screen_height * 285  / 500 * PPCM);
          targets[i].x = targets[i].x - (screen_height * 340/ 1000 * PPCM);
          break;
        case 8:
          targets[i].y = targets[i].y - (screen_height * 4 / 35 * PPCM);
          break;
        case 9:
           if (targets[i].id == 35){
            targets[i].y = targets[i].y - (screen_height * 4 / 35 * PPCM);
            targets[i].x = screen_width * 992 / 1100 * PPCM;
          }
          else{
            targets[i].y = targets[i].y - (screen_height * 0.35 / 35 * PPCM);
            targets[i].x = targets[i].x - (screen_height * 170/ 1000 * PPCM);
          }
          break;
        case 10:
          targets[i].y = (screen_height * 389 / 500 * PPCM);
          targets[i].x = targets[i].x + (screen_height * 350/ 1000 * PPCM);
          break;
      }
    }
  }
}

// Evoked after the user starts its second (and last) attempt
function continueTest()
{
  // Re-randomize the trial order
  randomizeTrials();
  
  // Resets performance variables
  hits = 0;
  misses = 0;
  
  current_trial = 0;
  continue_button.remove();
  
  for (var i = 0; i < legendas.getRowCount(); i++) { 
      targets[i].marked = false;
  }
  
  // Shows the targets again
  draw_targets = true; 
}

// Is invoked when the canvas is resized (e.g., when we go fullscreen)
function windowResized() 
{
  if (fullscreen())
  {
    resizeCanvas(windowWidth, windowHeight);
    
    // DO NOT CHANGE THE NEXT THREE LINES!
    let display        = new Display({ diagonal: display_size }, window.screen);
    PPI                = display.ppi;                      // calculates pixels per inch
    PPCM               = PPI / 2.54;                       // calculates pixels per cm
  
    // Make your decisions in 'cm', so that targets have the same size for all participants
    // Below we find out out white space we can have between 2 cm targets
    let screen_width   = display.width * 2.54;             // screen width
    let screen_height  = display.height * 2.54;            // screen height
    let target_size    = 40;                                // sets the target size (will be converted to cm when passed to createTargets)
    let horizontal_gap = screen_width - target_size * GRID_COLUMNS;// empty space in cm across the x-axis (based on 10 targets per row)
    let vertical_gap   = (screen_height - target_size * GRID_ROWS);  // empty space in cm across the y-axis (based on 8 targets per column)

    // Creates and positions the UI targets according to the white space defined above (in cm!)
    // 80 represent some margins around the display (e.g., for text)
    //createTargets(target_size * PPCM, horizontal_gap * PPCM - 50, vertical_gap * PPCM -150);

    
    
    let x_start = 20;
    let x_index = 108;
    let y_start = 25;
    let y_index = 52;
    let linhas = 0;
    let x_menu_start = 28;
    let x_menu_index = 5;
    // Calcular a largura relativa com base na diagonal da tela
    let diagonal_tela_polegadas = Math.sqrt(Math.pow(screen_width, 2) + Math.pow(screen_height, 2)) / PPCM;
    let largura_em_polegadas = target_size * (diagonal_tela_polegadas / display_size); 

    // Convertar a largura do quadrado de polegadas para pixels usando PPCM
    let largura_em_pixels = largura_em_polegadas * PPCM;
    
    for (var r = 0; r < GRID_ROWS; r++){
      for (var c = 0; c < GRID_COLUMNS; c++){
        if(linhas == 10){
          x_start = 20;
          linhas = 0;
          y_start += y_index;
        }
        let legendas_index = c + GRID_COLUMNS * r;
        let target_id = legendas.getNum(legendas_index, 0);  
        let target_label = legendas.getString(legendas_index, 1);
        targets.push(new Target(screen_width * x_start / 1100 * PPCM, screen_height * y_start / 500 * PPCM, largura_em_pixels, target_label, target_id));
        x_start += x_index;
        linhas ++;
      }
    }
    
    for (var i = 0; i < 10; i++){
      targets.push(new menu(screen_width * x_menu_start / 100 * PPCM, screen_height * 900 / 1000 * PPCM, largura_em_pixels / 2, i));
      x_menu_start += x_menu_index;
    }

    // Starts drawing targets immediately after we go fullscreen
    draw_targets = true;
  }
}