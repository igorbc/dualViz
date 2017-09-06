function DataManager(){
    this.data;
    this.vData = []; // varying data
    this.tData = []; // true data
    this.vDimension; // varying dimensionSelector
    this.dIndices = []; // index of the instances being varied
    this.nSteps = 20;

    this.varyAttribute = function(){
        var indices = [];

        vc.instGroup.selectAll("circle")
            .each(function(d, i){
                if(d.selected){
                    indices.push(i);
	            }
            });
        this.dIndices = indices;

        if(indices.length > 0){
            this.multiCreateInstances();
            //console.log(this.vData);
            useModel(this.vData);
        }
        else{
            alert("Select at least one data point to use this feature.");
        }
    }

    this.setupSlider = function(){
        var avap = vc.acAttr.avap[document.getElementById("varyAttrSelector").value];

        //d3.select("#attrVarSlider").remove();
        d3.select("#attrVarSlider").call(d3.slider()
                .min(0)
                .max(this.nSteps-1)
                .value(Math.round(this.nSteps/2))
                .step(1)
                .on("slide", (function(evt, value){
                    this.updateVaryingData(value);
                    vc.instGroup.selectAll("circle").data(this.data);
                    vc.updateInst(sa.delay/2);
                    document.getElementById("attrLabel").innerHTML = "Value: " +
                        Math.round(
                            avap.invertedScale(value/(this.nSteps-1))*100
                        )/100;
                }).bind(this)));
    }

    this.updateVaryingData = function(index){
        var s = this.nSteps;
        for(var i = 0; i < this.dIndices.length; i++){
            this.data[this.dIndices[i]] = this.vData[i*s + index];
            this.data[this.dIndices[i]].selected = 1;
        }
    }

    this.restoreData = function(){
        var s = this.nSteps;
        for(var i = 0; i < this.dIndices.length; i++){
            this.data[this.dIndices[i]] = this.tData[i];
        }
        vc.instGroup.selectAll("circle").data(this.data);
        vc.updateInst(sa.delay/2);
    }

    this.multiCreateInstances = function(){
        this.vData = [];
        this.tData = [];
        var attr = document.getElementById("varyAttrSelector").value;
        for(var i = 0; i < this.dIndices.length; i++){
            this.vData = this.vData.concat(
                    this.createTestInstances(
                        this.data[this.dIndices[i]], attr, this.nSteps));
            this.tData[i] = this.data[this.dIndices[i]];
        }
        return this;
    }

    this.createTestInstances = function(d, attrIndex, n){
        //console.log(d);
        //console.log(attrIndex);
        //console.log(n);
        var r = [];
        var avap = vc.acAttr.avap[attrIndex];
        //console.log(avap);
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
        //console.log(r);
        return r;
    }

    this.varyAttrSelected = function(event){
        //alert(this.selectedIndex + " " + this.options[this.selectedIndex].text);
    }
}
