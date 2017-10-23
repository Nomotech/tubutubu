'use strict';
console.debug = function(){/* NOP */};
console.info = function(){/* NOP */};
console.log = function(){/* NOP */};
console.warn = function(){/* NOP */};
//console.error = function(){/* NOP */};

onload = function() {

};

var canvas  = document.getElementById('c1');
var ctx = canvas.getContext('2d');
var margine = 3;
canvas.width = window.innerWidth-margine;
canvas.height = window.innerHeight-margine;



var ease1;
var ease2;
var timer_num = 3;
var start_time = new Array(timer_num);
for(i=0;i<timer_num;i++)start_time[i] = [0];
var move_flag = 0;
var state = 0;


var x = 0;
var y = 0;
var forceMax = 0.5;
var vMax = 15;
var gravity = 0.5;                      //重力
var theta = 2 * Math.PI;
var rangeMax = 20;                      //影響半径
var densityMin = 1;                     //流体の密度
var pressureMax = 2.5;                  //圧力係数
var viscisityMax = 0.12;                //粘性係数



var po = [];
var i,j;
var d;
var ci,cj;
var weight;
var pressureWeight;
var viscosityWeight;
var a,b;

function collision(){
    
    for(i = 0; i < objects.length; i++) objects[i].neighbors = [];
    for(i = 0; i < objects.length; i++) {                   //近くの障害物を検知する
        ci = objects[i];
        ci.fx = 0;
        ci.fy = 0;
        //console.log(area[ci.area].objects.length);
        for(j = 0; j < area[ci.area].objects.length; j++){
            a = area[ci.area].objects[j];
            if(a!=i){
                cj = objects[a];
                rangeMax = ci.effectRange + cj.effectRange;
                d = lengthCircle(ci,cj);
                if(d.length < rangeMax) {
                    ci.neighbors.push(cj);
                    //cj.neighbors[cj.neighborsNum++] = ci;
                }
            }
        }
    }

    
    for(i = 0; i < objects.length; i++) {
        ci = objects[i];
        ci.density = 0;
        for(j = 0; j < ci.neighbors.length; j++) {
            cj = ci.neighbors[j];
            rangeMax = ci.effectRange + cj.effectRange;
            d = lengthCircle(ci,cj);
            ci.density += (1 - d.length / rangeMax) * (1 - d.length / rangeMax);
        }
        if(ci.density < densityMin) ci.density = densityMin;
    }
    for(i = 0; i < objects.length; i++) {
        ci = objects[i];
        for(j = 0; j < ci.neighbors.length; j++) {
            cj = ci.neighbors[j];
            rangeMax = ci.effectRange + cj.effectRange;
            d = lengthCircle(ci,cj);
            weight = 1 - d.length / rangeMax;
            if(ci.type != cj.type) pressureWeight = weight * (ci.density + cj.density - densityMin * 1.8) / (2 * cj.density) * pressureMax;
            else pressureWeight = weight * (ci.density + cj.density - densityMin * 2) / (2 * cj.density) * pressureMax;
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
    var d = lengthCircle(ci,mousePoint);
    if(ci.cage&&mousePoint.cageRange){
        if(d.length > mousePoint.cageRange - 4 && mousePoint.cageRange!=0){
            ci.vx += (d.length - mousePoint.cageRange + 4) * d.x * d.inv;
            ci.vy += (d.length - mousePoint.cageRange + 4) * d.y * d.inv;
        }
    }
    
    if(!ci.cage){
        if(d.length < mousePoint.forceRange + 4){
            ci.fx += mousePoint.force * d.x * d.inv;
            ci.fy += mousePoint.force * d.y * d.inv;
        }
    }
    ci.fx += ci.m * gravity * Math.sin(theta);
    ci.fy += ci.m * gravity * Math.cos(theta);
    ci.vx += ci.fx ;
    ci.vy += ci.fy ;
    if(ci.vx > vMax) ci.vx = vMax;
    if(ci.vy > vMax) ci.vy = vMax;
    ci.v = (Math.sqrt(ci.vx*ci.vx + ci.vy*ci.vy));
    
    if(ci.area != 0){
        if(ci.x < fieldOffset)      ci.vx += fieldOffset - ci.x;
        if(ci.y < fieldOffset)      ci.vy += fieldOffset - ci.y;
        if(ci.x > fieldOffset + fieldWidth) ci.vx += fieldOffset + fieldWidth  - ci.x;
        if(ci.y > fieldOffset + fieldHeight) ci.vy += fieldOffset + fieldHeight - ci.y;
        
    }
    for(let j = 0;j<wall.length;j++){
        d = lengthPointLine(ci,wall[j]);
        if(d.length < ci.effectRange + wall[j].r){
            ci.vx += (ci.effectRange + wall[j].r - d.length) * d.x * d.inv;
            ci.vy += (ci.effectRange + wall[j].r - d.length) * d.y * d.inv;
        }
    }

    ci.x += ci.vx;
    ci.y += ci.vy;
}            
            
function update(){
    //wall[5].theta -= 0.02;      //回転
    wall[5].x1 = wall[5].x0 + Math.cos(wall[5].theta) * wall[5].length / 2;
    wall[5].y1 = wall[5].y0 + Math.sin(wall[5].theta) * wall[5].length / 2;
    wall[5].x2 = wall[5].x0 - Math.cos(wall[5].theta) * wall[5].length / 2;
    wall[5].y2 = wall[5].y0 - Math.sin(wall[5].theta) * wall[5].length / 2; 

    oldmouseL = mouseL;
    oldmouseC = mouseC;
    oldmouseR = mouseR;
    t++;
}

function render() {
    var i;
    ctx.clearRect(0, 0, canvas.width, canvas.height);  //画面のリセット
    areaAllocation();

    //温める
    var ave;
    var d;
    for(i = 0 ; i < objects.length;i++){
        ave = 0;
        var ci = objects[i];
        //heatZone(ci,zone[0]);   //heatzone
        //heatZone(ci,zone[1]);   //coolzone
        thermography(ci);
        for(let j = 0; j < ci.neighbors.length; j++){
            d = ci.neighbors[j].effectRange - ci.effectRange;
            ci.neighbors[j].effectRange -= d * ci.tc;
            ci.effectRange += d * ci.tc;
            ci.neighbors[j].r = ci.neighbors[j].effectRange * 0.3
            ci.r = ci.effectRange * 0.3
        }
    }

    collision();   //あたり判定

    //つぶの移動
    for(i = 0 ; i < objects.length;i++)  move(objects[i]);

    //マウス
    mousePoint.x = mouseX;
    mousePoint.y = mouseY;
    mouseAction();
    
    drawField();    //フィールドの描画
    for(i = 0 ; i < objects.length;i++){
        drawCircle(objects[i].x,objects[i].y,objects[i].r,objects[i].color);
    }

    drawZone();
    
    update();
    window.requestAnimationFrame(render);
}render();