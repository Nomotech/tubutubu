// window.addEventListener('resize', function(){
// 	var margine = 3;
// 	//renderer.setSize(window.innerWidth-margine, window.innerHeight-margine);
// 	//camera.aspect = (window.innerWidth-margine) / (window.innerHeight-margine);
// 	renderer.setSize(window.innerWidth-margine, height);
// 	camera.aspect = (window.innerWidth-margine) / height;
// 	camera.updateProjectionMatrix();
// 	width = window.innerWidth-margine;
// 	height = window.innerHeight-margine;
// }, false );
//po
//---------------------------------< mouse >------------------------------------------
var mouseX = 50;
var mouseY = 50;
var mouseR = false;
var mouseC = false;
var mouseL = false;
var oldmouseR = false;
var oldmouseC = false;
var oldmouseL = false;
//var mouseButton = new InputMouseButton(window);

document.onmousemove = function(e) {
    var rect = e.target.getBoundingClientRect();
    // マウス位置(2D)
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    //console.log("X: " + mouseX + " Y: " + mouseY);
};

document.onmousedown = function(e) {
	//console.log("button: " + e.button + " buttons: " + e.buttons);
	mouseL = (e.button == 0) ? true : false;
	mouseC = (e.button == 1) ? true : false; 
	mouseR = (e.button == 2) ? true : false;
};

document.onmouseup = function (e){
	mouseL = false;
	mouseC = false; 
	mouseR = false;
};

//---------------------------------< keyboard >--------------------------------------------
//keycode
var key = new Array(300);
var keyName = [
	"",
	"Mouse L", 
	"Mouse R", 
	"Cancel", 
	"Mouse M", 
	"", 
	"", 
	"", 
	"BackSpace", 
	"Tab",
	"", 
	"", 
	"Clear", 
	"Enter", 
	"", 
	"", 
	"Shift", 
	"Ctrl", 
	"Alt",
	"Pause", 
	"CapsLock",
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"Esc", 
	"", 
	"",
	"", 
	"", 
	"Space", 
	"PageUp", 
	"PageDown", 
	"End", 
	"Home", 
	"Left", 
	"Up", 
	"Right",
	"Down",
	"", 
	"",
	"", 
	"PrtSc", 
	"Insert", 
	"Delete", 
	"Help", 
	"0",
	"1",
	"2",
	"3",
	"4",
	"5",
	"6",
	"7",
	"8",
	"9",
	"",
	":",
	"",
	"",
	"",
	"",
	"",
	"A",
	"B",
	"C",
	"D",
	"E",
	"F",
	"G",
	"H",
	"I",
	"J",
	"K",
	"L",
	"M",
	"N",
	"O",
	"P",
	"Q",
	"R",
	"S",
	"T",
	"U",
	"V",
	"W",
	"X",
	"Y",
	"Z",
	"",
	"",
	"",
	"",
	"",
	"Ten 0", 
	"Ten 1", 
	"Ten 2",
	"Ten 3", 
	"Ten 4", 
	"Ten 5", 
	"Ten 6", 
	"Ten 7", 
	"Ten 8",
	"Ten 9",
	"*",
	"+", 
	"Enter", 
	"-", 
	".", 
	"/", 
	"F1",
	"F2", 
	"F3", 
	"F4", 
	"F5", 
	"F6", 
	"F7", 
	"F8", 
	"F9", 
	"F10", 
	"F11", 
	"F12", 
	"F13", 
	"F14", 
	"F15", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"NumLock", 
	"ScrLk", 
	"", 
	"", 
	"", 
	"", 
	"",
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	": *", 
	"; +", 
	", <", 
	"- =", 
	". >", 
	"/ ?", 
	"@ `", 
	"", 
	"", 
	"", 
	"",
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"[ {", 
	"\|",
	"] }", 
	"^ ~", 
	"",
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	"", 
	""
];
var keyCharacter = "";
document.onkeydown = function (e){
  if(!e)e = window.event;
  //console.log(e);
  key[e.keyCode] = 1;
  keyCharacter = keyName[e.keyCode];
  //console.log(keyCharacter + ": " + e.keyCode);
}
document.onkeyup = function (e){
  if(!e)e = window.event;
  key[e.keyCode] = 0;
  keyCharacter = "";
}

//---------------------------------< length >----------------------------------------------
function lengthTwoPoint(x1,y1,x2,y2){
	var dx = x2 - x1;
	var dy = y2 - y1;
	var length = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2));
	return length;
}

function lengthCircle(cir1,cir2){
	var d = {};
	d.x = cir2.x - cir1.x;
	d.y = cir2.y - cir1.y;
	d.length = Math.sqrt(Math.pow(d.x,2) + Math.pow(d.y,2));
	d.inv = 1 / d.length;
	return d;
}

function lengthWall(cir,wa){
	var d = {};
	//console.log(d);
	var length_ = 1/wa.length;
	var v ={};
	v.x = cir.x - wa.x1;
	v.y = cir.y - wa.y1;
	var u ={};
	u.x = wa.x2 - wa.x1;
	u.y = wa.y2 - wa.y1;
	d.length = (u.x * v.y - u.y * v.x)/wa.length;
	if(d.length<0)d.length *= -1;
	h = (u.x * v.x + u.y * v.y) / wa.length;
	d.x = h * u.x -v.x;
	d.y = h * u.y -v.y; 
	//console.log(d);
	return d;
}

function lengthWall2(cir,wa){
	//console.log(d);
	if(wa.length!=0){
		var length_inv = 1/wa.length;
		var v ={};
		v.x = cir.x - wa.x1;
		v.y = cir.y - wa.y1;
		var u ={};
		u.x = wa.x2 - wa.x1;
		u.y = wa.y2 - wa.y1;
		var length = (u.x * v.y - u.y * v.x) * length_inv;
		if(length<0) console.log("po");
		return length;
	}
	return 0;
}

function lengthPointLine(p,l){
	if(l.length == 0) return 0;
	var v = {};
	var u = {}; 
	var cos;
	
	u.x = l.x2 - l.x1;
	u.y = l.y2 - l.y1;
	
	v.x = p.x - l.x2;
	v.y = p.y - l.y2;
	v.length = Math.sqrt(v.x * v.x + v.y * v.y);
	cos = (v.x * u.x + v.y * u.y) / (v.length * l.length);
	//console.log("cos2: " + cos);
	if(cos > 0){
		v.inv = 1 / v.length;
		return v;
	}

	v.x = p.x - l.x1;
	v.y = p.y - l.y1;
	v.length = Math.sqrt(v.x * v.x + v.y * v.y);
	cos = (v.x * u.x + v.y * u.y) / (v.length * l.length);
	//console.log("cos1: " + cos);
	if(cos < 0){
		v.inv = 1 / v.length;
		return v;
	}

	var d = {};
	cos = (v.x * u.x + v.y * u.y) / (l.length * l.length);
	d.x = v.x - cos * u.x;
	d.y = v.y - cos * u.y;
	d.length = Math.sqrt(d.x * d.x + d.y * d.y); 
	d.inv = 1 / d.length;
	//v.length = (u.x * v.y - u.y * v.x) / l.length;
	return d;
}

//----------------------------------< draw >-----------------------------------------------
function drawLine(x1,y1,x2,y2,color){
    ctx.strokeStyle = color; 
    ctx.beginPath();    // 1.Pathで描画を開始する
    ctx.moveTo(x1,y1);  // 2.描画する位置を指定する
    ctx.lineTo(x2,y2);  // 3.指定座標まで線を引く
    ctx.stroke();       // 4.Canvas上に描画する
}

function drawBox(x,y,w,h,color) {
	ctx.strokeStyle = color; 
    ctx.beginPath();
    ctx.strokeRect(x-w/2, y-h/2, w, h);
}


function drawCircle(x,y,r,color) {
    ctx.strokeStyle = color; 
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.arc(x, y, r, 0, Math.PI*2, false);
    ctx.stroke();
}
var grad;
function drawFillCircle(x,y,r,color1,color2) {
    ctx.strokeStyle = color1; 
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.arc(x, y, r, 0, Math.PI*2, false);
    grad  = ctx.createRadialGradient(x,y,0,x,y,r);
    grad.addColorStop(0,color1);
    grad.addColorStop(0.5,color1);     
    grad.addColorStop(1,color2);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.stroke();
}

function CheckInput(){
	for(var i=0; i<document.form1.elements.length;i++){
        // i番目のチェックボックスがチェックされているかを判定
        if(document.form1.elements[i].checked){
            zone[i].flag = true;    
        }else{
        	zone[i].flag = false;
        }
    }
}