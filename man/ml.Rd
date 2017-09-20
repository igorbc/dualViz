\name{ml}
\alias{ml}
\title{Machine Learning}
\usage{
ml(ds, mlMethod, modelPath = "", splitRatio = 0.80)
}
\arguments{
  \item{ds}{The dataset.}
  \item{mlMethod}{String determining the 'caret' method to be used to traing a model based on dataset.}
  \item{modelPath}{Path to a previously saved \code{.rds} machine learning model.}
  \item{splitRatio}{A number within [0, 1]. \code{splitRatio} percent will be used for training and \code{1 - splitRatio} for testing.}
}
\description{
Uses the \code{ds} to train a model based on \code{mlMethod}. If a \code{modelPath} is provided the data in \code{ds} is classified by applying this pre-trained model.
}

