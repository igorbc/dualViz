function PdPlot(){
    this.x = null;
    this.y = null;
    this.color;
    this.margin = {top: 20, right: 25, bottom: 30, left: 35},
    this.width = 245 - this.margin.left - this.margin.right,
    this.height = 150 - this.margin.top - this.margin.bottom;
    this.pdpLineSvg;
    this.pdpAreaSvg;

    this.updateCurValueLine = function(){
        if(this.x){
            var avap = vc.acAttr.avap[
                document.getElementById("varyAttrSelector").value];
            var value = dm.slider.value();
            var scaledVal = avap.invertedScale(value/(dm.nSteps-1));
            d3.selectAll(".varLine")
                .attr("x1", this.x(scaledVal))
                .attr("x2", this.x(scaledVal));
        }
    }

    this.removePdPlots = function(idArea, idLine){
        d3.selectAll(idArea + " *").remove();
        d3.selectAll(idLine + " *").remove();
        this.x = null;
        this.y = null;
    }

    this.createPdPlots =  function(idArea, idLine, data, keys, colorScheme){
        this.x = d3.scale.linear()
            .range([0, this.width]);

        this.y = d3.scale.linear()
            .range([this.height, 0]);

        this.color = colorScheme;

        // Set domains for axes
        this.x.domain(d3.extent(data, function(d) { return d.v; }));
        this.y.domain([0, 1]);
        this.color.domain(d3.keys(data[0]).filter(function(key) { return key !== "v"; }));


        var x = this.x;
        var y = this.y;
        var color = this.color;

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

        this.pdpLineSvg = this.createPdpSvg(idLine, xAxis, yAxis);
        this.pdpAreaSvg = this.createPdpSvg(idArea, xAxis, yAxis);

    // Line Plot specific
        var line = d3.svg.line()
            .interpolate("basis")
            .x(function(d) { return x(d.v); })
            .y(function(d) { return y(d.y); });

        var categories = this.color.domain().map(function(name) {
            return {
                name: name,
                values: data.map(function(d) {
                    return {v: d.v, y: d[name] * 1};
                })
            };
        });

        var category = this.pdpLineSvg.selectAll(".category")
            .data(categories)
            .enter().append("g")
            .attr("class", "category");

        category.append("path")
            .attr("class", "line")
            .attr("d", function(d) { return line(d.values); })
            .style("fill", "none")
            .style("stroke-width", "1.5px")
            .style("stroke", function(d) {
                var c = d3.hsl(color(d.name));
                c.s *= 0.7;
                return c.toString();
            });

    // Line Area specific
        var area = d3.svg.area()
            .x(function(d) { return x(d.v); })
            .y0(function(d) { return y(d.y0); })
            .y1(function(d) { return y(d.y0 + d.y); });

        var stack = d3.layout.stack()
            .values(function(d) { return d.values; });

        var layers = stack(this.color.domain().map(function(name) {
            return {
                name: name,
                values: data.map(function(d) {
                    return {v: d.v, y: d[name] * 1};
                })
            };
        }));

        var layer = this.pdpAreaSvg.selectAll(".layer")
            .data(layers)
            .enter().append("g")
            .attr("class", "layer");

        layer.append("path")
            .attr("class", "area")
            .attr("d", function(d) { return area(d.values); })
            .style("fill", function(d) {
                var c = d3.hsl(color(d.name));
                c.s *= 0.7;
                return c.toString();
            });

        this.addCurValLine(this.pdpAreaSvg);
        this.addCurValLine(this.pdpLineSvg);

    /*
        category.append("text")
            .datum(function(d) { return {name : d.name, value: d.values[d.values.length - 1]}; })
            .attr("transform", function(d) { return "translate(" + x(d.value.v) + "," + y(d.value.y) + ")"; })
        //    .attr("transform", function(d) { return "translate(" + x(d.value.v)+ "," + y(d.value.y0 + d.value.y / 2) + ")"; })
            .attr("x", -6)
            .style("text-anchor", "end")
            .attr("dy", ".35em")
            .text(function(d) { return d.name; });

        svg.append("line")
            .attr("class", "varLine")
            .style("fill", "#fff")
            .style("stroke", "#fff")
            .style("stroke-width", "2px")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .attr("y1", 0)
            .attr("y2", height)
            .attr("x1", x(4.3))
            .attr("x2", x(4.3));
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

    this.createPdpSvg = function(id, xAxis, yAxis){
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

function testLine(i){
    pdPlot.pdpLineSvg.append("line")
        .attr("class", "varLine")
        .style("fill", "#fff")
        .style("stroke", "#fff")
        .style("stroke-width", "2px")
        //.attr("transform", "translate(" + pdPlot.margin.left + "," + pdPlot.margin.top + ")")
        .attr("y1", 0)
        .attr("y2", pdPlot.height)
        .attr("x1", pdPlot.x(pdPlot.x.domain()[i]))
        .attr("x2", pdPlot.x(pdPlot.x.domain()[i]));
}
