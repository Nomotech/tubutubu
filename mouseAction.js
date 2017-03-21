function mouseAction(){
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
            circle[i].cage = (d.length < mousePoint.cageRange && mousePoint.cageRange) ? true : false;
        }
    }
    if(oldmouseR&!mouseR){
    	for(i = 0;i<circleNum;i++)	circle[i].cage = false;
    }

   	drawCircle(mousePoint.x,mousePoint.y,5,mousePoint.color);
    if(mouseL){
        ease1 = ease("easeInOutExpo",start_time[0],13);
        mousePoint.force = 0.5;
        mousePoint.forceRange = 200 * ease1;
        mousePoint.color = "rgb( 50, 205, 50)";
        drawFillCircle(mousePoint.x,mousePoint.y,mousePoint.forceRange,"rgb(240, 255, 240)","rgb(250, 255, 250)");
        drawCircle(mousePoint.x,mousePoint.y,mousePoint.forceRange,mousePoint.color);
        drawCircle(mousePoint.x,mousePoint.y,5,mousePoint.color);
    }else if(mouseC){
        ease1 = ease("easeInOutExpo",start_time[0],10);
        mousePoint.force = -2;
        mousePoint.forceRange = 80 * ease1;
        mousePoint.color = "rgb(255, 100, 100)";
        drawFillCircle(mousePoint.x,mousePoint.y,mousePoint.forceRange,"rgb(255, 240, 240)","rgb(255, 180, 180)");
        drawCircle(mousePoint.x,mousePoint.y,mousePoint.forceRange,mousePoint.color);
    }else if(mouseR){
        ease1 = ease("easeOutExpo",start_time[0],10);
        mousePoint.force = -5 * ease1;
        mousePoint.forceRange = mousePoint.cageRange * ease1;
        mousePoint.cageRange = 100;
        mousePoint.color  = "rgb(100, 100, 255)";
        drawFillCircle(mousePoint.x,mousePoint.y,mousePoint.cageRange,"rgb(250, 250, 255)","rgb(230, 230, 255)");
        drawCircle(mousePoint.x,mousePoint.y,mousePoint.cageRange - 10 * (1-ease1),mousePoint.color);
        drawCircle(mousePoint.x,mousePoint.y,mousePoint.cageRange + 10 * (1-ease1),mousePoint.color);
    }else{
        mousePoint.force = 0;
        mousePoint.forceRange = 5;
        mousePoint.cageRange = 0;
        mousePoint.color = "rgb(255, 155, 0)";
        move_flag=0;
    }
}