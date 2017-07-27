// saves the state of Shift key
handleKeys = function(){
    d3.select("body")
        .on("keydown", function () {
            sa.shiftPressed = d3.event.shiftKey;
            d3.event.preventDefault();

            switch(d3.event.code){
                case "Minus":
                    vc.addToRadius(-sa.zoomPx);
                    vc.drawEverything(sa.delay/2);
                    break;
                case "Equal":
                    vc.addToRadius(sa.zoomPx);
                    vc.drawEverything(sa.delay/2);
                    break;

                case "KeyW":
                    vc.addToCenter([0,-sa.translatePx,0]);
                    vc.drawEverything(sa.delay/2);
                    break;

                case "KeyS":
                    vc.addToCenter([0,sa.translatePx,0]);
                    vc.drawEverything(sa.delay/2);
                    break;

                case "KeyD":
                    vc.addToCenter([sa.translatePx,0,0]);
                    vc.drawEverything(sa.delay/2);
                    break;

                case "KeyA":
                    vc.addToCenter([-sa.translatePx,0,0]);
                    vc.drawEverything(sa.delay/2);
                    break;

                case "KeyT":
                    //console.log(allData);
                    train(allData);

                    break;

                case "KeyP":
                    vc.toggleRvSc(sa.delay);
                    break;

                case "KeyC":
                    //console.log()
                    var selection = vc.instGroup.selectAll(".selected");
                    if(selection) selection.classed("selected", false);

                    console.log(svgContainer.selectAll(".brush"));
                    break;

                case "ArrowLeft":
                    if(sa.shiftPressed){
                        //changeAcClassRadius(-50);
                    }
                    else {
                        rotateBasedOnKey(vc, "y");
                    }

                    break;

                case "ArrowRight":
                    if(sa.shiftPressed){
                        //changeAcClassRadius(50);
                    }
                    else {
                        rotateBasedOnKey(vc, "y", -1);
                    }
                    break;
                case "ArrowUp":
                    if(sa.shiftPressed){
                        increasePointSize();
                    }
                    else {
                        rotateBasedOnKey(vc, "x");
                    }
                    break;

                case "ArrowDown":
                    if(sa.shiftPressed){
                        decreasePointSize();
                    }
                    else {
                        rotateBasedOnKey(vc, "x", -1);
                    }
                    break;

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
