// saves the state of Shift key
handleKeys = function(){
    d3.select("body")
        .on("keydown", function () {
            sa.shiftPressed = d3.event.shiftKey;

            switch(d3.event.code){
                case "Minus":
                    d3.event.preventDefault();
                    vc.addToRadius(-sa.zoomPx);
                    vc.drawEverything(sa.delay/2);
                    break;
                case "Equal":
                    d3.event.preventDefault();
                    vc.addToRadius(sa.zoomPx);
                    vc.drawEverything(sa.delay/2);
                    break;

                case "KeyW":
                    d3.event.preventDefault();
                    vc.addToCenter([0,-sa.translatePx,0]);
                    vc.drawEverything(sa.delay/2);
                    break;

                case "KeyS":
                    d3.event.preventDefault();
                    vc.addToCenter([0,sa.translatePx,0]);
                    vc.drawEverything(sa.delay/2);
                    break;

                case "KeyD":
                    d3.event.preventDefault();
                    vc.addToCenter([sa.translatePx,0,0]);
                    vc.drawEverything(sa.delay/2);
                    break;

                case "KeyA":
                    d3.event.preventDefault();
                    vc.addToCenter([-sa.translatePx,0,0]);
                    vc.drawEverything(sa.delay/2);
                    break;

                case "KeyT":
                    d3.event.preventDefault();
                    //console.log(allData);
                    train(allData);

                    break;

                case "KeyP":
                    d3.event.preventDefault();
                    vc.toggleRvSc(sa.delay);
                    break;

                case "KeyC":
                    d3.event.preventDefault();
                    //console.log()
                    var selection = vc.instGroup.selectAll(".selected");
                    if(selection) selection.classed("selected", false);

                    console.log(svgContainer.selectAll(".brush"));
                    break;

                case "ArrowLeft":
                    d3.event.preventDefault();
                    if(sa.shiftPressed){
                        //changeAcClassRadius(-50);
                    }
                    else {
                        rotateBasedOnKey(vc, "y");
                    }

                    break;

                case "ArrowRight":
                    d3.event.preventDefault();
                    if(sa.shiftPressed){
                        //changeAcClassRadius(50);
                    }
                    else {
                        rotateBasedOnKey(vc, "y", -1);
                    }
                    break;
                case "ArrowUp":
                    d3.event.preventDefault();
                    console.log(tCount);
                    console.log(allData[25]);
                    allData[25] = newData[tCount==19?tCount:tCount++];
                    vc.instGroup.selectAll("circle").data(allData);
                    vc.updateInst(sa.delay/2);
                    /*
                    if(sa.shiftPressed){
                        increasePointSize();
                    }
                    else {
                        rotateBasedOnKey(vc, "x");
                    }
                    */
                    break;

                case "ArrowDown":
                    d3.event.preventDefault();
                    console.log(tCount);
                    console.log(allData[25]);
                    allData[25] = newData[tCount==0?tCount:tCount--];
                    vc.instGroup.selectAll("circle").data(allData);
                    vc.updateInst(sa.delay/2);
                    /*
                    if(sa.shiftPressed){
                        decreasePointSize();
                    }
                    else {
                        rotateBasedOnKey(vc, "x", -1);
                    }
                    break;
                    */

                /*
                case "":
                    rotAngle+=5;
                    console.log("rot angle: " + rotAngle);

                case "":
                    rotAngle-=5;
                    console.log("rot angle: " + rotAngle);
                */
            }
        })
        .on("keyup", function () {
            sa.shiftPressed = d3.event.shiftKey;

        });
}

// axis is one letter ("x", "y" or "z")
// multiplyer multiplies the angle before rotation.
// Should be -1 to invert rotation.
rotateBasedOnKey = function(vc, axis, multiplyer = 1){
    if(!vc.isRadviz){
        if(!d3.event.altKey)
            vc.acAttr.rotate(deg2rad(multiplyer * sa.rotAngle), axis);
        if(!d3.event.shiftKey)
            vc.acClass.rotate(deg2rad(multiplyer * sa.rotAngle), axis);
    }
}
