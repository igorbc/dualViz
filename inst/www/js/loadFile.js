/**
 * Created by igorcorrea on 03/12/2015.
 */

 function processModelInfo(mInfo){
   var stats = mInfo[0][0];

   document.getElementById("modelName").textContent =
    "Name: " + stats.label + " (" + stats.library + ")";
   document.getElementById("modelTraningData").textContent =
     stats.dataLength + " instances - " +
     mInfo[2].length + " classes - " +
   stats.attributeLength + " attributes";
   document.getElementById("modelAcc").textContent =
    "Accuracy: " + Math.round(stats.accuracy*10000)/100 + "%";
   document.getElementById("modelKappa").textContent =
    "Kappa: " + Math.round(stats.kappa*100)/100;

   mcmOld = mInfo[1];
   createConfusionMatrix(mcmOld);
 }

function updateStats(data, classNames){
  document.getElementById("modelName").textContent = "";

  mcm = getConfusionMatrixData(data, classNames);
  var mcm2dArray = get2dArray(mcm);
  var confusionData = getConfusionIndicators(mcm2dArray);
  var accuracy = getAccuracy(confusionData.ttp, confusionData.total);
  var kappa = getKappa(
    confusionData.ttp,
    confusionData.total,
    confusionData.rowTotal,
    confusionData.columnTotal
  );

  document.getElementById("modelTraningData").textContent =
    dm.classifiedData.length + " instances - " +
    dm.classNames.length + " classes - " +
    dm.attrHeader.length + " attributes";
  // document.getElementById("modelTraningData").textContent =
  // stats.dataLength + " instances - " +
  // traningDataLength + " classes - " +
  // stats.attributeLength + " attributes";
  var accuracyText = "Accuracy: " + Math.round(accuracy*10000)/100 + "%";
  var kappaText = "Kappa: " + Math.round(kappa*100)/100;
  document.getElementById("modelAcc").textContent = accuracyText;
  document.getElementById("modelKappa").textContent = kappaText;

  console.log(accuracyText + ' ' + kappaText);
  createConfusionMatrix(mcm);
  // console.log();
}



  function getAccuracy(totalTruePositives, total) {
    return totalTruePositives / total;
  }

  function getKappa(ttp, total, rowTotal, columnTotal) {
    var probSum = 0;

    for(var i = 0; i < rowTotal.length; i++){
      probSum += (rowTotal[i] * columnTotal[i])/total;
    }

    return (ttp - probSum) / (total - probSum);
  }

  function getConfusionIndicators(mcm2dArray) {
    var r = {
      ttp: 0,
      total: 0,
      rowTotal: [],
      columnTotal: []
    }

    for(var i = 0; i < mcm2dArray.length; i++){
      r.rowTotal.push(0);
      r.columnTotal.push(0);
      for(var j = 0; j < mcm2dArray[i].length; j++){
        if(i == j) r.ttp += mcm2dArray[j][j];
        r.total += mcm2dArray[i][j];
        r.rowTotal[i] += mcm2dArray[i][j];
        r.columnTotal[i] += mcm2dArray[j][i];
      }
    }
    return r;
  }

  function get2dArray(mcm){
    var cmKeys = Object.keys(mcm[0]);
    cmKeys.pop();
    mcm2dArray = [];
    mcm.forEach(function(d1, i){
      mcm2dArray.push([]);
      cmKeys.forEach(function(d2, j){
        mcm2dArray[i].push(d1[d2]);
      });
    });
    return mcm2dArray;
  }

function handleModel(files) {
    if(files === "undefined"){
        return false;
    }
    else {
        document.getElementById("chosenModel").innerHTML = files[0].name + " (from disk)";
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
    hist.createAllHistograms(dm.data, dm.attrHeader);

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

    setupTooltip(dm.attrHeader, dm.probHeader, dm.data);

    addSvgLegend(dm.classNames, svgContainer);
    setupDragBehaviour(vc.acAttr, vc.acClass);

    sliderConfigured = configSlider(sliderConfigured);

    handleKeys();
    addDimensionFields();
    addVaryAttrFields();
    windowResized();
    dm.setupSlider();
    hist.update();
}

function runExperiment(modelIndex){
  document.getElementById('methodSelector').value = allowedModels[mIndex];
  train(dm.fullData)
}

trainTester = function(data, methodIndex){
  var method = allowedModels[methodIndex];

  var splitRatio = 80 / 100;
  document.getElementById("loadingIcon").setAttribute("visible", true);
  var req = ocpu.call(
    "ml",
    {
      ds: data,
      mlMethod: method,
      modelPath: "",
      splitRatio: splitRatio
    },
    function(session){
      console.log("%c>>>>>  " + method + "; ok", 'color: green');
      session.getObject(function(data) {
        obj = getExperimentData(data);
        var s = getStatsString(obj.data, obj.classNames);
        console.log('%c' + method, 'color: blue');
        console.log('%c' + s, 'color: blue');
      });
    }
  );
  req.fail(
    function() {
      console.log("%c>>>>>  " + method + "; " + req.responseText, 'color: brown');
    }
  );
  req.always(function(){
    document.getElementById("loadingIcon").setAttribute("visible", false);
  });
  return method;
}

function getExperimentData(data){
  var ds = data.map(function (d) {
          d.selected = 0;
          return d;
      });
  var classNames = d3.map(data, function(d){return d.class;}).keys();
  return {
    data: ds,
    classNames: classNames
  }
}

function getStatsString(data, classNames){
  var mcm = getConfusionMatrixData(data, classNames);
  var mcm2dArray = get2dArray(mcm);
  var confusionData = getConfusionIndicators(mcm2dArray);
  var accuracy = getAccuracy(confusionData.ttp, confusionData.total);
  var kappa = getKappa(
    confusionData.ttp,
    confusionData.total,
    confusionData.rowTotal,
    confusionData.columnTotal
  );
  var accuracyText = Math.round(accuracy*10000)/10000;
  var kappaText = Math.round(kappa*100)/100;

  return accuracyText + ',' + kappaText;
}
