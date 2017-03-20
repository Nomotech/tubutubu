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

function drawCircle(x,y,r,color) {
    ctx.strokeStyle = color; 
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.arc(x, y, r, 0, Math.PI*2, false);
    ctx.stroke();
}

var x = 0;
var y = 0;
var row = 25;
var forceMax = 0.5;
var vMax = 20;
var gravity = 0.3;                     //重力
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
}
circle[0].x = 50;
circle[0].y = 50;
circle[0].r = 10;


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
        // for(j = 0;j<wallNum;j++){
        //     d = lengthWall(ci,wall[j]);
        //     var force = 0;
        //     if(d.length>0){
        //         force = d.inv - 1/(ci.r*2 + ci.v*2);
        //         if(force>forceMax) force = forceMax;
            
        //         ci.fy -= force * wall[j].vy;
        //         ci.fx -= force * wall[j].vx;
        //         var minR = ci.r + ci.v*2;
        //         if(d.length<minR){
        //             ci.x -= (minR - d.length) * wall[j].vx;
        //             ci.y -= (minR - d.length) * wall[j].vy;
        //         }
        //     }
        //     //circle[num].fx += force * d.x / d.length;   
        // }
    }
}

function move(ci){
    ci.fy += gravity;
    ci.vx += ci.fx;
    ci.vy += ci.fy;
    if(ci.vx > vMax) ci.vx = vMax;
    if(ci.vy > vMax) ci.vy = vMax;
    ci.v = (Math.sqrt(ci.vx*ci.vx + ci.vy*ci.vy));
    ci.x += ci.vx;
    ci.y += ci.vy;
    if(ci.x < 100)      ci.vx += 100 - ci.x;
    if(ci.y < 100)      ci.vy += 100 - ci.y;
    if(ci.x > walllen)  ci.vx += walllen - ci.x;
    if(ci.y > walllen)  ci.vy += walllen - ci.y;
    //ci.vx *= 0.999;
    //ci.vy *= 0.999;
}            
            

function render() {
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

    drawField();
    for(var i = 0 ; i < circleNum;i++){
        move(circle[i]);
    }

    circle[0].x = mouseX;
    circle[0].y = mouseY;
    if(mouseL){
        if(circle[0].r<80)circle[0].r *= 1.3;
    }else circle[0].r = 5;
        
    drawCircle(circle[0].x,circle[0].y,3,"rgb(255, 155, 0)");
    for(var i = 1 ; i < circleNum;i++) drawCircle(circle[i].x,circle[i].y,circle[i].r-1,"rgb(0, 205, 205)");
    requestAnimationFrame(render);
}render();