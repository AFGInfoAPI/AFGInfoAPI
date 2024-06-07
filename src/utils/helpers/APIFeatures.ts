class APIFeatures {
  public query: any;
  public queryString: any;
  private cloneQuery: any;
  private searchFields: string[];
  private pipeline: any[];

  constructor(query, queryString, searchFields = []) {
    this.query = query;
    this.queryString = queryString;
    this.cloneQuery = query.clone();
    this.searchFields = searchFields;
    this.pipeline = [];
  }

  public filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search']; // Exclude 'search' from queryObj
    excludedFields.forEach(el => delete queryObj[el]);

    console.log('filter:', queryObj);

    if (this.queryString.search && this.searchFields.length > 0) {
      const regex = new RegExp(this.queryString.search, 'i'); // 'i' makes it case insensitive
      this.pipeline.push({
        $match: {
          $or: this.searchFields.map(field => ({ [field]: regex })),
        },
      });
      console.log('search regex:', regex);
      console.log('search fields:', this.searchFields);
    }

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    if (Object.keys(queryObj).length > 0) {
      this.pipeline.push({ $match: JSON.parse(queryStr) });
    }

    return this;
  }

  public sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.pipeline.push({ $sort: { [sortBy]: 1 } });
    } else {
      this.pipeline.push({ $sort: { createdAt: -1 } });
    }

    return this;
  }

  public limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      const project = fields.split(' ').reduce((acc, field) => {
        acc[field] = 1;
        return acc;
      }, {});
      this.pipeline.push({ $project: project });
    } else {
      this.pipeline.push({ $project: { __v: 0 } });
    }

    return this;
  }

  public paginate() {
    const page = parseInt(this.queryString.page) || 1;
    const limit = parseInt(this.queryString.limit) || 100;
    const skip = (page - 1) * limit;

    this.pipeline.push({ $skip: skip });
    this.pipeline.push({ $limit: limit });

    return this;
  }

  public projectFields(projectObj) {
    if (Object.keys(projectObj).length > 0) {
      this.pipeline.push({ $project: projectObj });
    }
    return this;
  }

  public async getMeta() {
    const total = await this.cloneQuery.countDocuments();
    const per_page = parseInt(this.queryString.limit) || total;
    const total_page = Math.ceil(total / per_page);
    const current_page = parseInt(this.queryString.page) || 1;

    return { total, per_page, total_page, current_page };
  }

  public getPipeline() {
    return this.pipeline;
  }
}

export default APIFeatures;
