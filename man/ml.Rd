\name{ml}
\alias{ml}
\title{Machine Learning}
\usage{
ml(ds, mlMethod, modelPath, splitRatio = 0.80)
}
\arguments{
  \item{ds}{The dataset.}
  \item{mlMethod}{String determining the carte method to be used to traing a model based on dataset (defaul value is "").}
  \item{modelPath}{Path to a previously saved .rds machine learning model.}
  \item{splitRatio}{A number within [0, 1]. splitRatio percent will be used for training and 1 - splitRatio for testing.}
}
\description{
Uses the ds to train a model based on mlMethod. If a modelPath is provided the data in ds is classified by applying this pre-trained model.
}

