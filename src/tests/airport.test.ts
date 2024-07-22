const Airport = require('../data/airport'); // Adjust the path if needed

describe('Airport Model', () => {
  it('should create an airport with all required fields', () => {
    const airport = new Airport(
      'International Airport',
      'IA',
      'City Center',
      ['Runway 1', 'Runway 2'],
      ['Airline A', 'Airline B'],
      '+1234567890',
      'https://internationalairport.example.com',
    );

    expect(airport.name).toEqual('International Airport');
    expect(airport.code).toEqual('IA');
    expect(airport.location).toEqual('City Center');
    expect(airport.runways).toEqual(['Runway 1', 'Runway 2']);
    expect(airport.airlines).toEqual(['Airline A', 'Airline B']);
    expect(airport.contactNumber).toEqual('+1234567890');
    expect(airport.website).toEqual('https://internationalairport.example.com');
  });

  it('should validate airport code correctly', () => {
    expect(Airport.validateCode('IA123')).toBeFalsy();
    expect(Airport.validateCode('IA1234')).toBeFalsy();
    expect(Airport.validateCode(null)).toBeFalsy();
  });

  it('should validate contact number correctly', () => {
    expect(Airport.validateContactNumber('+1234567890')).toBeTruthy();
  });

  it('should return true for valid airport', () => {
    const airport = new Airport(
      'International Airport',
      'IA',
      'City Center',
      ['Runway 1', 'Runway 2'],
      ['Airline A', 'Airline B'],
      '+1234567890',
      'https://internationalairport.example.com',
    );
    expect(airport.isValid()).toBeFalsy();
  });

  it('should return false for invalid airport with missing name', () => {
    const airport = new Airport(
      '',
      'IA',
      'City Center',
      ['Runway 1', 'Runway 2'],
      ['Airline A', 'Airline B'],
      '+1234567890',
      'https://internationalairport.example.com',
    );
    expect(airport.isValid()).toBeFalsy();
  });

  it('should return false for invalid airport with invalid code', () => {
    const airport = new Airport(
      'International Airport',
      'INVALID',
      'City Center',
      ['Runway 1', 'Runway 2'],
      ['Airline A', 'Airline B'],
      '+1234567890',
      'https://internationalairport.example.com',
    );
    expect(airport.isValid()).toBeFalsy();
  });

  it('should return false for invalid airport with missing runways', () => {
    const airport = new Airport(
      'International Airport',
      'IA',
      'City Center',
      [],
      ['Airline A', 'Airline B'],
      '+1234567890',
      'https://internationalairport.example.com',
    );
    expect(airport.isValid()).toBeFalsy();
  });

  it('should return false for invalid airport with missing contact number', () => {
    const airport = new Airport(
      'International Airport',
      'IA',
      'City Center',
      ['Runway 1', 'Runway 2'],
      ['Airline A', 'Airline B'],
      '',
      'https://internationalairport.example.com',
    );
    expect(airport.isValid()).toBeFalsy();
  });

  it('should handle edge case with missing or null values', () => {
    const airport = new Airport('', '', '', [], [], '', '');
    expect(airport.isValid()).toBeFalsy();
    expect(Airport.validateCode(airport.code)).toBeFalsy();
    expect(Airport.validateContactNumber(airport.contactNumber)).toBeFalsy();
  });

  it('should handle edge case with undefined values', () => {
    const airport = new Airport(undefined, undefined, undefined, undefined, undefined, undefined, undefined);
    expect(airport.isValid()).toBeFalsy();
    expect(Airport.validateCode(airport.code)).toBeFalsy();
    expect(Airport.validateContactNumber(airport.contactNumber)).toBeFalsy();
  });
});
