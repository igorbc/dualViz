# Notes

## Table of contents
__Dual Radviz in action__  
__Examples classified with low confidence__  
__Examples misclassfied with high confidence__  
__Selecting data__  
__Confusion colors__  
__Disabling dimensions__  
__Multiclass partial dependency plots__  

### Dual Radviz in action
Show how the visualization corresponds to the data distribuition on the attributes-based RadViz and how the classification results are reflected by the spatial distribuition of examples on the class-based RadViz.

__Data__
- _check_

__Algorithm__
- _check_

### Examples classified with low confidence
Show how one can easily visualize examples classified with low confidence.  
__Data__
- vcd

__Algorithm__
- _check_

### Examples misclassfied with high confidence
Show how one can easily visualize examples misclassified with high confidence.  
__Data__
- vcd

__Algorithm__
- _check_

### Selecting data
Show how selection of examples can be easily made on DualRadviz and that this is reflected on Parallel Coordinates Visualization.  
__Data__
- any (preferably some that has instances of interest)

__Algorithm__
- _check_

### Confusion colors
Show the confusion colors scheme and how it can be helpful in clarifying the results, in case the class-based RadViz isn't clear.  
__Data__
- vcd

__Algorithm__
- _check_

#### Star Coordinates visualization
As sometimes it is prefered to used Star Coordinates _(look up the paper to justify this claim)_, one can use Star Coordinates and still check the classification results, as the confusion color option is available.

__Data__
- vcd

__Algorithm__
- _check_

### Multiclass partial dependency plots
Show how this can expose the influence of one dimension on the classification.
#### Varying attributes
Show how the RadViz visualization dynamically updates and reflect the changes on when varying an attribute value for selected examples.
##### Disabling dimensions
Show that if by varying a dimension the final classification is not changed, the dimension may be discarded.  
One could also discard the dimension if its partial dependency plot is similar to some other dimension. By observing this, the user could also check for correlation by using Star Coordinates visualization with only the two dimensions in question enabled, which is equivalent to a normalized scatterplot.
