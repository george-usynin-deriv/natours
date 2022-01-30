const fs = require('fs');
const express = require('express');
// Logging routes in console
const morgan = require('morgan');

const app = express();
// 1) MIDDLEWARES
// to have access to the request body we should add the next statement:
app.use(express.json());
app.use((req, res, next) => {
  console.log('Hello from the middleware !');
  next();
});
app.use((req, res, next) => {
  req.requestedTime = new Date().toISOString();
  next();
});
app.use(morgan('dev'));

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours.json`, 'utf8'));

// 2) CALLBACKS
//Tours callbacks
const getAllTours = (req, res) => {
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
const getTour = (req, res) => {
  const tour = tours.find((el) => el._id === req.params.id);

  if (!tour)
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};
const updateTour = (req, res) => {
  if (tours.some((tour) => tour._id === req.params.id)) {
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
  } else {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
};
const deleteTour = (req, res) => {
  if (tours.some((tour) => tour._id === req.params.id)) {
    const updatedTours = tours.filter((tour) => tour._id !== req.params.id);
    fs.writeFile(`${__dirname}/dev-data/data/tours.json`, JSON.stringify(updatedTours), (err) => {
      res.status(204).json({
        status: 'success',
        data: null,
      });
    });
  } else {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
};
const createTour = (req, res) => {
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
//Users callbacks
const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route is not defined yet',
  });
};
const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route is not defined yet',
  });
};
const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route is not defined yet',
  });
};
const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route is not defined yet',
  });
};
const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route is not defined yet',
  });
};

// 3) ROUTES
//Mounting multiple routers
const tourRouter = express.Router();
const userRouter = express.Router();
//Tours
tourRouter.route('/').get(getAllTours).post(createTour);
tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);
//Users
userRouter.route('/').get(getAllUsers).post(createUser);
userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/tours', userRouter);
// 4) Listening for requests
const port = 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port} ...`);
});
