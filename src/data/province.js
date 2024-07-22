// province.js
class Province {
  constructor(
    en_name,
    dr_name,
    ps_name,
    area,
    population,
    gdp,
    location,
    googleMapUrl,
    en_capital,
    dr_capital,
    ps_capital,
    en_description,
    dr_description,
    ps_description,
    images,
    status,
    hasPending,
  ) {
    this.en_name = en_name;
    this.dr_name = dr_name;
    this.ps_name = ps_name;
    this.area = area;
    this.population = population;
    this.gdp = gdp;
    this.location = location;
    this.googleMapUrl = googleMapUrl;
    this.en_capital = en_capital;
    this.dr_capital = dr_capital;
    this.ps_capital = ps_capital;
    this.en_description = en_description;
    this.dr_description = dr_description;
    this.ps_description = ps_description;
    this.images = images;
    this.status = status;
    this.hasPending = hasPending;
  }

  static validateLocation(location) {
    // Basic validation to ensure location object has type and coordinates
    return location && location.type === 'Point' && Array.isArray(location.coordinates) && location.coordinates.length === 2;
  }

  isValid() {
    return (
      this.en_name &&
      this.dr_name &&
      this.ps_name &&
      this.area > 0 &&
      this.population > 0 &&
      this.gdp > 0 &&
      this.location &&
      Province.validateLocation(this.location) &&
      this.googleMapUrl &&
      this.en_capital &&
      this.dr_capital &&
      this.ps_capital &&
      this.en_description &&
      this.dr_description &&
      this.ps_description &&
      Array.isArray(this.images) &&
      this.images.length > 0
    );
  }
}

module.exports = Province;
