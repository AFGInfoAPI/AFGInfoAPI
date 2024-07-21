class TouristicPlace {
  constructor(name, location, type, description, openingHours, entryFee, contactNumber, website) {
    this.name = name;
    this.location = location;
    this.type = type; // E.g., 'Museum', 'Park', 'Historical Site'
    this.description = description;
    this.openingHours = openingHours; // Object with opening hours (e.g., { Monday: "9am-5pm", ... })
    this.entryFee = entryFee; // Entry fee in currency
    this.contactNumber = contactNumber;
    this.website = website;
  }

  static validateEntryFee(entryFee) {
    return entryFee >= 0; // Entry fee should be non-negative
  }

  static validateContactNumber(contactNumber) {
    const re = /^\+?[1-9]\d{1,14}$/; // Basic international phone number validation
    return re.test(contactNumber);
  }

  isValid() {
    return (
      this.name &&
      this.location &&
      this.type &&
      this.description &&
      this.openingHours &&
      TouristicPlace.validateEntryFee(this.entryFee) &&
      TouristicPlace.validateContactNumber(this.contactNumber) &&
      this.website
    );
  }
}

module.exports = TouristicPlace;
