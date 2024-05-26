class APIFeatures {
  public query: any;
  public queryString: any;
  private cloneQuery: any;

  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
    this.cloneQuery = query.clone();
  }

  public filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    this.cloneQuery = this.query.clone();

    return this;
  }

  public sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
      this.cloneQuery = this.query.clone();
    } else {
      this.query = this.query.sort('-createdAt');
      this.cloneQuery = this.query.clone();
    }

    return this;
  }

  public limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  public paginate() {
    const page = parseInt(this.queryString.page) || 1;
    const limit = parseInt(this.queryString.limit) || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }

  public async getMeta() {
    const total = await this.cloneQuery.countDocuments();
    const per_page = parseInt(this.queryString.limit) || total;
    const total_page = Math.ceil(total / per_page);
    const current_page = parseInt(this.queryString.page) || 1;

    return { total, per_page, total_page, current_page };
  }
}

export default APIFeatures;
