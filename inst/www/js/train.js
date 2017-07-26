train = function(allData){
    if(isFileClassified){
        alert("This file aready contains information about classification results.\n" +
        "Use another file.");
        return false;
    }

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
}
