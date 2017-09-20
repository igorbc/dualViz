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

setupTooltip = function(headers, headersClass, data) {

    var tooltip = d3.select("#chart")
        .append("div")
        .attr("class", "tooltip");

    tooltip.append("div")
        .attr("class", "label");

        console.log("data, headers");
        console.log(data[0]);
        console.log(headers);
    parcoords = createParCoords(data, headers);
    parcoords.colorAll = true;

    vc.instGroup.selectAll("circle").on("mouseover", function (d) {
        d.selected = 1;

        tooltip.html(getInstanceStr(d, headers, headersClass));

        var x = parseInt(d3.select(this).attr("cx"));
        var y = parseInt(d3.select(this).attr("cy"));

        tooltip.style("top", (y + 10) + "px")
            .style("left", (x + 10) + "px");

        tooltip.style("display", "block");
        tooltip.transition().duration(150).style("opacity", .9)
        d3.select(this).classed("mouseOver", true);
        colorAll = false;
        parcoords.data(data).alpha(0.7).render();
    });

    vc.instGroup.selectAll("circle").on("mouseout", function (d) {
        if(!d3.select(this).classed("selected")){
            d.selected = false;
        }
        tooltip.transition().duration(150).style("opacity", 0);
        tooltip.style("display", "none");
        d3.select(this)
            .classed("mouseOver", false);

        if(vc.instGroup.selectAll("circle.selected").empty()){
            colorAll = true;
        }
        else{
            colorAll = false;
        }

        parcoords.data(data).alpha(0.7).render();

    });

    vc.instGroup.selectAll("circle").on("click", function (d) {
        d.clickSelected = !d.clickSelected;
        var curInst = d3.select(this);
            curInst.classed("selected", !curInst.classed("selected"))
            ;
        console.log(curInst.classed("selected"));
        console.log(curInst.classList);

        parcoords.data(data).alpha(0.7).render();
    });

    vc.instGroup.selectAll("circle").on("mousemove", function (d) {
        var x = parseInt(d3.select(this).attr("cx"));
        var y = parseInt(d3.select(this).attr("cy"));

        tooltip.style("top", (y + 10) + "px")
            .style("left", (x + 10) + "px");
    });

    return parcoords;
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

createParCoords = function(data, headers){

    //if(parcoords == undefined) {
        console.log("inicializando");
        parcoords = d3.parcoords()("#parc");
    //}
    //else
    //    console.log("já inicializado");


    parcoords
        .data(dm.getParcoordsData())
        .hideAxis(vc.pcHiddenAxes)
        .alpha(0.7)
        .color(function(d){
            //console.log("data on parcoords");
            //console.log(d);
            if (colorAll){
                return vc.colorScheme(d.class);
            }
            else {
                return (d.selected == 1)? vc.colorScheme(d.class): "rgba(100,100,100,0.1)";
            }
        })
        .render()
        .createAxes()
        .reorderable();

    return parcoords;
}
