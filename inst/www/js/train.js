var mySession = [] ;
var sCount = 0;

getAllModelsInfo = function(){

    var req = ocpu.call("getModelsInfo",
       {

       }, function(session)
       {

           session.getObject(function(data){
               console.log(data);
           });

           /*
           console.log(output[0]);
           console.log(output[1]);
           */
       });

       //if R returns an error, alert the error message
       req.fail(function()
       {
           alert("Server error: " + req.responseText);
       });
}

train = function(allData){
    /*
    if(isFileClassified){
        alert("This file aready contains information about classification results.\n" +
        "Use another file.");
        return false;
    }
    */
    var pathToModel;

    if(sCount == 0){
        pathToModel = "noPath";
    }
    else{
        pathToModel = mySession[sCount-1].getFileURL("myModel.rds");
        console.log(pathToModel);
    }
    var req = ocpu.call("mlRpart",
       {
           ds : allData,
           modelPath : pathToModel
       }, function(session)
       {

           mySession.push(session);
           sCount++;
           session.getObject(function(data){
               console.log(data);
               /*
               sa.destroyCurrent();
               vc.createAcApContainers();
               vc.colorScheme = sa.getClassColorScheme();
               useFile(data);
               */
           });
       });

       //if R returns an error, alert the error message
       req.fail(function()
       {
           alert("Server error: " + req.responseText);
       });
}
