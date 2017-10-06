
function createPdLinePlot(id, data, keys, colorScheme){
    var pdp;

    d3.selectAll(id + " *").remove();

    var margin = {top: 20, right: 22, bottom: 30, left: 40},
        width = 245 - margin.left - margin.right,
        height = 150 - margin.top - margin.bottom;

    var x = d3.scale.linear()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var color = colorScheme;

    // Set domains for axes
    x.domain(d3.extent(data, function(d) { return d.v; }));
    y.domain([0, 1]);
    color.domain(d3.keys(data[0]).filter(function(key) { return key !== "v"; }));

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickSize(2)
        .tickValues(x.ticks(5).concat(x.domain()))
        ;

    var yAxis = d3.svg.axis()
        .scale(y)
        .tickValues(y.ticks(3).concat(y.domain()))
        .tickSize(2)
        .orient("left")
        //.tickFormat(formatPercent);

    var line = d3.svg.line()
        .interpolate("basis")
        .x(function(d) { return x(d.v); })
        .y(function(d) { return y(d.y); });

    var svg = d3.select(id).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var categories = color.domain().map(function(name) {
        return {
            name: name,
            values: data.map(function(d) {
                return {v: d.v, y: d[name] * 1};
            })
        };
    });

    var category = svg.selectAll(".category")
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

/*
    category.append("text")
        .datum(function(d) { return {name : d.name, value: d.values[d.values.length - 1]}; })
        .attr("transform", function(d) { return "translate(" + x(d.value.v) + "," + y(d.value.y) + ")"; })
    //    .attr("transform", function(d) { return "translate(" + x(d.value.v)+ "," + y(d.value.y0 + d.value.y / 2) + ")"; })
        .attr("x", -6)
        .style("text-anchor", "end")
        .attr("dy", ".35em")
        .text(function(d) { return d.name; });
*/
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "axis")
        .call(yAxis);

    d3.selectAll("#pdp text").style("font-size", "10px");
    d3.selectAll("#pdp text").style("fill", "#fff");

    d3.selectAll(".axis text").style("fill", "#aaa")

    d3.selectAll(".axis .domain").style("stroke", "#ddd");
    //d3.selectAll(".axis path").style("fill", "#aaa");

}

function createPdAreaPlot(id, data, keys, colorScheme){
    var pdp;

    d3.selectAll(id + " *").remove();

    var margin = {top: 20, right: 22, bottom: 30, left: 40},
        width = 245 - margin.left - margin.right,
        height = 150 - margin.top - margin.bottom;

    var x = d3.scale.linear()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var color = colorScheme;

    // Set domains for axes
    x.domain(d3.extent(data, function(d) { return d.v; }));
    y.domain([0, 1]);
    color.domain(d3.keys(data[0]).filter(function(key) { return key !== "v"; }));

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickSize(2)
        .tickValues(x.ticks(5).concat(x.domain()))
        ;

    var yAxis = d3.svg.axis()
        .scale(y)
        .tickValues(y.ticks(3).concat(y.domain()))
        .tickSize(2)
        .orient("left")
        //.tickFormat(formatPercent);

    var area = d3.svg.area()
        .x(function(d) { return x(d.v); })
        .y0(function(d) { return y(d.y0); })
        .y1(function(d) { return y(d.y0 + d.y); });

    var stack = d3.layout.stack()
        .values(function(d) { return d.values; });

    var svg = d3.select(id).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var layers = stack(color.domain().map(function(name) {
        return {
            name: name,
            values: data.map(function(d) {
                return {v: d.v, y: d[name] * 1};
            })
        };
    }));

    var layer = svg.selectAll(".layer")
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

/*
    layer.append("text")
        .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
        .attr("transform", function(d) { return "translate(" + x(d.value.v)+ "," + y(d.value.y0 + d.value.y / 2) + ")"; })
        .attr("x", -6)
        .style("text-anchor", "end")
        .attr("dy", ".35em")
        .text(function(d) { return d.name; });
*/
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "axis")
        .call(yAxis);

    d3.selectAll("#pdp text").style("font-size", "10px");
    d3.selectAll("#pdp text").style("fill", "#fff");

    d3.selectAll(".axis text").style("fill", "#aaa")

    d3.selectAll(".axis line").style("stroke", "#ddd");
    d3.selectAll(".axis .domain").style("stroke", "#ddd");
    //d3.selectAll(".axis path").style("fill", "#aaa");
}
//*/
