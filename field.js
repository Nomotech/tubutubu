
//tubu
var column =70;
var circleNum = 3000;
var circle = new Array(circleNum);
for(var i = 0;i<circleNum;i++){
    circle[i] = {};
    circle[i].color = "rgb(0, 205, 205)";
    circle[i].r = 3;
    circle[i].vx = 0;
    circle[i].vy = 0;
    circle[i].v = 0;
    circle[i].x = i%column * circle[i].r * 2.5 + 100 + 10;
    circle[i].y = Math.ceil((i + 1)/column) * circle[i].r * 2.5 + 100 + 10;  
    circle[i].fx = 0;
    circle[i].fy = 0;
    circle[i].m = 0.5;
    circle[i].neighborsNum = 0;
    circle[i].neighbors = new Array();
    circle[i].density = 0;
    circle[i].pressure = 0;
    circle[i].cage = false;
    circle[i].area = 1;
}

//マウスカーソル
mousePoint = {};
mousePoint.x = 0;
mousePoint.y = 0;
mousePoint.force = 0;
mousePoint.cageRange = 0;
mousePoint.forceRange = 5;
mousePoint.color = "rgb(255, 155, 0)";
mousePoint.color2 = "rgb(255, 155, 0)";

var wallNum = 4;
var wall = new Array(wallNum);
for(var i = 0;i<wallNum;i++){
    wall[i] = {};
}
var fieldOffset = 50;
var fieldWidth = 600;
var fieldHeight = 800;
function drawField(){
    wall[0].x1 = fieldOffset;				wall[0].y1 = fieldOffset;       		wall[0].x2 = fieldOffset;       		wall[0].y2 = fieldOffset + fieldHeight; 
    wall[0].length = lengthTwoPoint(wall[0].x1,wall[0].y1,wall[0].x2,wall[0].y2); wall[0].vx =-1; wall[0].vy = 0;
    
    wall[1].x1 = fieldOffset;       		wall[1].y1 = fieldOffset + fieldHeight;	wall[1].x2 = fieldOffset + fieldWidth;	wall[1].y2 = fieldOffset + fieldHeight; 
    wall[1].length = lengthTwoPoint(wall[1].x1,wall[1].y1,wall[1].x2,wall[1].y2); wall[1].vx = 0; wall[1].vy = 1;
    
    wall[2].x1 = fieldOffset + fieldWidth;	wall[2].y1 = fieldOffset + fieldHeight;	wall[2].x2 = fieldOffset + fieldWidth;	wall[2].y2 = fieldOffset;          		
    wall[2].length = lengthTwoPoint(wall[2].x1,wall[2].y1,wall[2].x2,wall[2].y2); wall[2].vx = 1; wall[2].vy = 0;
    
    wall[3].x1 = fieldOffset + fieldWidth;	wall[3].y1 = fieldOffset;       		wall[3].x2 = fieldOffset;       		wall[3].y2 = fieldOffset;          		
    wall[3].length = lengthTwoPoint(wall[3].x1,wall[3].y1,wall[3].x2,wall[3].y2); wall[3].vx = 0; wall[3].vy =-1;
    
    for(var i = 0;i<wallNum;i++) drawLine(wall[i].x1,wall[i].y1,wall[i].x2,wall[i].y2,"rgb(0, 0, 0)");
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
var areaColumn = fieldWidth/10 + 6;
var areaRow = fieldHeight/10 + 6;
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
	for(let i = 0;i < circleNum; i++){
		ci = circle[i];
		r = Math.floor((ci.x - fieldOffset + areaWidth*3 ) / areaWidth);
		c = Math.floor((ci.y - fieldOffset + areaHeight*3) / areaHeight);
		num = r + c * areaColumn;
		if(num > 0 && num < area.length) ci.area = num;
		// if((c%2==0&&r%2==0)||(c%2==1&&r%2==1))ci.color = "rgb(0, 205, 205)";
		// else ci.color = "rgb(255, 155, 155)";
		for(let j = 0;j<area[ci.area].neighbors.length ;j++){
			num = area[ci.area].neighbors[j];
			area[num].objects.push(i);
		}
	}
}


