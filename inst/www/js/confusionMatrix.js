/*
createConfusionMatrix contains code from tabulate.js by Shawn Allen (@shawnbot)
created by shiyan on 9/13/15 and with minor modification by Lynn.
*/

function createConfusionMatrix(data){
    var table = d3.select("#confMatrixContainer").append("table");
    var thead = table.append("thead");
    var tbody = table.append("tbody");

    data = data.map(function(d){
                delete(d["_row"]);
                return d;
            });
    var columns = [""].concat(Object.keys(data[0]));

    thead.append("tr")
        .selectAll("th")
        .data(columns)
        .enter()
        .append("th")
        .text(function(column) { return column; });

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
                return {value: row[column]};
            });
        })
        .enter()
        .append("td")
        .text(function(d) { return d.value; });
    return table;
}
