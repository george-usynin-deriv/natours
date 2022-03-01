const express = require('express');
const authController = require('../controllers/authController');
const tourController = require('../controllers/tourController');

const router = express.Router();

// We can add our own middleware for requested parameters (router.param)
// router.param('id', tourController.checkID);

router.route('/top-5-cheap').get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);

router.route('/month-plan/:year').get(tourController.getMonthPlan);

router.route('/').get(authController.protect, tourController.getAllTours).post(tourController.createTour);
router.route('/:id').get(tourController.getTour).patch(tourController.updateTour).delete(tourController.deleteTour);

module.exports = router;
