const fs = require('fs');

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours.json`, 'utf8'));

exports.checkID = (req, res, next, val) => {
  if (!tours.some((tour) => tour._id === req.params.id)) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  if (req.body.hasOwnProperty('name') && req.body.hasOwnProperty('price')) {
    next();
  } else {
    return res.status(400).json({
      status: 'fail',
      message: 'Bad Request',
    });
  }
};

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestedTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};
//get using query params (:id) to make optional: (:id?) add question mark in the end of the query parameter
exports.getTour = (req, res) => {
  const tour = tours.find((el) => el._id === req.params.id);

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

exports.updateTour = (req, res) => {
  const updatedTours = tours.map((tour) => {
    if (tour._id === req.params.id) {
      tour.duration = req.body.duration;
    }
    return tour;
  });
  fs.writeFile(`${__dirname}/dev-data/data/tours.json`, JSON.stringify(updatedTours), (err) => {
    res.status(200).json({
      status: 'success',
      data: {
        tour: updatedTours.find((el) => el._id === req.params.id),
      },
    });
  });
};

exports.deleteTour = (req, res) => {
  const updatedTours = tours.filter((tour) => tour._id !== req.params.id);
  fs.writeFile(`${__dirname}/dev-data/data/tours.json`, JSON.stringify(updatedTours), (err) => {
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
};

exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1]._id + 'x';
  const newTour = Object.assign({ _id: newId }, req.body);
  tours.push(newTour);

  fs.writeFile(`${__dirname}/dev-data/data/tours.json`, JSON.stringify(tours), (err) => {
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  });
};
