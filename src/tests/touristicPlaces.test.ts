const TouristicPlace = require('../data/touristicPlaces'); // Adjust the path if needed

describe('TouristicPlace Model', () => {
  it('should create a touristic place with all required fields', () => {
    const place = new TouristicPlace(
      'Eiffel Tower',
      'Paris',
      'Monument',
      'Famous landmark in Paris',
      { Monday: '9am-11pm', Tuesday: '9am-11pm' },
      25,
      '+33123456789',
      'https://eiffeltower.example.com',
    );

    expect(place.name).toEqual('Eiffel Tower');
    expect(place.location).toEqual('Paris');
    expect(place.type).toEqual('Monument');
    expect(place.description).toEqual('Famous landmark in Paris');
    expect(place.openingHours).toEqual({ Monday: '9am-11pm', Tuesday: '9am-11pm' });
    expect(place.entryFee).toEqual(25);
    expect(place.contactNumber).toEqual('+33123456789');
    expect(place.website).toEqual('https://eiffeltower.example.com');
  });

  it('should validate entry fee correctly', () => {
    expect(TouristicPlace.validateEntryFee(25)).toBeTruthy();
    expect(TouristicPlace.validateEntryFee(0)).toBeTruthy();
    expect(TouristicPlace.validateEntryFee(-10)).toBeFalsy();
  });

  it('should validate contact number correctly', () => {
    expect(TouristicPlace.validateContactNumber('+33123456789')).toBeTruthy();
    expect(TouristicPlace.validateContactNumber(null)).toBeFalsy();
  });

  it('should return true for valid touristic place', () => {
    const place = new TouristicPlace(
      'Eiffel Tower',
      'Paris',
      'Monument',
      'Famous landmark in Paris',
      { Monday: '9am-11pm', Tuesday: '9am-11pm' },
      25,
      '+33123456789',
      'https://eiffeltower.example.com',
    );
    expect(place.isValid()).toBeTruthy();
  });

  it('should return false for invalid touristic place with missing name', () => {
    const place = new TouristicPlace(
      '',
      'Paris',
      'Monument',
      'Famous landmark in Paris',
      { Monday: '9am-11pm', Tuesday: '9am-11pm' },
      25,
      '+33123456789',
      'https://eiffeltower.example.com',
    );
    expect(place.isValid()).toBeFalsy();
  });

  it('should return false for invalid touristic place with negative entry fee', () => {
    const place = new TouristicPlace(
      'Eiffel Tower',
      'Paris',
      'Monument',
      'Famous landmark in Paris',
      { Monday: '9am-11pm', Tuesday: '9am-11pm' },
      -25,
      '+33123456789',
      'https://eiffeltower.example.com',
    );
    expect(place.isValid()).toBeFalsy();
  });

  it('should return false for invalid touristic place with missing contact number', () => {
    const place = new TouristicPlace(
      'Eiffel Tower',
      'Paris',
      'Monument',
      'Famous landmark in Paris',
      { Monday: '9am-11pm', Tuesday: '9am-11pm' },
      25,
      '',
      'https://eiffeltower.example.com',
    );
    expect(place.isValid()).toBeFalsy();
  });

  it('should handle edge case with missing or null values', () => {
    const place = new TouristicPlace('', '', '', '', {}, -1, '', '');
    expect(place.isValid()).toBeFalsy();
    expect(TouristicPlace.validateEntryFee(place.entryFee)).toBeFalsy();
    expect(TouristicPlace.validateContactNumber(place.contactNumber)).toBeFalsy();
  });

  it('should handle edge case with undefined values', () => {
    const place = new TouristicPlace(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined);
    expect(place.isValid()).toBeFalsy();
    expect(TouristicPlace.validateEntryFee(place.entryFee)).toBeFalsy();
    expect(TouristicPlace.validateContactNumber(place.contactNumber)).toBeFalsy();
  });
});
