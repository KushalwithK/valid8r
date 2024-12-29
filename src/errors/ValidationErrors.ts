export class NameValidationFailed extends Error {
  constructor(message = "Name validation failed") {
    super(message);
    this.name = "NameValidationFailedError";
    Object.setPrototypeOf(this, NameValidationFailed.prototype);
  }
}

export class EmailValidationFailed extends Error {
  constructor(message = "Name validation failed") {
    super(message);
    this.name = "NameValidationFailedError";
    Object.setPrototypeOf(this, EmailValidationFailed.prototype);
  }
}

export class PhoneValidationFailed extends Error {
  constructor(message = "Phone validation failed") {
    super(message);
    this.name = "PhoneValidationFailedError";
    Object.setPrototypeOf(this, PhoneValidationFailed.prototype);
  }
}

export class PasswordValidationFailed extends Error {
  constructor(message = "Password validation failed") {
    super(message);
    this.name = "PasswordValidationFailedError";
    Object.setPrototypeOf(this, PasswordValidationFailed.prototype);
  }
}

export class IPValidationFailed extends Error {
  constructor(message = "IP validation failed") {
    super(message);
    this.name = "IPValidationFailedError";
    Object.setPrototypeOf(this, IPValidationFailed.prototype);
  }
}

export class UsernameValidationFailed extends Error {
  constructor(message = "Username validation failed") {
    super(message);
    this.name = "UsernameValidationFailedError";
    Object.setPrototypeOf(this, UsernameValidationFailed.prototype);
  }
}

export class DateValidationFailed extends Error {
  constructor(message = "Date validation failed") {
    super(message);
    this.name = "DateValidationFailedError";
    Object.setPrototypeOf(this, DateValidationFailed.prototype);
  }
}