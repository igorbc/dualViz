function DataManager(){
    this.data;
    this.vData; // varying data
    this.vDimension; // varying dimensionSelector
    this.dIndex; // index of the instance being varied

    this.varyAttribute = function(){
        this.vData = this.createTestInstances(this.data[25],
                        document.getElementById("varyAttrSelector").value,
                        20);
        useModel(this.vData);
    }

    this.createTestInstances = function(d, attrIndex, n){
        console.log(d);
        console.log(attrIndex);
        console.log(n);
        var r = [];
        var avap = vc.acAttr.avap[attrIndex];
        console.log(avap);
        var keys = Object.keys(vc.acAttr.indices);

        for(var i = 0; i < n; i++){
            var newData = {};
            for(var j = 0; j < keys.length; j++){

                newData[keys[j]] = d[keys[j]].toString();
            }
            newData["class"] = d["class"];
            newData[avap.key] = avap.invertedScale(i/(n-1)).toString();

            r.push(newData);
        }
        console.log(r);
        return r;
    }

    this.varyAttrSelected = function(event){
        //alert(this.selectedIndex + " " + this.options[this.selectedIndex].text);
    }
}
