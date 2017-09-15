function DataManager(){
    this.data;
    this.fullData = null;
    this.classifiedData = null;
    this.vData = []; // varying data
    this.tData = []; // true data (backed up when data varies)
    this.vDimension; // varying dimensionSelector
    this.dIndices = []; // index of the instances being varied
    this.nSteps = 50;
    this.slider = null;
    this.classNames;
    this.isClassified;
    this.attrHeader = []; // array with the headers for the Attirbute columns
    this.probHeader = []; // array with the headers for the Class Probabilities columns

    this.updateAttrAndProbHeaders = function(){
        var firstLine = d3.entries(this.data[0]);
        var allHeaders = [];
        var classIndex = -1;
        // gets the index of where the Class Probabilities columns start
        for (var i = 0; i < firstLine.length; i++) {
            allHeaders.push(firstLine[i].key.toString());
            if (allHeaders[i] == "class") {
                classIndex = i;
            }
        }

        this.attrHeader = allHeaders.slice(0, classIndex);
        this.probHeader = allHeaders.slice(classIndex + 1, allHeaders.length - 2);
        //if(this.probHeader.length != 0){
        //    vc.pcHiddenAxes = vc.pcHiddenAxes.concat(this.probHeader);
        //}
        //this.probHeader.pop();
    }

    this.setData = function(data){
        this.data = data;
        this.classNames = d3.map(this.data, function(d){return d.class;}).keys();
        this.updateAttrAndProbHeaders();
        if(this.probHeader.length == 0){
            console.log("NO PROBABILITIES");
            this.isClassified = false;
            this.fullData = data;
        }
        else{
            console.log("CLASSIFIED ALRIGHT!");
            this.isClassified = true;
            this.classifiedData = data;
        }
    }

    this.updateDataOptions = function(){
        var selector = document.getElementById("dataSelector");
        // Clear previous contents of the container
        while (selector.hasChildNodes()) {
            selector.removeChild(selector.lastChild);
        }

        if(this.fullData){
            var o = document.createElement("option");
            o.value = "original";
            o.innerHTML = "original (" + this.fullData.length + " instances)";
            selector.appendChild(o);
        }

        if(this.classifiedData){
            var o = document.createElement("option");
            o.value = "classified";
            o.innerHTML = "classified (" + this.classifiedData.length + " instances)";
            selector.appendChild(o);
        }

        if(this.data == dm.classifiedData){
            selector.value = "classified";
        }
        else{
            selector.value = "original";
        }

    }


    this.dataSelected = function(el, event){

        if(el.value == "classified"){
            this.data = this.classifiedData;
        }
        else{
            this.data = this.fullData;
        }
        sa.destroyCurrent();
        vc.createAcApContainers();
        vc.colorScheme = sa.getClassColorScheme();
        useFile(this.data);
    }

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
            if(this.isClassified){
                useModel(this.vData, true);
            }
        }
        else{
            alert("Select at least one data point to use this feature.");
        }
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

    this.updateSlider = function(){
        this.slider
            .on("slide", this.getOnSlideFunction())
            .value(0);
        this.updateSliderText(0);
    }

    this.getOnSlideFunction = function(){
        return (function(evt, value){
            this.updateVaryingData(value);
            vc.instGroup.selectAll("circle").data(this.data);
            vc.updateInst(80);
            this.updateSliderText(value);
            parcoords.data(dm.data).alpha(0.7).render();
        }).bind(this);
    }

    this.updateSliderText = function(value){
        var avap = vc.acAttr.avap[
            document.getElementById("varyAttrSelector").value];
        document.getElementById("attrLabel").innerHTML = "Value: " +
            Math.round(
                avap.invertedScale(value/(this.nSteps-1))*100
            )/100;
        document.getElementById("attrDomainLabel").innerHTML =
            "Domain: [" + avap.scale.domain() + "]";
    }

    this.setupSlider = function(){
        if(this.slider){
            this.updateSlider();
        }
        else{
            this.slider = d3.slider()
                    .min(0)
                    .max(this.nSteps-1)
                    .step(1);
            this.updateSlider();
            d3.select("#attrVarSlider").call(this.slider);
        }
    }

    this.varyAttrSelected = function(event){
        this.updateSlider();
        //alert(this.selectedIndex + " " + this.options[this.selectedIndex].text);
    }

    this.getParcoordsData = function(){
        var dataAttributes = this.data.map((function(d){
            var e = {};
            e.class = d.class;
            e.selected = d.selected;
            for (var i = 0; i < this.attrHeader.length; i++) {
                e[this.attrHeader[i]] = +d[this.attrHeader[i]];
            }
            return e;
        }).bind(this));
        return dataAttributes;
    }
}
