const Tour = require('../models/tourModel');

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
