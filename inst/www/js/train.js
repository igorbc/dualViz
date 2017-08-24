var mySession = [] ;
var sCount = 0;
var mFile;
var pathToModel = "";
var methodsInfo;
var modelFile = null;

// global variable used to save the session object
var previousSession = null;

var myReq;

train = function(allData, m){
    /*
    if(isFileClassified){
        alert("This file aready contains information about classification results.\n" +
        "Use another file.");
        return false;
    }
    */

    var selector = document.getElementById("modelSelector");
    if(selector.selectedIndex == 0 && pathToModel == ""){
        alert("Choose a method or load a model first.");
        return false;
    }

    var method = selector.options[selector.selectedIndex].value;
    console.log(selector.options[selector.selectedIndex].value);

    document.getElementById("trainButton").classList.add("disabled");
    document.getElementById("loadingIcon").setAttribute("visible", true);

    var req = ocpu.call("ml",
       {
           ds : allData,
           mlMethod: method,
           modelPath: m
       }, function(session)
       {
           mySession.push(session);
           sCount++;

           pathToModel = mySession[sCount-1].output[7];

           document.getElementById("saveModel").href = session.getFileURL("m1.rds");
           document.getElementById("saveModel").classList.remove("disabled");
           session.getObject(function(data){
               console.log(data);
               //*
               sa.destroyCurrent();
               vc.createAcApContainers();
               vc.colorScheme = sa.getClassColorScheme();
               useFile(data);
               //*/
           });
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

getAllModelsInfo = function(){
    document.getElementById("loadingIcon").setAttribute("visible", true);
    var req = ocpu.call("getModelsInfo",
       {

       }, function(session)
       {
           session.getObject(function(data){
               //console.log(data);
               var selector = document.getElementById("modelSelector");
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

/*
useOcpu = function(){
    var path = "";
    if(previousSession != null)
        path = previousSession.getFileURL("m1.rds");

    console.log("path is: " + path);
    var req = ocpu.call("saveOrLoadModel",
       {
           modelPath : path
       }, function(session) {
           previousSession = session;

           session.getObject(function(data){
               console.log(data);
           });
       });

       //if R returns an error, alert the error message
       req.fail(function() {
           alert("Server error: " + req.responseText);
       });
}
*/
useModel = function(){
    console.log("useModel");
    $("#useResult").text("useModel called");
}
