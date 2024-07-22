// user.js
class User {
  constructor(name, email, password) {
    this.name = name;
    this.email = email;
    this.password = password;
  }

  static validateEmail(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  isValid() {
    return this.name && this.email && this.password;
  }
}

module.exports = User;
