const Hospital = require('../data/hospital'); // Adjust the path if needed

describe('Hospital Model', () => {
  it('should create a hospital with all required fields', () => {
    const hospital = new Hospital(
      'City Hospital',
      'Downtown',
      150,
      'Cardiology',
      '+1234567890',
      '123 Main St, Downtown',
      'https://cityhospital.example.com',
    );

    expect(hospital.name).toEqual('City Hospital');
    expect(hospital.location).toEqual('Downtown');
    expect(hospital.numberOfBeds).toEqual(150);
    expect(hospital.specialty).toEqual('Cardiology');
    expect(hospital.contactNumber).toEqual('+1234567890');
    expect(hospital.address).toEqual('123 Main St, Downtown');
    expect(hospital.website).toEqual('https://cityhospital.example.com');
  });

  it('should return true for valid hospital', () => {
    const hospital = new Hospital(
      'City Hospital',
      'Downtown',
      150,
      'Cardiology',
      '+1234567890',
      '123 Main St, Downtown',
      'https://cityhospital.example.com',
    );
    expect(hospital.isValid()).toBeTruthy();
  });

  it('should return false for invalid hospital with missing name', () => {
    const hospital = new Hospital('', 'Downtown', 150, 'Cardiology', '+1234567890', '123 Main St, Downtown', 'https://cityhospital.example.com');
    expect(hospital.isValid()).toBeFalsy();
  });

  it('should return false for invalid hospital with invalid contact number', () => {
    const hospital = new Hospital(
      'City Hospital',
      'Downtown',
      150,
      'Cardiology',
      'invalid-contact',
      '123 Main St, Downtown',
      'https://cityhospital.example.com',
    );
    expect(hospital.isValid()).toBeFalsy();
  });

  it('should return false for invalid hospital with missing website', () => {
    const hospital = new Hospital('City Hospital', 'Downtown', 150, 'Cardiology', '+1234567890', '123 Main St, Downtown', '');
    expect(hospital.isValid()).toBeFalsy();
  });

  it('should handle edge case with missing or null values', () => {
    const hospital = new Hospital('', '', -1, '', '', '', '');
    expect(hospital.isValid()).toBeFalsy();
    expect(Hospital.validateContactNumber(hospital.contactNumber)).toBeFalsy();
  });

  it('should handle edge case with undefined values', () => {
    const hospital = new Hospital(undefined, undefined, undefined, undefined, undefined, undefined, undefined);
    expect(hospital.isValid()).toBeFalsy();
    expect(Hospital.validateContactNumber(hospital.contactNumber)).toBeFalsy();
  });
});
