class Hospital {
  constructor(name, location, numberOfBeds, specialty, contactNumber, address, website) {
    this.name = name;
    this.location = location;
    this.numberOfBeds = numberOfBeds;
    this.specialty = specialty;
    this.contactNumber = contactNumber;
    this.address = address;
    this.website = website;
  }

  static validateContactNumber(contactNumber) {
    const re = /^\+?[1-9]\d{1,14}$/; // Basic international phone number validation
    return re.test(contactNumber);
  }

  isValid() {
    return (
      this.name &&
      this.location &&
      this.numberOfBeds > 0 &&
      this.specialty &&
      Hospital.validateContactNumber(this.contactNumber) &&
      this.address &&
      this.website
    );
  }
}

module.exports = Hospital;
