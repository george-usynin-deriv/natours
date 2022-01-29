const fs = require('fs');
const express = require('express');

const app = express();

// to have access to the request body we should add the next statement:
app.use(express.json());

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours.json`, 'utf8'));

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

//get using query params (:id) to make optional: (:id?) add question mark in the end of the query parameter
app.get('/api/v1/tours/:id', (req, res) => {
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
});

app.patch('/api/v1/tours/:id', (req, res) => {
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
});

app.post('/api/v1/tours', (req, res) => {
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
});

// listening for requests
const port = 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port} ...`);
});
