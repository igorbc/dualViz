
getSingleModelInfo <- function(modelPath=""){
  if(modelPath == ""){
    return(c())
  }
  else{
    m <- readRDS(modelPath)

    perf <- c(m$modelInfo$label, m$modelInfo$library,
             m$results$Accuracy[1], m$results$Kappa[1],
             length(m$trainingData[,1]))
    names(perf) <- c("label", "library", "accuracy", "kappa", "dataLength")
    perf <- as.data.frame.list(perf)
    cm <- confusionMatrix(m)$table
    dimNames <- attr(cm, "dimnames")$Reference
    #cm <- as.data.frame.list(as.data.frame.matrix(cm))
    cm <- as.data.frame.matrix(cm)
    #names(cm) <- NULL

    ret <- list(perf, cm, dimNames)

    return(ret)

    #ret <- NULL
    #ret$label <- m$modelInfo$label
    #ret$library <- m$modelInfo$library
    #ret$accuracy <- m$results$Accuracy[1]
    #ret$kappa <- m$results$Kappa[1]
    #ret$cm <- confusionMatrix(m)$table
    #return(ret$cm)
  }
}

getModelsInfo <- function(){

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
