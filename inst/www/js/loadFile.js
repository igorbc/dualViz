/**
 * Created by igorcorrea on 03/12/2015.
 */

function handleModel(files) {
    if(files === "undefined"){
        return false;
    }
    else {
        document.getElementById("chosenModel").innerHTML = files[0].name + " (from disk)";
        document.getElementById("chosenModelLabel").innerHTML = files[0].name + " (from disk)";;
        //document.getElementById("saveModel").classList.add("disabled");
        document.getElementById("modelSelector").selectedIndex = 0;
        document.getElementById("useModelButton").classList.remove("disabled");
        curChosenModel = files[0];
    }
}


function handleFile(files) {
    if(typeof files === "undefined"){
        return false;
    }
    else {
        console.log(files[0]);

        curDataFileName = window.URL.createObjectURL(files[0]);
        sa.destroyCurrent();
        startRadviz(curDataFileName);
    }
}


function useFile(data){
    var ds = data.map(function (d) {
            d.selected = 0;
            return d;
        });
    dm.setData(ds);
    dm.updateDataOptions();

    sa.setupBrush(dm.data, svgContainer, vc.acAttr);

    vc.acAttr.initializeAvApInfo(dm.attrHeader, dm.data);
    vc.acClass.initializeAvApInfo(dm.probHeader, dm.data, dm.classNames, vc.colorScheme);

    if(vc.isRadviz){
        vc.acAttr.createPath(sa.delay);
        vc.acClass.createPath(sa.delay);
    }
    else{
        vc.acAttr.createStarCoordLines();
        vc.acClass.createStarCoordLines();
    }
    vc.initializeInstGroup(dm.data);
    vc.acClass.createAvApGroup();
    vc.acAttr.createAvApGroup();

    vc.acAttr.addDoubleClickBehaviour(sa.delay);
    vc.acClass.rotate(-TWO_PI/dm.attrHeader.length, "z", false);

    vc.updateInst(sa.delay);

    //parcoords = createParCoords(dm.data, dm.attrHeader);
    //parcoords.colorAll = true;

    console.log("dm.attrHeader, dm.data");
    console.log(dm.data[0]);
    console.log(dm.attrHeader);
    setupTooltip(dm.attrHeader, dm.probHeader, dm.data);

    addSvgLegend(dm.classNames, svgContainer);
    setupDragBehaviour(vc.acAttr, vc.acClass);

    sliderConfigured = configSlider(sliderConfigured);

    handleKeys();
    addDimensionFields();
}
