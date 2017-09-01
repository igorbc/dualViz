
useModel = function(data){
    if(!chosenModel){
        alert("Load an .rds model from disk or select from the available");
        return false;
    }
    else{
        document.getElementById("useModelButton").classList.add("disabled");
        document.getElementById("loadingIcon").setAttribute("visible", true);

        var req = ocpu.call("useModel",
            {
                ds: data,
                modelPath: curChosenModel,
            }, function(session)
            {
                classificationSessions.add(session);

                session.getObject(function(data){
                    console.log(data);

                    //sa.destroyCurrent();
                    //vc.createAcApContainers();
                    //vc.colorScheme = sa.getClassColorScheme();
                    //useFile(data);
                    dm.vData = data;
                });
           });

           //if R returns an error, alert the error message
           req.fail(function()
           {
               alert("Server error: " + req.responseText);
           });

           req.always(function()
           {
               document.getElementById("useModelButton").classList.remove("disabled");
               document.getElementById("loadingIcon").setAttribute("visible", false);
           });
    }
}

train = function(data){
    /*
    if(isFileClassified){
        alert("This file aready contains information about classification results.\n" +
        "Use another file.");
        return false;
    }
    */

    var selector = document.getElementById("methodSelector");
    if(selector.selectedIndex == 0){
        alert("Choose a method first.");
        return false;
    }

    var method = selector.options[selector.selectedIndex].value;
    console.log("method: " + method);

    document.getElementById("trainButton").classList.add("disabled");
    document.getElementById("loadingIcon").setAttribute("visible", true);
    var splitRatio = document.getElementById("trainTestSplit").value / 100;

    var req = ocpu.call("ml",
       {
           ds: data,
           mlMethod: method,
           modelPath: "",
           splitRatio: splitRatio
       }, function(session)
       {
           trainSessions.add(session, method, curDataFileName);

           session.getObject(function(data){
               console.log(data);

               sa.destroyCurrent();
               vc.createAcApContainers();
               vc.colorScheme = sa.getClassColorScheme();
               useFile(data);
           });

           addModelToOptions();
       });

       //if R returns an error, alert the error message
       req.fail(function()
       {
           alert("Server error: " + req.responseText);
       });

       req.always(function()
       {
           document.getElementById("trainButton").classList.remove("disabled");
           document.getElementById("loadingIcon").setAttribute("visible", false);
       });
}

methodSelected = function(event){
    //alert(this.selectedIndex + " " + this.options[this.selectedIndex].text);
}

modelSelected = function(event){
    document.getElementById("chosenModel").innerHTML = this.options[this.selectedIndex].text;
    curChosenModel = trainSessions.getFullFilePath(this.value);
    document.getElementById("saveModel").href = trainSessions.getLastDownloadPath();
    document.getElementById("saveModel").classList.remove("disabled");
    document.getElementById("useModelButton").classList.remove("disabled");
    console.log(curChosenModel);
}

getAllModelsInfo = function(){
    document.getElementById("loadingIcon").setAttribute("visible", true);
    var req = ocpu.call("getModelsInfo",
       {
       }, function(session)
       {
           session.getObject(function(data){
               //console.log(data);
               var selector = document.getElementById("methodSelector");
               var methods = data[0];
               var attrInfo = data[1];
               for (i=0; i<methods.length; i++){
                   var o = document.createElement("option");
                   o.value = methods[i].name;
                   o.innerHTML = methods[i].label + " (" + methods[i].name + ")";
                   selector.appendChild(o);
               }
               selector.value = "rpart"
           });
       });

       //if R returns an error, alert the error message
       req.fail(function()
       {
           console.log("Server error: " + req.responseText);
           //alert("Server error: " + req.responseText);

       });
       req.always(function(){
           document.getElementById("loadingIcon").setAttribute("visible", false);
       });
   return(null);
}

addModelToOptions = function(){
    var selector = document.getElementById("modelSelector");
    var o = document.createElement("option");
    o.value = trainSessions.count - 1;
    o.innerHTML = trainSessions.getLastModelStr();
    selector.appendChild(o);

}
