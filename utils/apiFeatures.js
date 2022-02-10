class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // 1A) Simple filtering
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields']; //игнорируем ['page', 'sort', 'limit', 'fields']
    excludedFields.forEach((el) => delete queryObj[el]);

    // 1B) Advanced filtering (находим все документы, применя фильтры (больше, меньше, больше чем, меньше чем))
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    // 2) Sorting - если было поле sort в запросе, делаем сортировку
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('_id');
    }
    return this;
  }

  limitFields() {
    // 3) Fields limiting - достаем только те свойства, которые мы хотим (например в запросе мы пишем fields=name,duration,difficulty)
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      // Exclude field '__v', adding minus before property: (убираем те поля которые мы не хотим отображать в ответе)
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    // 4) Pagination - тут происходит пагинация
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit); // skip - откинуть кол-во документов с начала, limit - сколько документов показать

    return this;
  }
}

module.exports = APIFeatures;
