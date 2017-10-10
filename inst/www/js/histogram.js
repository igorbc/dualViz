function Histogram(){
    this.x = null;
    this.y = null;
    this.margin = {top: 20, right: 22, bottom: 30, left: 35},
    this.width = 245 - this.margin.left - this.margin.right,
    this.height = 150 - this.margin.top - this.margin.bottom;
    this.svg;

    this.updateCurValueLine = function(){
        if(this.x){
            var avap = vc.acAttr.avap[
                document.getElementById("varyAttrSelector").value];
            var value = dm.slider.value();
            var scaledVal = avap.invertedScale(value/(dm.nSteps-1));
            d3.selectAll(".varLine").attr("x1", this.x(scaledVal));
            d3.selectAll(".varLine").attr("x2", this.x(scaledVal));
        }
    }

    this.createHistogram =  function(id, data, i){
        this.x = d3.scaleLinear()
            .rangeRound([0, this.width]);

        var bins = d3.histogram()
            .domain(this.x.domain())
            .thresholds(this.x.ticks(20))
            .value(function(d){ return d[i]; })
            ;

        var y = d3.scaleLinear()
            .domain([0, d3.max(bins, function(d) { return d.length; })])
            .range([height, 0]);

        var bar = g.selectAll(".bar")
          .data(bins)
          .enter().append("g")
            .attr("class", "bar")
            .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; });

        bar.append("rect")
            .attr("x", 1)
            .attr("width", x(bins[0].x1) - x(bins[0].x0) - 1)
            .attr("height", function(d) { return height - y(d.length); });

        bar.append("text")
            .attr("dy", ".75em")
            .attr("y", 6)
            .attr("x", (x(bins[0].x1) - x(bins[0].x0)) / 2)
            .attr("text-anchor", "middle")
            .text(function(d) { return formatCount(d.length); });

        g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        /*
        this.x = d3.scale.linear()
            .range([0, this.width]);

        this.y = d3.scale.linear()
            .range([this.height, 0]);

        // Set domains for axes
        this.x.domain(d3.extent(data, function(d) { return d.v; }));

        var x = this.x;
        var y = this.y;
        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .tickSize(3)
            .tickValues(this.x.ticks(5).concat(this.x.domain()));

        var yAxis = d3.svg.axis()
            .scale(y)
            .tickValues(this.y.ticks(3).concat(this.y.domain()))
            .tickSize(3)
            .orient("left");

        this.svg = this.createPdpSvg(id, xAxis, yAxis);

        this.addCurValLine(this.pdpAreaSvg);
        */
    }

    this.addCurValLine = function(svg){
        svg.append("line")
            .attr("class", "varLine")
            .attr("y1", 0)
            .attr("y2", this.height)
            .attr("x1", this.x(this.x.domain()[0]))
            .attr("x2", this.x(this.x.domain()[0]));
    }

    this.createHistogramSvg = function(id, xAxis, yAxis){
        d3.selectAll(id + " *").remove();
        var svg = d3.select(id).append("svg")
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + this.height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "axis")
            .call(yAxis);

        return svg;
    }
}

createHistogram =  function(id, rawData, i){
    d3.selectAll(id + " *").remove();

    margin = {top: 20, right: 22, bottom: 30, left: 35},
    width = 245 - margin.left - margin.right,
    height = 150 - margin.top - margin.bottom;

    var x = d3.scale.linear()
        .domain(d3.extent(rawData, function(d) { return d[i]; }))
        .range([0, width]);

    // Generate a histogram using twenty uniformly-spaced bins.
    var data = d3.layout.histogram()
        .bins(10)
        .value(function(d){return d[i]; })
        (rawData);

    var y = d3.scale.linear()
        .domain([0, d3.max(data, function(d) { return d.y; })])
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickSize(3)
        .tickValues(x.ticks(5).concat(x.domain()));

    var svg = d3.select(id).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var bar = svg.selectAll(".bar")
        .data(data)
        .enter().append("g")
        .attr("class", "bar")
        .style("fill", "steelblue")
        .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

    bar.append("rect")
        .attr("x", 1)
        .attr("width", (width - 10)/10)
        .attr("height", function(d) { return height - y(d.y); });
//*
    bar.append("text")
        .attr("dy", ".75em")
        .attr("y", -9)
        .attr("x", ((width - 10)/10)/2)
        .attr("text-anchor", "middle")
        .style("fill", "#aaa")
        .text(function(d) { return d.y; });


    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
        //*/
}
