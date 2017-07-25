
mlRpart <- function(ds){
  if(is.null(ds)){
    filename <- "file:///Applications/XAMPP/xamppfiles/htdocs/dualViz/inst/www/db/winedata.csv"
    ds <- read.csv(filename, header = TRUE)
  }

  #dsg <- as.list(as.data.frame(t(ds)))

  #return(dsg)
  ds <- ds[,!grepl( "confidence|prediction|mouseOver" , names(ds))]
  ind <- !grepl( "class" , names(ds))
  ds[,ind] <- sapply(ds[,ind], as.numeric)
  library(caret)

  #return(ds)

  colnames(ds)[length(colnames(ds))] <- "class"
  ds$class <- factor(ds$class)

  index <- createDataPartition(ds$class, p=0.80, list=FALSE)

  testset <- ds[-index,]
  trainset <- ds[index,]

  #return(trainset)
  model.rpart <- train(class ~., method = "rpart", data=trainset)


  predictions <- predict(object = model.rpart$finalModel,newdata = testset[,1:length(colnames(trainset)) - 1],type="prob")
  predictions_class <- predict(object = model.rpart$finalModel,newdata = testset[,1:length(colnames(trainset)) - 1],type="class")

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
