
getModelsInfo <- function(){

  library(caret)
  modelInfo <- getModelInfo()

  j <- 1

  name <- c()
  label <- c()
  params <- list()
  for(i in 1:length(modelInfo)){

    theModel <- getElement(modelInfo[i], names(modelInfo[i]))

    if("Classification" %in% theModel$type){
      #print(names(modelInfo[i]))
      name[j] <- names(modelInfo[i])
      label[j] <- theModel$label
      #print(typeof(theModel$parameters))
      #print(theModel$parameters)
      #params[[j]] <- as.data.frame(theModel$parameters)
      params[[j]] <- theModel$parameters
      j <- j + 1
    }
  }

  info <- data.frame(name, label)
  fullInfo <- list(info, params)
  return(fullInfo)
}
