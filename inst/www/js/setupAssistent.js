// used to make all seemingly arbitrary attribuitions.

function SetupAssistent(){
    //this.defaultFile = "db/ecoli.csv";
    //this.defaultFile = "db/iris.csv";
    //this.defaultFile = "db/iris_original.csv"
    this.defaultFile = "db/iris_naive_bayes.csv"
    this.data;

    this.dataPointOpacity = 0.7;
    this.dataPointRadius = 3.5;

    this.svgWidth = 700;
    this.svgHeight = 620;
    this.zoomPx = 13;
    this.translatePx = 13;

    // used for some experimental things regarding opacity and size
    // of circles representing instances.
    this.svgHalfDiagonal = Math.sqrt(
            this.svgHeight*this.svgHeight + this.svgWidth*this.svgWidth)/2;

    this.innerRadvizRadius = 230;
    this.radvizClassRadius = 230;
    this.circlePxThickness = 2;
    this.opacity = 1;

    this.useClass = true;
    this.arc;

    this.vizAttrColor = "mediumSlateBlue";
    this.vizClassColor = "coral";

    this.shitfPressed = false;
    this.rotAngle = 5;
    this.delay = 500;

    this.setBasicVizContainerInfo = function(vc){
        vc.center = [this.svgWidth/2, this.svgHeight/2, 0];
        vc.r = this.innerRadvizRadius;
        vc.dataPointOpacity = this.dataPointOpacity;
        vc.dataPointRadius = this.dataPointRadius;
        vc.zOpacityScale = d3.scale.linear()
            .domain([-this.svgHalfDiagonal, this.svgHalfDiagonal])
            .range([0.5, 0.8]);
        vc.zSizeScale = d3.scale.linear()
                .domain([-this.svgHalfDiagonal, this.svgHalfDiagonal])
                .range([0.5, 8]);
        return vc;
    }

    this.setAvApContainerAttrInfo = function(acAttr, vc){
        acAttr.vc = vc;
        acAttr.pxThickness = this.circlePxThickness;
        acAttr.opacity = this.opacity;
        acAttr.contribution = 1;
        acAttr.normalizedContribution = 1;
        acAttr.color = this.vizAttrColor;
        acAttr.r = this.innerRadvizRadius;
        vc.acAttr = acAttr;
        return acAttr;
    }

    this.setAvApContainerClassInfo = function(acClass, vc){
        acClass.vc = vc;
        acClass.pxThickness = this.circlePxThickness;
        acClass.opacity = this.opacity;
        acClass.contribution = 0;
        acClass.normalizedContribution = 0;
        acClass.color = this.vizClassColor;
        acClass.r = this.radvizClassRadius;
        vc.acClass = acClass;
        return acClass;
    }

    this.getSvgContainer = function(){
        return d3.select("#chart")
            .append("svg:svg")
            .attr("width", this.svgWidth)
            .attr("height", this.svgHeight)

            //.style("border", "1px solid black")
            .attr("transform", "translate(0,0)")
            ;
    }

    this.setupBrush = function(csv, svgContainer, acAttr) {
        var brush = d3.svg.polybrush()
                .x(d3.scale.linear().range([0, this.svgWidth]))
                .y(d3.scale.linear().range([0, this.svgHeight]))

                .on("brush", function () {
                    // set the 'selected' class for the circle


                    vc.instGroup.selectAll("circle").classed("selected", function (d) {
                        if(d.clickSelected) return true;

                        var x = d3.select(this).attr("cx");
                        var y = d3.select(this).attr("cy");

                        if (brush.isWithinExtent(x, y)) {
                            d3.select(this).classed("selected", true);
                            d.selected = 1;

                            return true;
                        } else {
                            d3.select(this).classed("selected", false);
                            d.selected = 0;
                            return false;
                        }
                    });

                    if(vc.instGroup.selectAll("circle.selected").empty()){
                        colorAll = true;
                    }
                    else {
                        colorAll = false;
                    }

                    parcoords.data(csv).alpha(0.7).render();
                });

        svgContainer.append("g")
                .attr("class", "brush")
                .call(brush);
    }

    this.destroyCurrent = function(){
        svgContainer.selectAll("*").remove();

        color = this.getClassColorScheme();

        d3.selectAll("#parc").remove();
        d3.selectAll(".body").append("div")
                .attr("id", "parc")
                .attr("class", "parcoords");
                //.style("width","650px")
                //.style("height","350px");
    }

    this.getClassColorScheme = function(){
        /*
        return d3.scale.category10();
        /*/
        return d3.scale.ordinal()
                .range(["#3366cc", "#dc3912", "#109618", "#990099", "#0099c6",
                        "#ff9900", "#dd4477", "#66aa00", "#b82e2e", "#316395",
                        "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300",
                        "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"]);
        //*/
    }
}
