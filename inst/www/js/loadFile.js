/**
 * Created by igorcorrea on 03/12/2015.
 */

function handleFile(files) {
    if(files != undefined){
        console.log(files[0]);
        var fileUrl;
        fileUrl = window.URL.createObjectURL(files[0]);
        sa.destroyCurrent();
        startRadviz(fileUrl);

    }
}

function useFile(data){

    var headers = sa.getAttrAndClassHeaders(data);
    headersAttr = headers[0];
    headersClass = headers[1];
    classNames = sa.getClassNames(headersClass);

    sa.setupBrush(data, svgContainer, vc.acAttr);

    vc.acAttr.initializeAvApInfo(headersAttr, data);
    vc.acClass.initializeAvApInfo(headersClass, data, classNames, vc.colorScheme);

    if(vc.isRadviz){
        vc.acAttr.createPath(sa.delay);
        vc.acClass.createPath(sa.delay);
    }
    else{
        vc.acAttr.createStarCoordLines();
        vc.acClass.createStarCoordLines();
    }
    vc.initializeInstGroup(data);
    vc.acClass.createAvApGroup();
    vc.acAttr.createAvApGroup();

    vc.acAttr.addDoubleClickBehaviour(sa.delay);
    vc.acClass.rotate(-TWO_PI/headersAttr.length, "z", false);

    vc.updateInst(sa.delay);


    allData = data.map(function (d) {
        d.mouseOver = "false";
        return d;
    });

    setupTooltip(headersAttr, headersClass, data);

    addSvgLegend(classNames, svgContainer);
    setupDragBehaviour(vc.acAttr, vc.acClass);

    sliderConfigured = configSlider(sliderConfigured);

    handleKeys();
}
