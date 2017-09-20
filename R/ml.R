#' @importFrom caret createDataPartition train getModelInfo trainControl
#' @importFrom stats predict
#' @importFrom utils read.csv


ml <- function(ds, mlMethod = "rpart", modelPath = "", splitRatio = 0.80){

  set.seed(42)

  if(is.null(ds)){
    filename <- "file:///Applications/XAMPP/xamppfiles/htdocs/dualViz/inst/www/db/iris_original.csv"
    ds <- read.csv(filename, header = TRUE)
  }

  ds <- ds[,!grepl( "confidence|prediction|selected|clickSelected" , names(ds))]
  ind <- !grepl( "class" , names(ds))
  ds[,ind] <- sapply(ds[,ind], as.numeric)

  colnames(ds)[length(colnames(ds))] <- "class"
  ds$class <- factor(ds$class)

  index <- createDataPartition(ds$class, p=splitRatio, list=FALSE)

  testset <- ds[-index,]
  trainset <- ds[index,]

  fitControl <- trainControl(## 10-fold CV
    method = "repeatedcv",
    number = 10,
    ## repeated ten times
    repeats = 2)

  #m <- train(class ~., method = mlMethod, data=trainset, trControl=fitControl, verbose = FALSE)

  if(modelPath == ""){
    #m <- train(class ~., method = mlMethod, data=trainset)
    m <- train(class ~., method = mlMethod, data=trainset, trControl=fitControl, tuneLength=3)
    saveRDS(m, file = paste(mlMethod, ".rds", sep=""))
  }
  else{
    m = NULL
    m <- readRDS(modelPath)
    print("loaded model was used.")
  }

  predictions <- predict(object = m$finalModel,newdata = testset[,1:length(colnames(trainset)) - 1],type="prob")
  predictions_class <- predict(object = m$finalModel,newdata = testset[,1:length(colnames(trainset)) - 1],type="class")

  cn <- colnames(predictions)
  for(i in 1:length(cn)){
         cn[i] <- paste(sep="", "confidence(", cn[i], ")")
  }

  colnames(predictions) <- cn

  result <- merge(testset, predictions, by=0, all=TRUE)
  result <- result[order(nchar(result$Row.names), result$Row.names), ]
  result[, "prediction(class)"] <- predictions_class
  result[, "Row.names"] <- NULL

  return(result)
}

useModel <- function(ds, modelPath){
  set.seed(42)

  if(is.null(ds)){
    filename <- "file:///Applications/XAMPP/xamppfiles/htdocs/dualViz/inst/www/db/winedata.csv"
    ds <- read.csv(filename, header = TRUE)
  }

  ds <- ds[,!grepl( "confidence|prediction|selected|clickSelected" , names(ds))]
  ind <- !grepl( "class" , names(ds))
  ds[,ind] <- sapply(ds[,ind], as.numeric)

  colnames(ds)[length(colnames(ds))] <- "class"
  ds$class <- factor(ds$class)

  m = NULL
  m <- readRDS(modelPath)
  print("loaded model was used.")

  predictions <- predict(object = m$finalModel, newdata = ds[,1:length(colnames(ds)) - 1],type="prob")
  predictions_class <- predict(object = m$finalModel, newdata = ds[,1:length(colnames(ds)) - 1],type="class")

  cn <- colnames(predictions)
  for(i in 1:length(cn)){
    cn[i] <- paste(sep="", "confidence(", cn[i], ")")
  }

  colnames(predictions) <- cn

  result <- merge(ds, predictions, by=0, all=TRUE)
  result <- result[order(nchar(result$Row.names), result$Row.names), ]
  result[, "prediction(class)"] <- predictions_class
  result[, "Row.names"] <- NULL

  return(result)
}
