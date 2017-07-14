// saves the state of Shift key
handleKeys = function(){
    d3.select("body")
        .on("keydown", function () {
            sa.shiftPressed = d3.event.shiftKey;
            d3.event.preventDefault();

            switch(d3.event.code){
                case "KeyT":
                    //console.log(allData);
                    var req = ocpu.rpc("mlRpart",
                       {
                           ds : allData
                       }, function(output)
                       {
                           console.log(output);
                           sa.destroyCurrent();
                           vc.createAcApContainers();
                           vc.colorScheme = sa.getClassColorScheme();
                           useFile(output);
                       });

                       //if R returns an error, alert the error message
                       req.fail(function()
                       {
                           alert("Server error: " + req.responseText);
                       });

                    break;

                case "KeyP":
                    vc.toggleRvSc(sa.delay);
                    break;

                case "KeyC":
                    vc.acAttr.instGroup.selectAll(".selected").classed("selected", false);
                    console.log("c");
                    break;

                case "ArrowLeft":
                    if(sa.shiftPressed){
                        vc.acClass.r -= 50;
                        vc.acClass.updatePath(sa.delay);
                        vc.acClass.alignAvApsWithRadviz();
                        vc.acClass.updateAvApPositionOnScreen(sa.delay);
                        vc.updateInst(sa.delay);
                    }
                    else {
                        rotateBasedOnKey(vc, "y");
                    }

                    break;

                case "ArrowRight":
                    if(sa.shiftPressed){
                        vc.acClass.r += 50;
                        vc.acClass.updatePath(sa.delay);
                        vc.acClass.alignAvApsWithRadviz();
                        vc.acClass.updateAvApPositionOnScreen(sa.delay);
                        vc.updateInst(sa.delay);
                    }
                    else {
                        rotateBasedOnKey(vc, "y", -1);
                    }
                    break;
                case "ArrowUp":
                    if(sa.shiftPressed){
                        vc.dataPointRadius += .5;
                        vc.updateInst(sa.delay);
                    }
                    else
                        rotateBasedOnKey(vc, "x");
                    /*
                    else{
                        vc.acAttr.r+=2;
                        vc.acAttr.updatePath();
                        vc.acAttr.alignAvApsWithRadviz();
                        vc.acAttr.updateAvApPositionOnScreen();
                        vc.updateInst();
                    }
                    */
                    break;

                case "ArrowDown":
                    if(sa.shiftPressed){
                        vc.dataPointRadius -= .5;
                        vc.updateInst(sa.delay);
                    }
                    else
                        rotateBasedOnKey(vc, "x", -1);
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
