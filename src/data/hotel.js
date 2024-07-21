class Hotel {
  constructor(name, location, rating, numberOfRooms, amenities, contactNumber, website) {
    this.name = name;
    this.location = location;
    this.rating = rating;
    this.numberOfRooms = numberOfRooms;
    this.amenities = amenities;
    this.contactNumber = contactNumber;
    this.website = website;
  }

  static validateRating(rating) {
    return rating >= 1 && rating <= 5; // Assuming a rating scale from 1 to 5
  }

  static validateContactNumber(contactNumber) {
    const re = /^\+?[1-9]\d{1,14}$/; // Basic international phone number validation
    return re.test(contactNumber);
  }

  isValid() {
    return (
      this.name &&
      this.location &&
      Hotel.validateRating(this.rating) &&
      this.numberOfRooms > 0 &&
      Array.isArray(this.amenities) &&
      Hotel.validateContactNumber(this.contactNumber) &&
      this.website
    );
  }
}

module.exports = Hotel;
