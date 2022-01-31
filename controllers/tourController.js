const Tour = require('../models/tourModel');

exports.checkBody = (req, res, next) => {
  if (!req.body.hasOwnProperty('name') || !req.body.hasOwnProperty('price')) {
    return res.status(400).json({
      status: 'fail',
      message: 'Bad Request',
    });
  }
  next();
};

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestedTime,
    // results: tours.length,
    // data: {
    //   tours,
    // },
  });
};
//get using query params (:id) to make optional: (:id?) add question mark in the end of the query parameter
exports.getTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      // tour,
    },
  });
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      // tour: updatedTours.find((el) => el._id === req.params.id),
    },
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

exports.createTour = (req, res) => {
  res.status(201).json({
    status: 'success',
    data: {
      // tour: newTour,
    },
  });
};
