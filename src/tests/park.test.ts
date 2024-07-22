const Park = require('../data/park'); // Adjust the path if needed

describe('Park Model', () => {
  it('should create a park with all required fields', () => {
    const park = new Park(
      'Central Park',
      'Downtown',
      50000,
      ['Playground', 'Lake', 'Walking Trails'],
      { Monday: '8am-6pm', Saturday: '8am-8pm' },
      '+1234567890',
      'https://centralpark.example.com',
    );

    expect(park.name).toEqual('Central Park');
    expect(park.location).toEqual('Downtown');
    expect(park.size).toEqual(50000);
    expect(park.facilities).toEqual(['Playground', 'Lake', 'Walking Trails']);
    expect(park.openingHours).toEqual({ Monday: '8am-6pm', Saturday: '8am-8pm' });
    expect(park.contactNumber).toEqual('+1234567890');
    expect(park.website).toEqual('https://centralpark.example.com');
  });

  it('should validate park size correctly', () => {
    expect(Park.validateSize(50000)).toBeTruthy();
    expect(Park.validateSize(0)).toBeFalsy();
    expect(Park.validateSize(-100)).toBeFalsy();
    expect(Park.validateSize(null)).toBeFalsy();
  });

  it('should validate contact number correctly', () => {
    expect(Park.validateContactNumber('+1234567890')).toBeTruthy();
    expect(Park.validateContactNumber(null)).toBeFalsy();
  });

  it('should return true for valid park', () => {
    const park = new Park(
      'Central Park',
      'Downtown',
      50000,
      ['Playground', 'Lake', 'Walking Trails'],
      { Monday: '8am-6pm', Saturday: '8am-8pm' },
      '+1234567890',
      'https://centralpark.example.com',
    );
    expect(park.isValid()).toBeTruthy();
  });

  it('should return false for invalid park with missing name', () => {
    const park = new Park(
      '',
      'Downtown',
      50000,
      ['Playground', 'Lake', 'Walking Trails'],
      { Monday: '8am-6pm', Saturday: '8am-8pm' },
      '+1234567890',
      'https://centralpark.example.com',
    );
    expect(park.isValid()).toBeFalsy();
  });

  it('should return false for invalid park with invalid size', () => {
    const park = new Park(
      'Central Park',
      'Downtown',
      -5000,
      ['Playground', 'Lake', 'Walking Trails'],
      { Monday: '8am-6pm', Saturday: '8am-8pm' },
      '+1234567890',
      'https://centralpark.example.com',
    );
    expect(park.isValid()).toBeFalsy();
  });

  it('should return false for invalid park with missing facilities', () => {
    const park = new Park(
      'Central Park',
      'Downtown',
      50000,
      [],
      { Monday: '8am-6pm', Saturday: '8am-8pm' },
      '+1234567890',
      'https://centralpark.example.com',
    );
    expect(park.isValid()).toBeFalsy();
  });

  it('should return false for invalid park with missing contact number', () => {
    const park = new Park(
      'Central Park',
      'Downtown',
      50000,
      ['Playground', 'Lake', 'Walking Trails'],
      { Monday: '8am-6pm', Saturday: '8am-8pm' },
      '',
      'https://centralpark.example.com',
    );
    expect(park.isValid()).toBeFalsy();
  });

  it('should handle edge case with missing or null values', () => {
    const park = new Park('', '', 0, [], {}, '', '');
    expect(park.isValid()).toBeFalsy();
    expect(Park.validateSize(park.size)).toBeFalsy();
    expect(Park.validateContactNumber(park.contactNumber)).toBeFalsy();
  });

  it('should handle edge case with undefined values', () => {
    const park = new Park(undefined, undefined, undefined, undefined, undefined, undefined, undefined);
    expect(park.isValid()).toBeFalsy();
    expect(Park.validateSize(park.size)).toBeFalsy();
    expect(Park.validateContactNumber(park.contactNumber)).toBeFalsy();
  });
});
