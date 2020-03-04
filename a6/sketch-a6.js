
// Asikur Rahman
// Assignment 6
// Person I Collaborated with: Sabreen


var serial; // variable to hold an instance of the serialport library
var portName = 'COM5'; //rename to the name of your port
var datain1; //some data coming in over serial!
var datain2; //some data coming in over serial!
var xPos = 0;


function setup() {
  serial = new p5.SerialPort();       // make a new instance of the serialport library
  serial.on('list', printList);       // set a callback function for the serialport list event
  serial.on('connected', serverConnected); // callback for connecting to the server
  serial.on('open', portOpen);        // callback for the port opening
  serial.on('data', serialEvent);     // callback for when new data arrives
  serial.on('error', serialError);    // callback for errors
  serial.on('close', portClose);      // callback for the port closing

  serial.list();                      // list the serial ports
  serial.open(portName);              // open a serial port
  createCanvas(1200, 800);
  background(0x08, 0x16, 0x40);
}

// get the list of ports:
function printList(portList) {
 // portList is an array of serial port names
 for (var i = 0; i < portList.length; i++) {
 // Display the list the console:
   print(i + " " + portList[i]);
 }
}

function serverConnected() {
  print('connected to server.');
}

function portOpen() {
  print('the serial port opened.')
}

function serialError(err) {
  print('Something went wrong with the serial port. ' + err);
}

function portClose() {
  print('The serial port closed.');
}

function serialEvent() {
  if (serial.available()) {
	var datastring = serial.readLine(); // readin some serial
	var newarray;
	try {
  	  newarray = JSON.parse(datastring); // can we parse the serial
  	} catch(err) {
      	  //console.log(err);
	}
	if (typeof(newarray) == 'object') {
  	  dataarray = newarray;
	  datain1 = dataarray[0];
	  datain2 = dataarray[1];
	}
  }
}

function graphData(newData) {
  // map the range of the input to the window height:
  var yPos = map(newData, 0, 255, 0, height);
  // draw the line in a pretty color:
  stroke(255, 0, 80);
  line(xPos, height, xPos, height - yPos);
  // at the edge of the screen, go back to the beginning:
  if (xPos >= width) {
    xPos = 0;
    // clear the screen by resetting the background:
    background(0x08, 0x16, 0x40);
  } else {
    // increment the horizontal position for the next reading:
    xPos++;
  }
}


var onRect1; // variable to check if mouse is on top of rectangle
var onRect2; // variable to check if mouse is on top of rectangle
var rectX1; // x position of recangle
var rectX2; // x position of rectangle
var rectY1; // y pos of rectangle
var rectY2; // y pos of rectangle
var rectW; // width of rectangle
var rectH; // height of rectangle

// draw function used to create the rectangles
function draw() {
  background(255,255,255);
  if (datain2 > 0){
	 rectX1 = 300;
	 rectX2 = 300;
	 rectY1 = 30;
	 rectY2 = 200;
     rectW = 100;
     rectH = 100;
	 fill((datain1-990) * 10, 0, 0);     // same thing as map function 0 to 250
	 rect(rectX1, rectY1, rectW, rectH); // construct rectangle with my constants

	 fill(0, (datain2 - 800) * 5, 0);    // same thing as map function 0 to 250
	 rect(rectX2, rectY2, rectW, rectH); // construct rectangle with my constants

	//text(("2 sensors added together: " + datain), datain/5,//30);
  }
}

// this is a function for when mouse is clicked
function mouseClicked(){
	var info;
	if (onRect1){ // if mouse clicked rect 1
		info = 0;   // sends 0 to arduino code
	}

	if (onRect2){
		info = 1;
	}

	if (onRect1 || onRect2){ // if mouse is on neither of them -- don't send anything
		serial.write(info); // serial writes to do nothing
	}
}

// everytime you move your mouse, it updates if your mouse is on rect 1 or rect 2
function mouseMoved(){
	onRect1 = rectX1 < mouseX && // checks if x pos is true
		mouseX < (rectX1 + rectW) &&  // checks if width of rect is true
		rectY1 < mouseY &&           // checks if y pos of rect is true
		mouseY < (rectY1 + rectH);   // checks if height of rect is true

	onRect2 = rectX2 < mouseX &&    // checks if x pos is true
		mouseX < (rectX2 + rectW) &&  // checks if width of rect is true
		rectY2 < mouseY &&            // checks if y pos of rect is true
		mouseY < (rectY2 + rectH);    // checks if height of rect is true

}
