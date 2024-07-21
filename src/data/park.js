class Park {
  constructor(name, location, size, facilities, openingHours, contactNumber, website) {
    this.name = name;
    this.location = location;
    this.size = size; // Size in square meters
    this.facilities = facilities; // Array of facilities available in the park
    this.openingHours = openingHours; // Object with opening hours (e.g., { Monday: "8am-6pm", ... })
    this.contactNumber = contactNumber;
    this.website = website;
  }

  static validateSize(size) {
    return size > 0; // Size should be greater than 0
  }

  static validateContactNumber(contactNumber) {
    const re = /^\+?[1-9]\d{1,14}$/; // Basic international phone number validation
    return re.test(contactNumber);
  }

  isValid() {
    return (
      this.name &&
      this.location &&
      Park.validateSize(this.size) &&
      Array.isArray(this.facilities) &&
      this.facilities.length > 0 &&
      typeof this.openingHours === 'object' &&
      Park.validateContactNumber(this.contactNumber) &&
      this.website
    );
  }
}

module.exports = Park;
