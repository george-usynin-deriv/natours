const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');

const tourSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      // min and max length validator
      minlength: [10, 'The tour must have at least 10 characters'],
      maxlength: [40, 'The tour must have at most 40 characters'],
      // validate: [validator.isAlpha, 'The tour name should contain only alpha characters'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      // enum used only for strings
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'A tour must have a difficulty: easy, medium, difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Average rating must be above 1.0'],
      max: [5, 'Average rating must be below 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      //custom valifator
      validate: {
        validator: function (val) {
          return this.price > val;
        },
        message: 'Price discount ({VALUE}) should be less then the current price',
      },
    },
    summary: {
      type: String,
      required: [true, 'A tour must have a summary'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      //to avoid selection in response 'createdAt' field:
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
// виртуальные свойства можно высчитывать из оригинальных свойств модели
// с ними нельзя опрерировать через базу данных, так как они в нее не записываются
// виртуальное свойство отображается в response

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// DOCUMENT MIDDLEWARE: run before .save() and .create()

tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre('save', function (next) {
//   console.log('Will save document');
//   next();
// });

// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE:

// перед выполнением запроса мы отсеиваем секретные туры (это будет работать для всех запрсов начинающихся с find:
// find
// findOne
// findOneAndDelete
// findOneAndRemove
// findOneAndReplace
// findOneAndUpdate

tourSchema.pre(/^find/, function (next) {
  // tourSchema.pre('find', function (next) { - обрабатывается только find
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

// tourSchema.post(/^find/, function (docs, next) {
//   console.log(`Execution time: ${Date.now() - this.start}`);
//   next();
// });

// AGGREGATION MIDDLEWARE:

// not aggregate stats for secret tours:
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
