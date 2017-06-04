var i;
//tubu

var objects = [];
var column =50;


var circleNum = 1000;
var circle = new Array(circleNum);
for(i = 0;i<circleNum;i++){
    circle[i] = {};
    circle[i].color = "rgb(0, 205, 205)";
    circle[i].effectRange = 10;
    circle[i].r = circle[i].effectRange * 0.3;
    circle[i].vx = 0;
    circle[i].vy = 0;
    circle[i].v = 0;
    circle[i].x = i%column * circle[i].r * 2.5 + 100 + 10;
    circle[i].y = Math.ceil((i + 1)/column) * circle[i].r * 2.5 + 100 + 0;  
    circle[i].fx = 0;
    circle[i].fy = 0;
    circle[i].m = 1.0;
    circle[i].neighborsNum = 0;
    circle[i].neighbors = new Array();
    circle[i].density = 0;
    circle[i].pressure = 0;
    circle[i].cage = false;
    circle[i].area = 1;
    circle[i].type = 'normal';
    circle[i].tmp = circle[i].effectRange;
    circle[i].tc = 0.005;		//thermal conductivity

    objects.push(circle[i]);
}

var num;
var sum = 0;

num = 700;
for(i = sum ;i < sum + num ; i++){
    //circle[i].color = "rgb(255, 105, 55)";
    //circle[i].type = 'fire';
    //circle[i].m = 0.5;
    circle[i].effectRange = 10;
    circle[i].r = circle[i].effectRange * 0.3;
}
sum += num ;


// num = 700;
// for(i = sum ;i < sum + num ; i++){
//     circle[i].color = "rgb(115, 100, 255)";
//     circle[i].type = 'frg';
//     //circle[i].m = 1.4;
//     circle[i].effectRange = 13;
//     circle[i].r = circle[i].effectRange * 0.3;
// }
// sum += num ;

//マウスカーソル
mousePoint = {};
mousePoint.x = 0;
mousePoint.y = 0;
mousePoint.force = 0;
mousePoint.cageRange = 0;
mousePoint.forceRange = 5;
mousePoint.color = "rgb(255, 155, 0)";
mousePoint.color2 = "rgb(255, 155, 0)";

var wallNum = 6;
var wall = new Array(wallNum);
for(var i = 0;i<wallNum;i++){
    wall[i] = {};
}

var fieldOffset = 50;
var fieldWidth = 500;
var fieldHeight = 500;

wall[0].r = 7;
wall[0].x1 = fieldOffset;				wall[0].y1 = fieldOffset;       		wall[0].x2 = fieldOffset;       		wall[0].y2 = fieldOffset + fieldHeight; 
wall[0].length = lengthTwoPoint(wall[0].x1,wall[0].y1,wall[0].x2,wall[0].y2);

wall[1].r = 7;
wall[1].x1 = fieldOffset;       		wall[1].y1 = fieldOffset + fieldHeight;	wall[1].x2 = fieldOffset + fieldWidth;	wall[1].y2 = fieldOffset + fieldHeight; 
wall[1].length = lengthTwoPoint(wall[1].x1,wall[1].y1,wall[1].x2,wall[1].y2); 

wall[2].r = 7;
wall[2].x1 = fieldOffset + fieldWidth;	wall[2].y1 = fieldOffset + fieldHeight;	wall[2].x2 = fieldOffset + fieldWidth;	wall[2].y2 = fieldOffset;          		
wall[2].length = lengthTwoPoint(wall[2].x1,wall[2].y1,wall[2].x2,wall[2].y2); 

wall[3].r = 7;
wall[3].x1 = fieldOffset + fieldWidth;	wall[3].y1 = fieldOffset;       		wall[3].x2 = fieldOffset;       		wall[3].y2 = fieldOffset;          		
wall[3].length = lengthTwoPoint(wall[3].x1,wall[3].y1,wall[3].x2,wall[3].y2); 

wall[4].r = 5;
wall[4].x1 = 100; wall[4].y1 = 300; wall[4].x2 = 400; wall[4].y2 = 100;          		
wall[4].length = lengthTwoPoint(wall[4].x1,wall[4].y1,wall[4].x2,wall[4].y2);

wall[5].r = 5;
wall[5].theta = 0;
wall[5].length = 400;
wall[5].x0 = 300; wall[5].y0 = 300;
wall[5].x1 = wall[5].x0 + Math.cos(wall[5].theta) * wall[5].length / 2;
wall[5].y1 = wall[5].y0 + Math.sin(wall[5].theta) * wall[5].length / 2;
wall[5].x2 = wall[5].x0 - Math.cos(wall[5].theta) * wall[5].length / 2;
wall[5].y2 = wall[5].y0 - Math.sin(wall[5].theta) * wall[5].length / 2;          		



function drawField(){ 
    for(var i = 0;i<wall.length;i++) drawLine(wall[i].x1,wall[i].y1,wall[i].x2,wall[i].y2,"rgb(0, 0, 0)");
}

/*    column
	.________________________________
row |                                |
	|  0   1   2   3   4   5   6   7 |
	|   .------------------------.   |
	|  8|  9  10  11  12  13  14 |15 |
	|   |                        |   |
	| 16| 17  18  19  20  21  22 |23 |
	|   |                        |   |
	| 24| 25  26  27  28  29  30 |31 |
	|   |                        |   |
	| 32| 33  34  35  36  37  38 |39 |
	|   |                        |   |
	| 40| 41  42  43  44  45  46 |47 |
	|   |                        |   |
    | 48| 49  50  51  52  53  54 |55 |
	|   '------------------------'   |
	| 56  57  58  59  60  61  62  63 |
	|                                |
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~



*/
var areaWidth  = 20;
var areaHeight = 20;
var areaColumn = fieldWidth/areaWidth + 6;
var areaRow = fieldHeight/areaHeight + 6;
var area = new Array(areaColumn * areaRow);
for(let i = 0; i<area.length;i++){
	area[i] = {};
	area[i].objects = [];
	area[i].neighbors = [];
}
for(let i = 0;i<areaColumn * areaRow;i++){
	if(i > areaColumn && i < areaColumn * areaRow - 1 - areaColumn && i%areaColumn > 0 && i%areaColumn < (areaColumn-1)){
		area[i].neighbors = [
			i - areaColumn - 1	, i - areaColumn 	, i - areaColumn + 1,
			i - 1				, i 				, i + 1 			,
			i + areaColumn - 1	, i + areaColumn 	, i + areaColumn + 1
		];	
		
	}
}


function areaAllocation(){
	var ci;
	var r;
	var c;
	var num;
	for(let i = 0; i< area.length;i++){
		area[i].objects = [];
	}
	for(let i = 0;i < objects.length; i++){
		ci = objects[i];
		r = Math.floor((ci.x - fieldOffset + areaWidth*3 ) / areaWidth);
		c = Math.floor((ci.y - fieldOffset + areaHeight*3) / areaHeight);
		num = r + c * areaColumn;
		if(num > 0 && num < area.length) ci.area = num;
		 if((c%2==0&&r%2==0)||(c%2==1&&r%2==1))ci.color = "rgb(0, 205, 205)";
		 else ci.color = "rgb(255, 155, 155)";
		for(let j = 0;j<area[ci.area].neighbors.length ;j++){
			num = area[ci.area].neighbors[j];
			area[num].objects.push(i);
		}
	}
}

var zoneNum = 2;
var zone = new Array(zoneNum);
for(let i = 0; i<zone.length;i++) zone[i] = {};
zone[0].flag = 0;
zone[0].x = 500;
zone[0].y = 500;
zone[0].width = 100;
zone[0].height = 100;
zone[0].effect = function(ci){
	ci.effectRange += 0.05;
	if(ci.effectRange > 16) ci.effectRange = 14;
	ci.r = ci.effectRange * 0.3;
}

zone[1].flag = 0;
zone[1].x = 100;
zone[1].y = 500;
zone[1].width = 100;
zone[1].height = 100;
zone[1].effect = function(ci){
	ci.effectRange -= 0.05;
	if(ci.effectRange < 6) ci.effectRange = 6;
	ci.r = ci.effectRange * 0.3;
}

function drawZone(){
	drawBox(zone[0].x,zone[0].y,zone[0].width,zone[0].height,"rgb(255, 150, 55)");
	drawBox(zone[1].x,zone[1].y,zone[1].width,zone[1].height,"rgb(155, 150, 255)");
}

function heatZone(ci,zone){
	if(ci.x < zone.x + zone.width/2
	&& ci.x > zone.x - zone.width/2
	&& ci.y < zone.y + zone.height/2
	&& ci.y > zone.y - zone.height/2){
		zone.effect(ci);
	}else{
		// ci.effectRange -= 0.001;
		// if(ci.effectRange < 6) ci.effectRange = 6;
  //   	ci.r = ci.effectRange * 0.3;
	}
}

function thermograph(ci){
	if(		ci.effectRange > 0 	&& ci.effectRange <= 5) 	ci.color = "rgb(255, 105, 55)";
	else if(ci.effectRange > 5 	&& ci.effectRange <= 7)		ci.color = "rgb(255, 105, 55)";
	else if(ci.effectRange > 7 	&& ci.effectRange <= 9)		ci.color = "rgb(255, 105, 55)";
	else if(ci.effectRange > 9 	&& ci.effectRange <= 11)	ci.color = "rgb(255, 105, 55)";
	else if(ci.effectRange > 11 && ci.effectRange <= 13)	ci.color = "rgb(255, 105, 55)";
}

function thermography(ci){
	// 0 <= ci.r <= 16 --> 0 <= value <= 2
	var value = (ci.effectRange - 8)/ 4;
	var r,g,b;
	if(value <= 1){
		r = 0;
		g = Math.floor(255 * easeInOutExpo(value));
		b = Math.floor(255 * (1 - easeInOutExpo(value)));
	}else{
		r = Math.floor(255 * easeInOutExpo(value - 1));
		g = Math.floor(255 * (1 - easeInOutExpo(value - 1)));
		b = 0;
	}
	ci.color = "rgb(" + r + "," + g + "," + b +")";
}





