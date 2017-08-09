
ml <- function(ds, mlMethod = "rpart", modelPath =""){

  print(modelPath)

  if(is.null(ds)){
    filename <- "file:///Applications/XAMPP/xamppfiles/htdocs/dualViz/inst/www/db/winedata.csv"
    ds <- read.csv(filename, header = TRUE)
  }
  ds <- ds[,!grepl( "confidence|prediction|mouseOver" , names(ds))]
  ind <- !grepl( "class" , names(ds))
  ds[,ind] <- sapply(ds[,ind], as.numeric)
  library(caret)

  colnames(ds)[length(colnames(ds))] <- "class"
  ds$class <- factor(ds$class)

  index <- createDataPartition(ds$class, p=0.80, list=FALSE)

  testset <- ds[-index,]
  trainset <- ds[index,]

  fitControl <- trainControl(## 10-fold CV
    method = "repeatedcv",
    number = 10,
    ## repeated ten times
    repeats = 10)
  print("Training model")
  #m <- train(class ~., method = mlMethod, data=trainset, trControl=fitControl, verbose = FALSE)

  if(modelPath == ""){
    m <- train(class ~., method = mlMethod, data=trainset)
    saveRDS(m, file = "m1.rds")
  }
  else{
    #u <- url(modelPath)
    #modelPath <- summary(u)$description
    #m <- train(class ~., method = mlMethod, data=trainset)
    m <- readRDS(modelPath)
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

  print("root dir")
  print(dir())
  print(".. dir")
  print(dir(".."))
  print("../.. dir")
  print(dir("../.."))

  return(result)
}
