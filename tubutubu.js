onload = function() {

};

var canvas  = document.getElementById('c1');
var ctx = canvas.getContext('2d');
var margine = 3;
canvas.width = window.innerWidth-margine;
canvas.height = window.innerHeight-margine;

function drawLine(x1,y1,x2,y2,color){
    ctx.strokeStyle = color; 
    ctx.beginPath();    // 1.Pathで描画を開始する
    ctx.moveTo(x1,y1);  // 2.描画する位置を指定する
    ctx.lineTo(x2,y2);  // 3.指定座標まで線を引く
    ctx.stroke();       // 4.Canvas上に描画する
}

function drawBox(x,y,w,h) {
    ctx.beginPath();
    ctx.strokeRect(x-w/2, y-h/2, w, h);
}

function drawCircle(x,y,r,color,fill) {
    ctx.strokeStyle = color; 
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.arc(x, y, r, 0, Math.PI*2, false);
    ctx.fillStyle = color;
    if(fill)ctx.fill();
    ctx.stroke();
}


var ease1;
var ease2;
var timer_num = 3;
var start_time = new Array(timer_num);
for(i=0;i<timer_num;i++)start_time[i] = [0];
var move_flag = 0;
var state = 0;


var x = 0;
var y = 0;
var row = 20;
var forceMax = 0.5;
var vMax = 20;
var gravity = 0.3;                     //重力
var theta = 2 * Math.PI;
var rangeMax = 30;                      //影響半径
var squareRange = rangeMax * rangeMax;        //影響半径の二乗
var densityMin = 4;                     //流体の密度
var pressureMax = 0.2;                    //圧力係数
var viscisityMax = 0.05;               //粘性係数


var circleNum = 1000;
var circle = new Array(circleNum);
for(var i = 0;i<circleNum;i++){
    circle[i] = {};

    circle[i].r = 4;
    circle[i].vx = 0;
    circle[i].vy = 0;
    circle[i].v = 0;
    circle[i].x = i%row * 2 * circle[i].r + 200 + 0.01 * i;
    circle[i].y = Math.ceil((i + 1)/row) * 10 + 100;  
    circle[i].fx = 0;
    circle[i].fy = 0;
    circle[i].m = 0.5;
    circle[i].neighborsNum = 0;
    circle[i].neighbors = new Array();
    circle[i].density = 0;
    circle[i].pressure = 0;
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

var walllen = 600;
function drawField(){
    wall[0].x1 = 100;       wall[0].y1 = 100;       wall[0].x2 = 100;       wall[0].y2 = walllen;      wall[0].length = lengthTwoPoint(wall[0].x1,wall[0].y1,wall[0].x2,wall[0].y2); wall[0].vx = -1; wall[0].vy = 0;
    wall[1].x1 = 100;       wall[1].y1 = walllen;   wall[1].x2 = walllen;   wall[1].y2 = walllen;      wall[1].length = lengthTwoPoint(wall[1].x1,wall[1].y1,wall[1].x2,wall[1].y2); wall[1].vx = 0; wall[1].vy = 1;
    wall[2].x1 = walllen;   wall[2].y1 = walllen;   wall[2].x2 = walllen;   wall[2].y2 = 100;          wall[2].length = lengthTwoPoint(wall[2].x1,wall[2].y1,wall[2].x2,wall[2].y2); wall[2].vx = 1; wall[2].vy = 0;
    wall[3].x1 = walllen;   wall[3].y1 = 100;       wall[3].x2 = 100;       wall[3].y2 = 100;          wall[3].length = lengthTwoPoint(wall[3].x1,wall[3].y1,wall[3].x2,wall[3].y2); wall[3].vx = 0; wall[3].vy = -1;
    for(var i = 0;i<wallNum;i++) drawLine(wall[i].x1,wall[i].y1,wall[i].x2,wall[i].y2,"rgb(0, 0, 0)");
}

function collision(){
    var i,j;
    var d;
    var ci,cj;
    var weight;
    var pressureWeight;
    var viscosityWeight;
    var a,b;

    for(i = 0; i < circleNum; i++) {
        ci = circle[i];
        ci.density = 0;
        for(j = 0; j < ci.neighborsNum; j++) {
            cj = ci.neighbors[j];
            d = lengthCircle(ci,cj);
            ci.density += (1 - d.length / rangeMax) * (1 - d.length / rangeMax);
        }
        if(ci.density < densityMin) ci.density = densityMin;
        ci.pressure = ci.density - densityMin;
    }
    for(i = 0; i < circleNum; i++) {
        ci = circle[i];
        for(j = 0; j < ci.neighborsNum; j++) {
            cj = ci.neighbors[j];
            d = lengthCircle(ci,cj);
            weight = 1 - d.length / rangeMax;
            pressureWeight = weight * (ci.pressure + cj.pressure) / (2 * cj.density) * pressureMax;
            ci.fx -= pressureWeight * d.x * d.inv;
            ci.fy -= pressureWeight * d.y * d.inv;
            //if(i==2)console.log("po " + (ci.pressure + cj.pressure));
            viscosityWeight = weight / cj.density * viscisityMax;
            a = cj.vx - ci.vx;
            b = cj.vy - ci.vy;
            ci.fx += a * viscosityWeight;
            ci.fy += b * viscosityWeight;
        }
       
        
         
    }
}

function move(ci){
    
    d = lengthCircle(ci,mousePoint);
    switch(ci.area){
        case 1:
            if(ci.x < 100)      ci.vx += 100 - ci.x;
            if(ci.y < 100)      ci.vy += 100 - ci.y;
            if(ci.x > walllen)  ci.vx += walllen - ci.x;
            if(ci.y > walllen)  ci.vy += walllen - ci.y;
            if(d.length < mousePoint.forceRange + 4){
                ci.fx += mousePoint.force * d.x * d.inv;
                ci.fy += mousePoint.force * d.y * d.inv;
            }
            break;   
        case 2:
            if(ci.x < 100)      ci.vx += 100 - ci.x;
            if(ci.y < 100)      ci.vy += 100 - ci.y;
            if(ci.x > walllen)  ci.vx += walllen - ci.x;
            if(ci.y > walllen)  ci.vy += walllen - ci.y;
            if(d.length > mousePoint.cageRange - 4 && mousePoint.cageRange!=0){
                ci.vx += (d.length - mousePoint.cageRange + 4) * d.x * d.inv;
                ci.vy += (d.length - mousePoint.cageRange + 4) * d.y * d.inv;
            }
            break;
        default:break;
    }
    ci.fx += gravity * Math.sin(theta);
    ci.fy += gravity * Math.cos(theta);
    ci.vx += ci.fx;
    ci.vy += ci.fy;
    if(ci.vx > vMax) ci.vx = vMax;
    if(ci.vy > vMax) ci.vy = vMax;
    ci.v = (Math.sqrt(ci.vx*ci.vx + ci.vy*ci.vy));
    ci.x += ci.vx;
    ci.y += ci.vy;
}            
            
function update(){
    oldmouseL = mouseL;
    oldmouseC = mouseC;
    oldmouseR = mouseR;
    t++;
}

function render() {
    var i;
    ctx.clearRect(0, 0, canvas.width, canvas.height);  //画面のリセット
    for(i = 0; i < circleNum; i++) {                   //近くの障害物を検知する
        ci = circle[i];
        ci.neighborsNum = 0;
        ci.fx = 0;
        ci.fy = 0;
        for(j = 0; j < i; j++) {
            cj = circle[j];
            var d = lengthCircle(ci,cj);
            if(d.length < rangeMax) {
                ci.neighbors[ci.neighborsNum++] = cj;
                cj.neighbors[cj.neighborsNum++] = ci;
            }
        }
    }

    collision();   //あたり判定
    //console.log("fy: " + circle[2].fy);
    //if(circle[2].fy!=0)console.log(circle[2].neighborsNum);

    for(i = 0 ; i < circleNum;i++){
        move(circle[i]);
    }


    

    mousePoint.x = mouseX;
    mousePoint.y = mouseY;
    
    if(!oldmouseL&mouseL && move_flag == 0){
        start_time[0][0] = t;
        move_flag = 1;
    }
    if(!oldmouseC&mouseC && move_flag == 0){
        start_time[0][0] = t;
        move_flag = 1;
    }
    if(!oldmouseR&mouseR && move_flag == 0){
        mousePoint.cageRange = 100;
        start_time[0][0] = t;
        move_flag = 1;
        for(i = 0;i<circleNum;i++){
            d = lengthCircle(circle[i],mousePoint);
            if(d.length < mousePoint.cageRange && mousePoint.cageRange){
                console.log("po");
                circle[i].area = 2;
            }
            else circle[i].area = 1;
        }
    }
   
    if(mouseL){
        ease1 = ease("easeInOutExpo",start_time[0],15);
        mousePoint.force = 0.5;
        mousePoint.forceRange = 200 * ease1;
        mousePoint.color = "rgb( 50, 205, 50)";
        mousePoint.color2 = "rgb(250, 255, 250)";
        drawCircle(mousePoint.x,mousePoint.y,mousePoint.forceRange,mousePoint.color2,true);
        drawCircle(mousePoint.x,mousePoint.y,mousePoint.forceRange,mousePoint.color,false);
    }else if(mouseC){
        ease1 = ease("easeInOutExpo",start_time[0],10);
        mousePoint.force = -2;
        mousePoint.forceRange = 50 * ease1;
        mousePoint.color = "rgb(255, 100, 100)";
        mousePoint.color2 = "rgb(255, 240, 240)";
        drawCircle(mousePoint.x,mousePoint.y,mousePoint.forceRange,mousePoint.color2,true);
        drawCircle(mousePoint.x,mousePoint.y,mousePoint.forceRange,mousePoint.color,false);
    }else if(mouseR){
        ease1 = ease("easeOutExpo",start_time[0],10);
        mousePoint.force = -5 * ease1;
        mousePoint.forceRange = mousePoint.cageRange * ease1;
        mousePoint.cageRange = 100;
        mousePoint.color  = "rgb(100, 100, 255)";
        mousePoint.color2 = "rgb(250, 250, 255)";
        drawCircle(mousePoint.x,mousePoint.y,mousePoint.cageRange,mousePoint.color2,true);
        drawCircle(mousePoint.x,mousePoint.y,mousePoint.cageRange - 10 * (1-ease1),mousePoint.color,false);
        drawCircle(mousePoint.x,mousePoint.y,mousePoint.cageRange + 10 * (1-ease1),mousePoint.color,false);
    }else{
        mousePoint.force = 0;
        mousePoint.forceRange = 5;
        mousePoint.cageRange = 0;
        mousePoint.color = "rgb(255, 155, 0)";
        move_flag=0;
        for(i = 0;i<circleNum;i++){
            circle[i].area = 1;
        }
    }
    drawCircle(mousePoint.x,mousePoint.y,5,mousePoint.color,false);
    
    drawField();
    for(i = 0 ; i < circleNum;i++) drawCircle(circle[i].x,circle[i].y,circle[i].r-1,"rgb(0, 205, 205)");
    
    update();
    requestAnimationFrame(render);
}render();