// province.test.js
const Province = require('../data/province'); // Adjust the path if needed

describe('Province Model', () => {
  it('should create a province with all required fields', () => {
    const province = new Province(
      'Kabul',
      'کابل',
      'کابل',
      1025,
      4500000,
      20000,
      { type: 'Point', coordinates: [69.2075, 34.5553] },
      'https://maps.google.com/kabul',
      'Kabul',
      'کابل',
      'کابل',
      'Capital of Afghanistan',
      'پایتخت افغانستان',
      'پایتخت افغانستان',
      ['image1.jpg', 'image2.jpg'],
      true,
      false,
    );

    expect(province.en_name).toEqual('Kabul');
    expect(province.dr_name).toEqual('کابل');
    expect(province.ps_name).toEqual('کابل');
    expect(province.area).toEqual(1025);
    expect(province.population).toEqual(4500000);
    expect(province.gdp).toEqual(20000);
    expect(province.location).toEqual({ type: 'Point', coordinates: [69.2075, 34.5553] });
    expect(province.googleMapUrl).toEqual('https://maps.google.com/kabul');
    expect(province.en_capital).toEqual('Kabul');
    expect(province.dr_capital).toEqual('کابل');
    expect(province.ps_capital).toEqual('کابل');
    expect(province.en_description).toEqual('Capital of Afghanistan');
    expect(province.dr_description).toEqual('پایتخت افغانستان');
    expect(province.ps_description).toEqual('پایتخت افغانستان');
    expect(province.images).toEqual(['image1.jpg', 'image2.jpg']);
    expect(province.status).toEqual(true);
    expect(province.hasPending).toEqual(false);
  });

  it('should validate location correctly', () => {
    expect(Province.validateLocation({ type: 'Point', coordinates: [69.2075, 34.5553] })).toBeTruthy();
    expect(Province.validateLocation({ type: 'Point', coordinates: [69.2075] })).toBeFalsy();
    expect(Province.validateLocation({ type: 'Point', coordinates: 'invalid' })).toBeFalsy();
    expect(Province.validateLocation(null)).toBeFalsy();
  });

  it('should return true for valid province', () => {
    const province = new Province(
      'Kabul',
      'کابل',
      'کابل',
      1025,
      4500000,
      20000,
      { type: 'Point', coordinates: [69.2075, 34.5553] },
      'https://maps.google.com/kabul',
      'Kabul',
      'کابل',
      'کابل',
      'Capital of Afghanistan',
      'پایتخت افغانستان',
      'پایتخت افغانستان',
      ['image1.jpg', 'image2.jpg'],
      true,
      false,
    );
    expect(province.isValid()).toBeTruthy();
  });

  it('should return false for invalid province with missing name', () => {
    const province = new Province(
      '',
      'کابل',
      'کابل',
      1025,
      4500000,
      20000,
      { type: 'Point', coordinates: [69.2075, 34.5553] },
      'https://maps.google.com/kabul',
      'Kabul',
      'کابل',
      'کابل',
      'Capital of Afghanistan',
      'پایتخت افغانستان',
      'پایتخت افغانستان',
      ['image1.jpg', 'image2.jpg'],
      true,
      false,
    );
    expect(province.isValid()).toBeFalsy();
  });

  it('should return false for invalid province with missing location', () => {
    const province = new Province(
      'Kabul',
      'کابل',
      'کابل',
      1025,
      4500000,
      20000,
      null,
      'https://maps.google.com/kabul',
      'Kabul',
      'کابل',
      'کابل',
      'Capital of Afghanistan',
      'پایتخت افغانستان',
      'پایتخت افغانستان',
      ['image1.jpg', 'image2.jpg'],
      true,
      false,
    );
    expect(province.isValid()).toBeFalsy();
  });

  it('should return false for invalid province with missing images', () => {
    const province = new Province(
      'Kabul',
      'کابل',
      'کابل',
      1025,
      4500000,
      20000,
      { type: 'Point', coordinates: [69.2075, 34.5553] },
      'https://maps.google.com/kabul',
      'Kabul',
      'کابل',
      'کابل',
      'Capital of Afghanistan',
      'پایتخت افغانستان',
      'پایتخت افغانستان',
      [],
      true,
      false,
    );
    expect(province.isValid()).toBeFalsy();
  });

  it('should handle edge case with missing or null values', () => {
    const province = new Province('', '', '', -1, -1, -1, { type: 'Point', coordinates: [] }, '', '', '', '', '', '', [], false, false);
    expect(province.isValid()).toBeFalsy();
    expect(Province.validateLocation(province.location)).toBeFalsy();
  });

  it('should handle edge case with undefined values', () => {
    const province = new Province(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    );
    expect(province.isValid()).toBeFalsy();
    expect(Province.validateLocation(province.location)).toBeFalsy();
  });
});
