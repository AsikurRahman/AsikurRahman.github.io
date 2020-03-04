
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

var onRect = false;
var rectX1;
var rectX2;
var rectY;
var rectW;
var rectH;
function draw() {
  background(255,255,255);
  if (datain2 > 0){
	 rectX1 = datain1;
	 rectX2 = datain2;
	 rectY = 30;
     rectW = 100;
     rectH = 100;
	 fill(255, 204, 0);
	 rect(rectX1, rectY, rectW, rectH);
	 fill(0, 255, 204);
	 rect(rectX2, rectY + 150, rectW, rectH);
	//text(("2 sensors added together: " + datain), datain/5,//30);
  }
}


function mouseClicked(){
	if (onRect){
		//sendLightMessage(1);
		console.log('sendLightMessage(1)');
	}
}

function mouseReleased(){
	if (onRect){
		console.log('sendLightMessage(0)');
		//sendLightMessage(0);
	}
}

function mouseMoved(){
	console.log('mouse', mouseX, mouseY);
	onRect = rectX1 < mouseX &&
		mouseX < (rectX1 + rectW) &&
		rectY < mouseY &&
		mouseY < (rectY + rectH);
	console.log('onRect', onRect);
}
