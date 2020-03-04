// Asikur Rahman 
// Assignment 6 
// Person I collaborated with: Sabreen 


void setup(){
  Serial.begin(9600);
}

void loop(){
  String output = "[";
  output = output + analogRead(A0) + "," + analogRead(A1) + "]";
  Serial.println(output);
  delay(50); 
}
