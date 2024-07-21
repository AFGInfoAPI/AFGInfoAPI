const District = require('../data/district'); // Adjust the path if needed

describe('District Model', () => {
  it('should create a district with all required fields', () => {
    const district = new District(
      'District 1',
      'Province A',
      500,
      200000,
      15000,
      { type: 'Point', coordinates: [70.2075, 35.5553] },
      'https://maps.google.com/district1',
      'Description of District 1',
      ['image1.jpg', 'image2.jpg'],
      true,
    );

    expect(district.name).toEqual('District 1');
    expect(district.province).toEqual('Province A');
    expect(district.area).toEqual(500);
    expect(district.population).toEqual(200000);
    expect(district.gdp).toEqual(15000);
    expect(district.location).toEqual({ type: 'Point', coordinates: [70.2075, 35.5553] });
    expect(district.googleMapUrl).toEqual('https://maps.google.com/district1');
    expect(district.description).toEqual('Description of District 1');
    expect(district.images).toEqual(['image1.jpg', 'image2.jpg']);
    expect(district.status).toEqual(true);
  });

  it('should validate location correctly', () => {
    expect(District.validateLocation({ type: 'Point', coordinates: [70.2075, 35.5553] })).toBeTruthy();
    expect(District.validateLocation({ type: 'Point', coordinates: [70.2075] })).toBeFalsy();
    expect(District.validateLocation({ type: 'Point', coordinates: 'invalid' })).toBeFalsy();
    expect(District.validateLocation(null)).toBeFalsy();
  });

  it('should return true for valid district', () => {
    const district = new District(
      'District 1',
      'Province A',
      500,
      200000,
      15000,
      { type: 'Point', coordinates: [70.2075, 35.5553] },
      'https://maps.google.com/district1',
      'Description of District 1',
      ['image1.jpg', 'image2.jpg'],
      true,
    );
    expect(district.isValid()).toBeTruthy();
  });

  it('should return false for invalid district with missing name', () => {
    const district = new District(
      '',
      'Province A',
      500,
      200000,
      15000,
      { type: 'Point', coordinates: [70.2075, 35.5553] },
      'https://maps.google.com/district1',
      'Description of District 1',
      ['image1.jpg', 'image2.jpg'],
      true,
    );
    expect(district.isValid()).toBeFalsy();
  });

  it('should return false for invalid district with missing location', () => {
    const district = new District(
      'District 1',
      'Province A',
      500,
      200000,
      15000,
      null,
      'https://maps.google.com/district1',
      'Description of District 1',
      ['image1.jpg', 'image2.jpg'],
      true,
    );
    expect(district.isValid()).toBeFalsy();
  });

  it('should return false for invalid district with missing images', () => {
    const district = new District(
      'District 1',
      'Province A',
      500,
      200000,
      15000,
      { type: 'Point', coordinates: [70.2075, 35.5553] },
      'https://maps.google.com/district1',
      'Description of District 1',
      [],
      true,
    );
    expect(district.isValid()).toBeFalsy();
  });

  it('should handle edge case with missing or null values', () => {
    const district = new District('', '', -1, -1, -1, { type: 'Point', coordinates: [] }, '', '', [], false);
    expect(district.isValid()).toBeFalsy();
    expect(District.validateLocation(district.location)).toBeFalsy();
  });

  it('should handle edge case with undefined values', () => {
    const district = new District(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined);
    expect(district.isValid()).toBeFalsy();
    expect(District.validateLocation(district.location)).toBeFalsy();
  });
});
