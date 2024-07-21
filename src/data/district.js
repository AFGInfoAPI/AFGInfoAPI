class District {
  constructor(name, province, area, population, gdp, location, googleMapUrl, description, images, status) {
    this.name = name;
    this.province = province;
    this.area = area;
    this.population = population;
    this.gdp = gdp;
    this.location = location;
    this.googleMapUrl = googleMapUrl;
    this.description = description;
    this.images = images;
    this.status = status;
  }

  static validateLocation(location) {
    return location && location.type === 'Point' && Array.isArray(location.coordinates) && location.coordinates.length === 2;
  }

  isValid() {
    return (
      this.name &&
      this.province &&
      this.area > 0 &&
      this.population > 0 &&
      this.gdp > 0 &&
      this.location &&
      District.validateLocation(this.location) &&
      this.googleMapUrl &&
      this.description &&
      Array.isArray(this.images) &&
      this.images.length > 0
    );
  }
}

module.exports = District;
