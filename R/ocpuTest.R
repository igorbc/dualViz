
saveOrLoadModel <- function(theFile, modelPaths, justPaths){

    ds <- read.csv(theFile, TRUE)
    index <- createDataPartition(ds$class, p=0.80, list=FALSE)
    testset <- ds[-index,]
    trainset <- ds[index,]

    m1 <- NULL
    m1 <- train(class ~., method = "rpart", data=trainset)

    print("wd")
    print(getwd())

    if(length(modelPaths) == 0){


        # the file is saved normally
        saveRDS(m1, file = "m1.rds")

        # this works too
        #save(m1, file="m1.rds")
        return("saved")
    }
    else{
        # neither work...
        l <- list()
        for(p in modelPaths){
          l <- c(l,paste(p, file.exists(p)))
        }

        l2 <- list()
        for(p in justPaths){
          l2 <- c(l2,paste(p, dir(p)))
        }

        #return(list(l, l2))



        m1 <- readRDS(modelPaths[13])

        predictions <- predict(object = m1$finalModel,newdata = testset[,1:length(colnames(trainset)) - 1],type="class")
        return(predictions)
    }
}
