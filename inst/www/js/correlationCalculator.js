function CorrelationMatrix(attributeNames){
  let matrix = [];

  attributeNames.forEach(function(){
    matrix.push(Array(attributeNames.length));
  })

  let cm = {
    add: function(i, j, correlation){
      matrix[i][j] = correlation;
      return cm;
    },

    getCorrelationMatrix: function(){
      let finishedMatrix = [];
      finishedMatrix.push([''].concat(attributeNames));
      attributeNames.forEach(function(attributeName, i){
        finishedMatrix.push([attributeName].concat(matrix[i]));
      });
      return finishedMatrix;
    },

    getCorrelationMatrixCsv: function(){
      let finishedMatrix = cm.getCorrelationMatrix();
      let csv = '';
      finishedMatrix.forEach(function(row){
        row.forEach(function(cell){
            csv += cell + ','
        });
        csv += '\n'
      });

      return csv.slice(0, -2);
    }
  };
  return cm;
}

function getCorrelationMatrix(data, attributeNames) {
  let dataArray;
  let cm = new CorrelationMatrix(attributeNames);

  for(let i = 0; i < attributeNames.length; i++){
    for(let j = 0; j < attributeNames.length; j++){
      dataArray = getDataArray(
        data,
        attributeNames[i],
        attributeNames[j]
      );
      let correlation = pearsonCorrelation(dataArray, 0, 1);
      cm.add(i, j, correlation)
      let format = getFormat(correlation);
      console.log(
        'correlation between ' + attributeNames[i] + ' and ' + attributeNames[j]);
      console.log('%c' + correlation, format);
    }
  }
  return cm;
}

function getFormat(correlation){
  let format;
  if (correlation >= .7 || correlation <= -.7)
    format = 'color: green; font-weight: bold';
  else if (correlation >= .5 || correlation <= -.5)
    format = 'color: green';
  else
    format = 'color: gray';

  return format;
}

function getDataArray(data, dim1, dim2) {
  let dataArray = []
  dataArray.push(
    data.map(function(d){
      return +d[dim1];
    })
  );
  dataArray.push(
    data.map(function(d){
      return +d[dim2];
    })
  );
  return dataArray;
}
