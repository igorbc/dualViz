function VizContainer(){
    this.isRadviz = true;
    this.center = []; // center in pixel coordinates.
                      // Shared by the AV-AP Containers
    this.r; // initial radius from center to AV-APs in pixel.
            // Shared by the AV-AP Containers while calculating instances'
            // positions.
    this.acClass;
    this.acAttr;

    this.center;
    this.dataPointOpacity;
    this.dataPointRadius;
    this.instGroup; // svg group containing the data points
    this.instPos = []; // holds the position in screen coordinates
                       //(pixels in the SVG) of every data point.
    this.colorScheme;
    this.confusionClass = 0;

    this.dynamicOpacity = true;
    this.pcHiddenAxes = [];

    this.createAcApContainers = function(){
        this.acAttr = new AvApContainer();
        this.acClass = new AvApContainer();

        sa.setBasicVizContainerInfo(this);
        sa.setAvApContainerAttrInfo(this.acAttr, vc);
        sa.setAvApContainerClassInfo(this.acClass, vc);
        this.pcHiddenAxes = ["class", "selected"];
    }

    this.initializeInstGroup = function(data) {
        this.instGroup = svgContainer.append("g");
        this.instGroup.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", this.center[0])
            .attr("cy", this.center[1])
            .attr("r", 1)
            .attr("fill",function(d){return vc.colorScheme(d.class);});
            //.attr("stroke",function(d){return vc.colorScheme(d.class);});
    }

    this.updateInst = function(delay = 0) {
        this.instPos = [];
        var selection;

        if (delay) {
            selection = this.instGroup.selectAll("circle").transition().duration(delay);
        }
        else {
            selection = this.instGroup.selectAll("circle");
        }

        if(selection.empty())
            alert("Error: no instances.");
        else{
            selection
                .each(function(d,i){
                    vc.instPos.push(vc.getInstancePosition(d));
                })
                .attr("cx", function(d, i){
                    return vc.instPos[i][0];
                })
                .attr("cy", function(d, i){
                    return vc.instPos[i][1];
                })
                .attr("opacity", this.dataPointOpacity)
                .attr("r", this.dataPointRadius)
                /*
                .attr("opacity", function(d, i){
                    //console.log(vc.acAttr.instPos[i][2]);
                    return  vc.acAttr.zOpacityScale(this.instPos[i][2]);
                })
                .attr("r", function(d, i){
                    return vc.acAttr.zSizeScale(this.instPos[i][2])
                })
                */
                .attr("fill", vc.colorFunction);
            }
    }

    this.getInstancePosition = function(d) {
        var sum = [0, 0, 0];
        var denominatorSum = 0;

        var contributions = [vc.acAttr.normalizedContribution,
                             vc.acClass.normalizedContribution];

        var avaps = [vc.acAttr.avap,
                     vc.acClass.avap];

        // RadViz
        if(vc.isRadviz) {
            for(var j = 0; j < contributions.length; j++){
                var avap = avaps[j];
                for(var i = 0; i < avap.length; i++) {
                    if(avap[i].enabled){
                        var val = (avap[i].inverted)?
                                  1 - avap[i].scale(+d[avap[i].key]) :
                                      avap[i].scale(+d[avap[i].key]);


                        sum = add3(sum, mul3(avap[i].normalizedPosFixedRadius, val * contributions[j]));
                        denominatorSum += val * contributions[j];
                    }
                }
            }
            if (denominatorSum == 0){
                console.log("denom: " + denominatorSum);
                return [0,0,0];
            }
            return add3(mul3(mul3(sum, vc.r),1/denominatorSum), vc.center);
        }

        // Star Coordinates
        else {
            for(var j = 0; j < contributions.length; j++){
                var avap = avaps[j];
                for(var i = 0; i < avap.length; i++) {
                    if(avap[i].enabled){
                        var val = (avap[i].inverted)?
                                  1 - avap[i].scale(+d[avap[i].key]) :
                                      avap[i].scale(+d[avap[i].key]);

                        sum = add3(sum, mul3(avap[i].normalizedPos, val * contributions[j]));
                    }
                }
            }
            return add3(mul3(sum, vc.r), vc.center);
        }
    }

    this.setViz = function(setToRadviz){
        if(( setToRadviz && !this.isRadviz) ||
           (!setToRadviz &&  this.isRadviz))
           this.toggleRvSc();
    }

    this.toggleRvSc = function(delay = 500){
        this.isRadviz = !this.isRadviz;
        radVizLink = document.getElementById("useRadViz");
        starCoordLink = document.getElementById("useStarCoord");
        if(this.isRadviz){
            starCoordLink.classList.remove("curViz");
            radVizLink.classList.add("curViz");

            vc.acAttr.avapLineGroup.selectAll("line")
                .transition()
                .duration(delay)
                .attr("opacity",0).remove();

            vc.acClass.avapLineGroup.selectAll("line")
                .transition()
                .duration(delay)
                .attr("opacity",0).remove();

            vc.acAttr.createPath(delay);
            vc.acClass.createPath(delay);
            vc.acAttr.alignAvApsWithRadviz();
            vc.acClass.alignAvApsWithRadviz();
        }
        else{
            radVizLink.classList.remove("curViz");
            starCoordLink.classList.add("curViz");

            vc.acAttr.path
                .transition()
                .duration(delay)
                .attr("opacity",0)
                .remove();

            vc.acClass.path
                .transition()
                .duration(delay)
                .attr("opacity",0)
                .remove();

            vc.acAttr.createStarCoordLines(delay);
            vc.acClass.createStarCoordLines(delay);
        }
        vc.acAttr.updateAvApPositionOnScreen(delay);
        vc.acClass.updateAvApPositionOnScreen(delay);
        vc.updateInst(delay);
        return(this.isRadviz);
        //onD3TransitionsEnd(t1,t2,cb);
    }

    this.updateColor = function(delay = 0){
            vc.instGroup.selectAll("circle")
            .transition().duration(0)
            .attr("fill", vc.colorFunction)
            .transition().duration(delay)
            .attr("fill", vc.colorFunction);
    }

    this.colorFunction = function(d){
        if(!vc.confusionClass){
            return vc.colorScheme(d["class"]);
        }
        else{
            if(d["prediction(class)"] == vc.confusionClass){
                if(d["prediction(class)"] == d["class"]){
                    return "green" // true positive
                }
                else {
                    return "rgb(255, 195, 0)" // false positive
                }
            }
            else if(d["class"] == vc.confusionClass){
                    return "red" // false negative
                }
                else{
                    return "grey" // true negative
                }
        }
    }

    this.adjustStarCoord = function(){
        if(this.isRadviz) return false;

        if(vc.acAttr.nEnabled == 2){
            vc.setNewCenter([sa.svgWidth * .2, sa.svgHeight * .9, 0]);
            var first = true;
            vc.acAttr.avap.forEach(function(avap){
                if(avap.enabled){
                    if(first){
                        avap.setNewPos(add3(mul3([0, -1, 0],(.8 * sa.svgHeight)),
                                            vc.center));
                        first = false;
                    }
                    else{
                        avap.setNewPos(add3(mul3([1, 0, 0],(.7 * sa.svgWidth)),
                                            vc.center));
                    }
                }
            });

            vc.drawEverything(sa.delay);
        }
        else if (vc.acAttr.nEnabled == 3) {
            var n = 1;
            for(var i = 0; i < vc.acAttr.avap.length; i++){

                var avap = vc.acAttr.avap[i];
                if(avap.enabled){
                    switch(n){
                        case 1:
                            avap.setNewPos(add3(mul3([0, -1, 0],(.5 * sa.svgHeight)),
                                            vc.center));
                            console.log("first");
                        break;

                        case 2:
                            avap.setNewPos(add3(mul3([1, 0, 0],(.5 * sa.svgHeight)),
                                        vc.center));
                            console.log("second");
                        break;

                        case 3:
                            avap.setNewPos(add3(mul3([0, 0, -1],(.5 * sa.svgHeight)),
                                    vc.center));
                            console.log("third");
                    }
                    n++;
                }
            }

            vc.acClass.rotate(deg2rad(45), "y", false);
            vc.acClass.rotate(deg2rad(35), "x", false);
            vc.acAttr.rotate(deg2rad(45), "y", false);
            vc.acAttr.rotate(deg2rad(35), "x", false);
            vc.drawEverything(sa.delay);
        }
    }

    this.setNewCenter = function(pos){
        vc.center = pos;
        vc.acAttr.avap.forEach(function(avap){
            avap.updatePosNewCenter();
        });
        vc.acClass.avap.forEach(function(avap){
            avap.updatePosNewCenter();
        });
    }

    this.addToCenter = function(val){
        vc.center = add3(vc.center, val);
        vc.acAttr.avap.forEach(function(avap){
            avap.updatePosNewCenter();
        });
        vc.acClass.avap.forEach(function(avap){
            avap.updatePosNewCenter();
        });
    }

    this.addToRadius = function(val){
        if((vc.r + val) > sa.zoomPx){
            vc.r += val;
            vc.acAttr.r += val;
            vc.acClass.r += val;
            vc.acAttr.avap.forEach(function(avap){
                avap.updatePosNewRadius();
            });
            vc.acClass.avap.forEach(function(avap){
                avap.updatePosNewRadius();
            });
        }
    }

    this.drawEverything = function(delay = 0){
        this.updateInst(delay);
        this.acAttr.updateAvApPositionOnScreen(delay);
        this.acClass.updateAvApPositionOnScreen(delay);
    }
}
