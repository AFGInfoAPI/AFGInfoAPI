class Airport {
  constructor(name, code, location, runways, airlines, contactNumber, website) {
    this.name = name;
    this.code = code;
    this.location = location;
    this.runways = runways;
    this.airlines = airlines;
    this.contactNumber = contactNumber;
    this.website = website;
  }

  static validateCode(code) {
    const re = /^[A-Z0-9]{3,4}$/; // Common airport code validation (IATA/ICAO)
    return re.test(code);
  }

  static validateContactNumber(contactNumber) {
    const re = /^\+?[1-9]\d{1,14}$/; // Basic international phone number validation
    return re.test(contactNumber);
  }

  isValid() {
    return (
      this.name &&
      this.code &&
      Airport.validateCode(this.code) &&
      this.location &&
      Array.isArray(this.runways) &&
      this.runways.length > 0 &&
      Array.isArray(this.airlines) &&
      this.airlines.length > 0 &&
      Airport.validateContactNumber(this.contactNumber) &&
      this.website
    );
  }
}

module.exports = Airport;
