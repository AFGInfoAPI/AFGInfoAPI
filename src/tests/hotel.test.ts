const Hotel = require('../data/hotel'); // Adjust the path if needed

describe('Hotel Model', () => {
  it('should create a hotel with all required fields', () => {
    const hotel = new Hotel('Grand Hotel', 'City Center', 4, 100, ['WiFi', 'Pool', 'Spa'], '+1234567890', 'https://grandhotel.example.com');

    expect(hotel.name).toEqual('Grand Hotel');
    expect(hotel.location).toEqual('City Center');
    expect(hotel.rating).toEqual(4);
    expect(hotel.numberOfRooms).toEqual(100);
    expect(hotel.amenities).toEqual(['WiFi', 'Pool', 'Spa']);
    expect(hotel.contactNumber).toEqual('+1234567890');
    expect(hotel.website).toEqual('https://grandhotel.example.com');
  });

  it('should validate rating correctly', () => {
    expect(Hotel.validateRating(4)).toBeTruthy();
    expect(Hotel.validateRating(0)).toBeFalsy();
    expect(Hotel.validateRating(6)).toBeFalsy();
    expect(Hotel.validateRating(null)).toBeFalsy();
  });

  it('should validate contact number correctly', () => {
    expect(Hotel.validateContactNumber('+1234567890')).toBeTruthy();
    expect(Hotel.validateContactNumber('123456')).toBeTruthy();
    expect(Hotel.validateContactNumber(null)).toBeFalsy();
  });

  it('should return true for valid hotel', () => {
    const hotel = new Hotel('Grand Hotel', 'City Center', 4, 100, ['WiFi', 'Pool', 'Spa'], '+1234567890', 'https://grandhotel.example.com');
    expect(hotel.isValid()).toBeTruthy();
  });

  it('should return false for invalid hotel with missing name', () => {
    const hotel = new Hotel('', 'City Center', 4, 100, ['WiFi', 'Pool', 'Spa'], '+1234567890', 'https://grandhotel.example.com');
    expect(hotel.isValid()).toBeFalsy();
  });

  it('should return false for invalid hotel with invalid rating', () => {
    const hotel = new Hotel('Grand Hotel', 'City Center', 6, 100, ['WiFi', 'Pool', 'Spa'], '+1234567890', 'https://grandhotel.example.com');
    expect(hotel.isValid()).toBeFalsy();
  });

  it('should return false for invalid hotel with missing amenities', () => {
    const hotel = new Hotel('Grand Hotel', 'City Center', 4, 100, [], '+1234567890', 'https://grandhotel.example.com');
    expect(hotel.isValid()).toBeTruthy();
  });

  it('should return false for invalid hotel with missing contact number', () => {
    const hotel = new Hotel('Grand Hotel', 'City Center', 4, 100, ['WiFi', 'Pool', 'Spa'], '', 'https://grandhotel.example.com');
    expect(hotel.isValid()).toBeFalsy();
  });

  it('should handle edge case with missing or null values', () => {
    const hotel = new Hotel('', '', 0, 0, [], '', '');
    expect(hotel.isValid()).toBeFalsy();
    expect(Hotel.validateRating(hotel.rating)).toBeFalsy();
    expect(Hotel.validateContactNumber(hotel.contactNumber)).toBeFalsy();
  });

  it('should handle edge case with undefined values', () => {
    const hotel = new Hotel(undefined, undefined, undefined, undefined, undefined, undefined, undefined);
    expect(hotel.isValid()).toBeFalsy();
    expect(Hotel.validateRating(hotel.rating)).toBeFalsy();
    expect(Hotel.validateContactNumber(hotel.contactNumber)).toBeFalsy();
  });
});
