# DualViz

*DualViz* is a visualization tool that can be used to explore data based on its attributes and also to explore the results from a classification task.

## Setup
1. Clone project
2. Download and install *R*
3. Donwload and install *RStudio*
4. Open project on *RStudio*
5. Install `caret` and its dependencies
6. Install `opencpu` and its dependencies
7 Install `httpuv` and its dependencies
 - On *MacOS* make sure to run`xcode-select --install` to enable `httpuv` installation

## Run locally
1. On *RStudio*, open the project
2. Go to *Build > Install and Restart*
3. Run `library(opencpu)` on the *RStudio* console
4. Run `ocpu_start_server()`
5. On the browser, go to `http://localhost:5656/ocpu/library/dualViz`
