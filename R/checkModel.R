checkModel <- function(rdsUrl){
  library(caret)

  warning(getwd())

  print(getwd())

  print("--- type of rdsurl ---")
  print(typeof(rdsUrl))
  print(rdsUrl)

  theUrl <- url(rdsUrl)
  print("-- url --")
  print(theUrl)
  print("-- typeof url --")
  print(typeof(theUrl))

  uncomp <- gzcon(theUrl)
  print("-- uncomp --")
  print(uncomp)
  print("-- typeof uncomp --")
  print(typeof(uncomp))

  print("........")

  #download.file(url=rdsUrl, destfile = "mm.rds", method="auto", mode="wb")
  #m <- readRDS(uncomp)

  #model.rpart <- train(class ~., method = "rpart", data=trainset)
}
