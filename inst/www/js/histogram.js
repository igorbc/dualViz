function Histogram(){
    this.x = [];
    this.y = [];
    this.svgs = [];
    this.attributes = [];
    this.margin = {top: 20, right: 25, bottom: 30, left: 35},
    this.width = 245 - this.margin.left - this.margin.right,
    this.height = 100 - this.margin.top - this.margin.bottom;
    this.nBins = 10;

    this.update = function(){
        var attrIndex = document.getElementById("varyAttrSelector").value;
        this.updateCurValueLine();

        for(var i = 0; i < this.attributes.length; i++){
            var el = document.getElementById("hist" + i);
            if(i == attrIndex){
                el.classList.add("enabled");
            }
            else {
                el.classList.remove("enabled");
            }
        }
    }

    this.updateCurValueLine = function(){
        var attrIndex = document.getElementById("varyAttrSelector").value;
        var avap = vc.acAttr.avap[attrIndex];
        var value = dm.slider.value();
        var scaledVal = avap.invertedScale(value/(dm.nSteps-1));
        d3.selectAll("#hist" + attrIndex + " .varLine")
            .attr("x1", this.x[attrIndex](scaledVal))
            .attr("x2", this.x[attrIndex](scaledVal));
    }

    this.remove = function(){
        d3.selectAll("#histogram *").remove();
        this.x = [];
        this.y = [];
        this.svgs = [];
        this.attributes = [];
    }

    this.createAllHistograms = function(data, attributes){
        d3.selectAll("#histogram *").remove();
        this.attributes = attributes;
        for(var i = 0; i < this.attributes.length; i++){
            this.createHistogram("#histogram", data, i);
        }
    }

    this.createHistogram = function(id, rawData, i){
        var height = this.height;
        var attrName = this.attributes[i];
        var x = d3.scale.linear()
            .domain(d3.extent(rawData, function(d) { return d[attrName]; }))
            .range([0, this.width]);

        // Generate a histogram using twenty uniformly-spaced bins.
        var data = d3.layout.histogram()
            .bins(this.nBins)
            .value(function(d){return d[attrName]; })
            (rawData);

        var y = d3.scale.linear()
            .domain([0, d3.max(data, function(d) { return d.y; })])
            .range([this.height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .tickSize(3)
            .tickValues(x.ticks(5).concat(x.domain()));

        var svg = d3.select(id).append("svg")
            .attr("id", "hist" + i)
            .attr("class", "invisibleWhenDisabled")
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

        var bar = svg.selectAll(".bar")
            .data(data)
            .enter().append("g")
            .attr("class", "bar")
            .style("fill", "steelblue")
            .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

        bar.append("rect")
            .attr("x", 1)
            .attr("width", (this.width - 10)/this.nBins)
            .attr("height", (function(d) { return height - y(d.y);}));

/*
        bar.append("text")
            .attr("dy", ".75em")
            .attr("y", -11)
            .attr("x", ((this.width - 10)/this.nBins)/2)
            .attr("text-anchor", "middle")
            .style("fill", "#aaa")
            .text(function(d) { return d.y; });
*/
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + this.height + ")")
            .call(xAxis);

        this.addCurValLine(svg, x);
        this.svgs.push(svg);
        this.x.push(x);
        this.y.push(y);
    }


    this.addCurValLine = function(svg, x){
        svg.append("line")
            .attr("class", "varLine")
            .attr("y1", 0)
            .attr("y2", this.height)
            .attr("x1", x(x.domain()[0]))
            .attr("x2", x(x.domain()[0]));
    }
}
