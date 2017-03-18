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

var mouseX = 50;
var mouseY = 50;
var mouseR = false;
var mouseL = false;
document.onmousemove = function(e) {
    var rect = e.target.getBoundingClientRect();
    // マウス位置(2D)
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    //console.log("X: " + mouseX + " Y: " + mouseY);
};

document.onmousedown = function(e) {  
	mouseL = true;
};

document.onmouseup = function (e){
  	mouseL = false;  
};

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
		var length_ = 1/wa.length;
		var v ={};
		v.x = cir.x - wa.x1;
		v.y = cir.y - wa.y1;
		var u ={};
		u.x = wa.x2 - wa.x1;
		u.y = wa.y2 - wa.y1;
		var length = (u.x * v.y - u.y * v.x)/wa.length;
		if(length<0) console.log("po");
		return length;
	}
	return 0;
}