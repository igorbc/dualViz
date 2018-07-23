/**
 * Created by igorcorrea on 03/12/2015.
 */

addSvgLegend = function(classNames, svgContainer) {
    svgContainer.selectAll("classLegendRect")
        .data(classNames)
        .enter()
        .append("rect")
        .attr("class", "classLegendRect legendRect")
        .attr("id", function(d){return "id" + d;})
        .attr("y", function(d, i) {
            return 30 + 30*i
        })
        .style("fill", function(d){return vc.colorScheme(d)});

    var classificationColorData = Object.keys(vc.classificationColor)
        .map(function(key){
            return vc.classificationColor[key];
        });

    vc.confusionColorsLegend = svgContainer.append("g");
    vc.confusionColorsLegend
      .attr('id', 'confusion-color-legend')
      .attr('class', 'invisibleWhenDisabled');
    vc.confusionColorsLegend.selectAll("legendRect")
        .data(classificationColorData)
        .enter()
        .append("rect")
        .attr("class", "legendRect")
        .attr("y", function(d, i) {return 30 + 30*i})
        .attr("x", sa.svgWidth - 32)
        .style("fill", function(d){return d.color})
        .on("click", function(classificationColorData){
            var elements = vc.instGroup.selectAll("circle")
                .filter(function(d){
                    return d.classificationResult == classificationColorData.sName
                });

            selectUnselectPoints(elements);
        });

    vc.confusionColorsLegend.selectAll("legendText")
        .data(classificationColorData)
        .enter()
        .append("text")
        .attr("class", "noselect legendText crosshair")
        .attr("x", sa.svgWidth - 55)
        .attr("y", function(d, i) {return 45 + 30*i})
        .text(function(d){return d.sName;})
        /*
        .on("click", function(d){
            //console.log("click");
            //console.log(d3.select("#id" + d));
            if(vc.confusionClass == 0){
                vc.confusionClass = d;
                d3.select("#id" + d).attr("selected", true);
            }
            else if(vc.confusionClass == d){
                vc.confusionClass = 0;
                d3.select("#id" + d).attr("selected", false);
            }
            else{
                d3.select("#id" + vc.confusionClass).attr("selected", false);
                vc.confusionClass = d;
                d3.select("#id" + d).attr("selected", true);
            }
            vc.updateColor(sa.delay);
        });
*/
    svgContainer.selectAll("legendText")
        .data(classNames)
        .enter()
        .append("text")
        .attr("class", "noselect legendText crosshair")
        .attr("x", 30)
        .attr("y", function(d, i) {
            return 45 + 30*i
        })
        .text(function(d){ return d;})

        var menu = [{
            name: 'Select/unselect',
            //img: 'images/delete.png',
            title: 'Select or unselect points of this class',
            fun: function (d) {
                className = d.trigger[0].__data__;
                var elements = vc.instGroup.selectAll("circle")
                    .filter(function(d){return d.class == className})

                selectUnselectPoints(elements);
            }
        },
        {
            name: 'Toggle confusion colors',
            //img: 'images/create.png',
            title: 'Color points according to how they were classified.',
            fun: function(d){
                d = d.trigger[0].__data__;
                console.log(d);
                if(vc.confusionClass == 0){
                    vc.confusionClass = d;
                    d3.select("#id" + d).attr("selected", true);
                    document.getElementById('confusion-color-legend').classList.add('enabled');
                }
                else if(vc.confusionClass == d){
                    vc.confusionClass = 0;
                    d3.select("#id" + d).attr("selected", false);
                    document.getElementById('confusion-color-legend').classList.remove('enabled');
                }
                else{
                    d3.select("#id" + vc.confusionClass).attr("selected", false);
                    vc.confusionClass = d;
                    d3.select("#id" + d).attr("selected", true);
                    document.getElementById('confusion-color-legend').classList.remove('enabled');
                }
                vc.updateColor(sa.delay);
            }
        },
        {
            name: "Cancel",
            title: "Cancel",
            fun: null
        }];
    $('.classLegendRect').contextMenu(menu, {triggerOn: "click", mouseClick: "left", closeOnClick: "true"});

}

selectUnselectPoints = function(elements){
    if(elements.filter(".selected").data().length ==
       elements.data().length){
        elements.classed("selected", false);
        elements.each(function(d, i){
            d.selected = 0;
        });
    }
    else{
        elements.classed("selected", true);
        elements.each(function(d, i){
            d.selected = 1;
        });
    }
    parcoords.data(dm.data).alpha(0.7).render();
}
