// user.test.js
const User = require('../data/user'); // Adjust the path if needed

describe('User Model', () => {
  it('should create a user with name, email, and password', () => {
    const user = new User('John Doe', 'john@example.com', '123456');
    expect(user.name).toEqual('John Doe');
    expect(user.email).toEqual('john@example.com');
    expect(user.password).toEqual('123456');
  });

  it('should validate email correctly', () => {
    expect(User.validateEmail('john@example.com')).toBeTruthy();
    expect(User.validateEmail('johnexample.com')).toBeFalsy();
  });

  it('should return true for valid user', () => {
    const user = new User('John Doe', 'john@example.com', '123456');
    expect(user.isValid()).toBeTruthy();
  });

  it('should return false for invalid user', () => {
    const user = new User('John Doe', '', '123456');
    expect(user.isValid()).toBeFalsy();
  });

  it('should create a user without password and fail validation', () => {
    const user = new User('Jane Doe', 'jane@example.com', '');
    expect(user.isValid()).toBeFalsy();
  });

  it('should create a user with an invalid email and fail validation', () => {
    const user = new User('Jane Doe', 'janeexample.com', '123456');
    expect(User.validateEmail(user.email)).toBeFalsy();
  });

  it('should handle edge cases with missing name, email, and password', () => {
    const user = new User('', '', '');
    expect(user.isValid()).toBeFalsy();
    expect(User.validateEmail(user.email)).toBeFalsy();
  });

  it('should handle edge case with null values', () => {
    const user = new User(null, null, null);
    expect(user.isValid()).toBeFalsy();
    expect(User.validateEmail(user.email)).toBeFalsy();
  });

  it('should handle edge case with undefined values', () => {
    const user = new User(undefined, undefined, undefined);
    expect(user.isValid()).toBeFalsy();
    expect(User.validateEmail(user.email)).toBeFalsy();
  });
});
