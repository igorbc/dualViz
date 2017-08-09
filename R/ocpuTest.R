
saveOrLoadModel <- function(modelPath){
    library(caret)
    filename <- "file:///Applications/XAMPP/xamppfiles/htdocs/dualViz/inst/www/db/iris_original.csv"
    ds <- read.csv(filename, header = TRUE)
    index <- createDataPartition(ds$class, p=0.80, list=FALSE)
    testset <- ds[-index,]
    trainset <- ds[index,]

    modelPath <- "/Users/igorcorrea/Desktop/m1.rds"

    m1 <- NULL
    m1 <- train(class ~., method = "rpart", data=trainset)
    if(modelPath == ""){


        # the file is saved normally
        saveRDS(m1, file = "m1.rds")

        # this works too
        #save(m1, file="m1.rds")
    }
    else{
        # neither work...
        print("omg???")
        m1 <- readRDS(modelPath)

        #load(modelPath)
    }

    predictions <- predict(object = m1$finalModel,newdata = testset[,1:length(colnames(trainset)) - 1],type="class")

    # print("root dir")
    # print(dir())
    # print(".. dir")
    # print(dir(".."))
    # print("../.. dir")
    # print(dir("../.."))
    # print("../../.. dir")
    # print(dir("../../.."))
    # print("../../../.. dir")
    # print(dir("../../../.."))
    #
    # print("wd")
    # print(getwd())

    return(predictions)
}
