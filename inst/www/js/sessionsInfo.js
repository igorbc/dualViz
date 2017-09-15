function SessionsInfo(){
    this.sessions = [];
    this.count = 0;

    this.fileNames = [];
    this.filePaths = [];
    this.keys = [];
    this.dataIds = [];
    this.methods = [];

    this.add = function(session, method, dataId){
        this.sessions.push(session);
        this.keys.push(session.key);
        this.methods.push(method);
        this.dataIds.push(dataId);


        //var filePath = session.output[session.output.length - 2];
        //this.fileNames.push(filePath.substring(filePath.lastIndexOf("/")+1));
        this.fileNames.push(method + ".rds");
        this.filePaths.push("../../../ocpu-store/" + session.key + "/");

        this.count++;
    }

    this.getLastDownloadPath = function(){
        return this.getDownloadPath(this.count - 1);
    }

    this.getDownloadPath = function(i){
        return this.getLastSession().getFileURL(this.getLastFileName());
    }

    // callback f is defined as f(index)
    // 'this' can be referenced from inside the callback
    // as with all other methods starting with forEach
    this.forEach = function(f){
        for(var i = 0; i < this.count; i++){
            f.call(this, i);
        }
    }

    // callback f is defined as f(fullFilePath, index)
    this.forEachFullFilePath = function(f){
        for(var i = 0; i < this.count; i++){
            f.call(this, this.getFullFilePath(i), i);
        }
    }

    // callback f is defined as f(filePath, index)
    this.forEachFilePath = function(f){
        for(var i = 0; i < this.count; i++){
            f.call(this, this.filePaths[i], i);
        }
    }

    // callback f is defined as f(fileName, index)
    this.forEachFileName = function(f){
        for(var i = 0; i < this.count; i++){
            f.call(this, this.fileNames[i], i);
        }
    }

    // callback f is defined as f(key, index)
    this.forEachKey = function(f){
        for(var i = 0; i < this.count; i++){
            f.call(this, this.keys[i], i);
        }
    }

    this.getFullFilePath = function(i){
        return this.filePaths[i] + this.fileNames[i];
    }

    this.getLastModelStr = function(){
        var i = this.count - 1;
        return this.fileNames[i] + " " + this.count + " (data was: '" +
            this.dataIds[i] + "')";
    }

    this.getLastKey = function(){
        return this.sessions[this.count - 1].key;
    }

    this.getLastFileName = function(){
        return this.fileNames[this.count - 1];
    }

    this.getLastSession = function(){
        return this.sessions[this.count - 1];
    }

    this.getLastConsole = function(){
        this.getConsole(this.count - 1);
    }

    this.getConsole = function(i){
        this.sessions[i].getConsole(function(text){
            console.log(text);
        });
    }
}
