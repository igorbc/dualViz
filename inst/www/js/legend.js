/**
 * Created by igorcorrea on 03/12/2015.
 */

addSvgLegend = function(classNames, svgContainer) {
    svgContainer.selectAll("legendRect")
        .data(classNames)
        .enter()
        .append("rect")
        .attr("class", "legendRect")
        .attr("id", function(d){return "id" + d;})
        .attr("y", function(d, i) {
            return 30 + 30*i
        })
        .style("fill", function(d){return vc.colorScheme(d)})
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

    svgContainer.selectAll("legendText")
        .data(classNames)
        .enter()
        .append("text")
        .attr("class", "legendText")
        .attr("x", 30)
        .attr("y", function(d, i) {
            return 45 + 30*i
        })
        .text(function(d){ return d;})
}
