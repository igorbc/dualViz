changeAcClassRadius = function(amount){
    vc.acClass.r += amount;
    vc.acClass.updatePath(sa.delay);
    vc.acClass.alignAvApsWithRadviz();
    vc.acClass.updateAvApPositionOnScreen(sa.delay);
    vc.updateInst(sa.delay);
}

setAcClassRadius = function(value){
    vc.acClass.r = value;
    vc.acClass.updatePath(sa.delay);
    vc.acClass.alignAvApsWithRadviz();
    vc.acClass.updateAvApPositionOnScreen(sa.delay);
    vc.updateInst(sa.delay);
}

toggleAcClassRadius = function(separate){
    if(separate){
        setAcClassRadius(vc.acAttr.r + 50);
    }
    else {
        setAcClassRadius(vc.acAttr.r);
    }
}

toggleDynamicOpacity = function(dynamic) {
    vc.dynamicOpacity = !vc.dynamicOpacity;
    vc.acAttr.updateAvApPositionOnScreen(sa.delay);
    vc.acClass.updateAvApPositionOnScreen(sa.delay);
}

increasePointSize = function(){
    vc.dataPointRadius += .5;
    vc.updateInst(sa.delay/2);
}

decreasePointSize = function(){
    if(vc.dataPointRadius - .5 > 0){
        vc.dataPointRadius -= .5;
        vc.updateInst(sa.delay/2);
    }
}

increasePointOpacity = function(){
    vc.dataPointOpacity = Math.min(vc.dataPointOpacity + .1, 1);
    vc.updateInst();
}

decreasePointOpacity = function(){
    vc.dataPointOpacity = Math.max(vc.dataPointOpacity - .1, .1);
    vc.updateInst();
}
