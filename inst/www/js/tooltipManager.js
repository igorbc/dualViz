/**
 * Created by igorcorrea on 03/12/2015.
 */

var mouseDown = false;

function mouseMove(ev, el) {
    var x = ev.offsetX;
    var y = ev.offsetY;
    if(mouseDown){
        if(vc.isRadviz){
            var arcZ = ev.movementY + -ev.movementX;

            vc.acClass.rotate(deg2rad(arcZ), "z");
            vc.acAttr.rotate(deg2rad(arcZ), "z");
        }
        else{
            var arcX = -ev.movementY * 1.5
            var arcY =  ev.movementX * 1.5;
            vc.acClass.rotate(deg2rad(arcY), "y");
            vc.acClass.rotate(deg2rad(arcX), "x");
            vc.acAttr.rotate(deg2rad(arcY), "y");
            vc.acAttr.rotate(deg2rad(arcX), "x");
        }
        vc.drawEverything();
    }
}

function mouseDownUp(ev, el, val) {
    mouseDown = val;
}

setupTooltip = function(headers, headersClass, csv) {

    var tooltip = d3.select("#chart")
        .append("div")
        .attr("class", "tooltip");

    tooltip.append("div")
        .attr("class", "label");

    var pc = createParCoords(csv, headers);
    pc.colorAll = true;
//*
    vc.instGroup.selectAll("circle").on("mouseover", function (d) {

        d.mouseOver = 1;

        tooltip.html(getInstanceStr(d, headers, headersClass));



        var x = parseInt(d3.select(this).attr("cx"));
        var y = parseInt(d3.select(this).attr("cy"));

        tooltip.style("top", (y + 10) + "px")
            .style("left", (x + 10) + "px");

        tooltip.style("display", "block");
        tooltip.transition().duration(150).style("opacity", .9)
        d3.select(this).classed("selected", true);
        //d3.select(this).attr("stroke", "black");
        //d3.select(this).attr("stroke-width", 3);

        //console.log(d3.select(this));

        colorAll = false;
        pc.data(csv).alpha(1).render();
    });

    vc.instGroup.selectAll("circle").on("mouseout", function (d) {
        d.mouseOver = 0;
        //d3.select(this).attr("stroke-width", 0);
        d3.select(this).classed("selected", false);
        tooltip.transition().duration(150).style("opacity", 0);
        tooltip.style("display", "none");
        colorAll = true;
        pc.data(csv).alpha(0.4).render();
    });


    vc.instGroup.selectAll("circle").on("mousemove", function (d) {
        var x = parseInt(d3.select(this).attr("cx"));
        var y = parseInt(d3.select(this).attr("cy"));

        tooltip.style("top", (y + 10) + "px")
            .style("left", (x + 10) + "px");
    });
    //*/
    return pc;
}

getInstanceStr = function (d, headers, headersClass) {
    var str = "";
    for (var i = 0; i < headers.length; i++) {
        str = str + "<p>" + headers[i] + ": " + d[headers[i]] +
                " (" + Math.round(vc.acAttr.avap[i].scale(d[headers[i]]) * 100) / 100 + ")</p>"
    }
    for (var i = 0; i < headersClass.length; i++) {
        str = str + "<p>" + headersClass[i] + ": " + Math.round(d[headersClass[i]] * 100) / 100 + "</p>"
    }
    return str;
}

createParCoords = function(csv, headers){

    var dataAttributes = csv.map(function(d){
        var e = {};
        e.class = d.class;
        e.mouseOver = d.mouseOver;
        for (var i = 0; i < headers.length; i++) {
            e[headers[i]] = +d[headers[i]];
        }
        return e;
    });

    //if(parcoords == undefined) {
        console.log("inicializando");
        parcoords = d3.parcoords()("#parc");
    //}
    //else
    //    console.log("já inicializado");

    parcoords
        .data(dataAttributes)
        .hideAxis(["class", "mouseOver"])
        .alpha(0.4)
        .color(function(d){
            //console.log(color(d.class));
            if (colorAll){
                return vc.colorScheme(d.class);
            }
            else {
                return (d.mouseOver == 1)? vc.colorScheme(d.class): "rgba(100,100,100,0.1)";
            }

        })
        .render()
        .createAxes()
        .reorderable();

    return parcoords;
}
