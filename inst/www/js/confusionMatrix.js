/*
createConfusionMatrix contains code from tabulate.js by Shawn Allen (@shawnbot)
created by shiyan on 9/13/15 and with minor modification by Lynn.
*/

function displaycm(){
    if(this.textContent.charCodeAt(0) == "9660"){
        document.getElementById("statusBar").style.height = "18px";
        this.innerHTML= "&#9650";
    }
    else{
        document.getElementById("statusBar").style.height = "200px";
        this.innerHTML = "&#9660";
    }
}

function createConfusionMatrix(data){
    d3.selectAll("#confMatrix table").remove();
    var table = d3.select("#confMatrix").append("table");
    var thead = table.append("thead");
    var tbody = table.append("tbody");
    var colorScale = d3.scale.linear()
        .domain([0, 1])
        .range(["white", "blue"]);

    data = data.map(function(d){
                //delete(d["_row"]);
                return d;
            });
    var columns = Object.keys(data[0]);
    columns = [columns.pop()].concat(columns);

    //var sums = new Array(columns.length - 1).fill(0);
    var sums = {};
    columns.forEach(function(d){
        sums[d] = 0;
    });
    data.forEach(function(d){
        for(var i = 1; i < columns.length; i++){
            sums[columns[i]] += d[columns[i]];
        }
    });

    thead.append("tr")
        .selectAll("th")
        .data(columns)
        .enter()
        .append("th")
        .text(function(column) {
                if(column == "_row")
                    return "";
                else {
                    return column;
                }});

    var rows = tbody.selectAll("tr")
        .data(data)
        .enter()
        .append("tr");

    var cells = rows.selectAll("td")
        .data(function(row) {
            // he does it this way to guarantee you only use the
            // values for the columns you provide.
            return columns.map(function(column) {
                // return a new object with a value set to the row's column value.
                return {value: row[column],
                        column: column};
            });
        })
        .enter()
        .append("td")
        .style("background-color", function(d){
            if(typeof(d.value) === "string")
                return "white";
            else{
                //console.log(d.column);
                //console.log(d.value);
                //console.log(colorScale(d.value));
                return colorScale(d.value/sums[d.column]);
            }

        })
        .text(function(d) {

                if(typeof(d.value) === "string"){
                    return d.value;
                }
                else {
                    return Math.round(d.value*100)/100;
                }
            });
            
    document.getElementById("confMatrixContainer").classList.add("enabled");
    return table;
}
