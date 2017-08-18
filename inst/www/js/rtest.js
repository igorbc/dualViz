var fileUrl = "";
var theFile = null;
var previousSession = null;

loadTestFile = function(files){
    console.log(files);
    if(files.length == 0){
        console.log("arquivo não escolhido");
    }
    else {
        theFile = files[0];
        console.log(theFile);
    }
}

useOcpu = function(paths){
    if (fileUrl == null){
        alert("Choose file first.");
        return false;
    }

    paths = [];
    justPaths = [];

    if(previousSession != null){
        paths.push(previousSession.getFileURL("m1.rds"));
        paths.push(previousSession.output[7]);
        paths.push("/Users/igorcorrea/Desktop/m1.rds");
        paths.push("/m1.rds");
        paths.push("m1.rds");
        paths.push(previousSession.getLoc() + "m1.rds");
        paths.push(previousSession.getLoc() + previousSession.key + "m1.rds");
        paths.push(previousSession.getLoc() + "../" + previousSession.key + "/m1.rds");
        paths.push("../" + previousSession.key + "/m1.rds");
        paths.push("/../" + previousSession.key + "/m1.rds");
        paths.push("/" + previousSession.key + "/m1.rds");
        paths.push(previousSession.key + "/m1.rds");
        paths.push("../../../ocpu-store/" + previousSession.key + "/m1.rds");

        justPaths.push(previousSession.key);
        justPaths.push("/ocpu/tmp/" + previousSession.key);
        justPaths.push("/");
        justPaths.push("/../");
        justPaths.push("../");
        justPaths.push(previousSession.getLoc());
        justPaths.push(previousSession.getLoc() + previousSession.key);
        justPaths.push(previousSession.getLoc() + "../" + previousSession.key);
        justPaths.push("../" + previousSession.key );
        justPaths.push("/../" + previousSession.key);
        justPaths.push("/" + previousSession.key);
        justPaths.push("../..");
        justPaths.push("../../..");
        justPaths.push("../../../ocpu-store");
        justPaths.push("../../../ocpu-temp");
        justPaths.push("../../../ocpu-store/" + previousSession.key);
        justPaths.push("../../../ocpu-temp/" + previousSession.key);

        console.log("just paths are: ");
        console.log(justPaths);
    }

    var req = ocpu.call("saveOrLoadModel",
       {
           theFile : theFile,
           modelPath : paths,
           justPaths : justPaths
       }, function(session) {
           previousSession = session;

           console.log(session);
           session.getObject(function(data){
               console.log(data);
           });

       });

       req.always(function() {
           alert("finished R call");
       });

       //if R returns an error, alert the error message
       req.fail(function() {
           alert("Server error: " + req.responseText);
       });

}
