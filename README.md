# DualViz

*DualViz* is a visualization tool that can be used to explore data based on its attributes and also to explore the results from a classification task.

## Setup
1. Clone project
- Download and install *R*
- Donwload and install *RStudio*
- Open project on *RStudio*
- Install `caret` and its dependencies
- Install `opencpu` and its dependencies
- Install `httpuv` and its dependencies
 - On *MacOS* make sure to run`xcode-select --install` to enable `httpuv` installation

## Run locally
1. On *RStudio*, open the project
- Go to *Build > Install and Restart*
- Run `library(opencpu)` on the *RStudio* console
- Run `ocpu_start_server()`
- On the browser, go to `http://localhost:5656/ocpu/library/dualViz`
