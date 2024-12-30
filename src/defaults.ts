import {
  AddressValidatorProps,
  CardDetails,
  DateValidatorProps,
  DefaultErrorType,
  DefaultType,
  EmailValidatorProps,
  IPAddressValidatorProps,
  NameValidatorProps,
  PasswordValidatorProps,
  PhoneValidatorProps,
  UsernameValidatorProps,
} from "./utils/types";

export const defaultNameProps: NameValidatorProps = {
  onlyFirst: false,
  firstLast: true,
  fullNameWithMiddle: false,
  noSpChars: true,
  minLen: 6,
  maxLen: 99,
  minLenPerWord: 4,
  maxLenPerWord: 30,
  allowNumbers: false,
  properCapitalized: true,
  noLeadingSpaces: true,
  noTrailingSpaces: true,
  noConsecutiveSpaces: true,
  throwErrorsAs: "throw-all",
  safe: false,
};

export const defaultNameErrorMsgs: Partial<
  Record<keyof NameValidatorProps, string>
> = {
  onlyFirst: "Only a first name is allowed.",
  firstLast: "Name must include both first and last names.",
  fullNameWithMiddle: "Name must include first, middle and last name.",
  noSpChars: "Name should not contain any special characters.",
  minLen: "Name should be atleast {minLen} characters long.",
  maxLen: "Name must not exceed {maxLen} characters.",
  minLenPerWord: "Each word must be at least {minLenPerWord} characters long.",
  maxLenPerWord: "Each word must not exceed {maxLenPerWord} characters.",
  allowNumbers: "Name should not contain numbers.",
  properCapitalized: "Each word must be properly capitalized.",
  noLeadingSpaces: "Name should not have leading spaces.",
  noTrailingSpaces: "Name should not have trailing spaces.",
  noConsecutiveSpaces: "Name should not contain consecutive spaces.",
  throwErrorsAs: "NO SUITABLE ERROR MESSAGE",
};

export const defaultEmailProps: EmailValidatorProps = {
  noSpChars: true,
  startWithNum: false,
  endWithNum: false,
  minLen: 6,
  maxLen: 254,
  allowedDomains: ["*"],
  customDisposables: [],
  allowDisposables: true,
  noLeading: true,
  noTrailing: true,
  caseSensitive: false,
  throwErrorsAs: "throw-all",
  safe: false,
};

export const defaultEmailErrorMsgs: Partial<
  Record<keyof EmailValidatorProps, string>
> = {
  format: "Invalid Email Format.",
  noSpChars:
    "Email should not contain any sp. characters other than {allowedSpChars}, found {encounteredSpChar}.",
  startWithNum: "Email should not start with a number.",
  endWithNum: "Email should not end with a number.",
  minLen: "Email must be at least {minLen} characters long.",
  maxLen: "Email must not exceed {maxLen} characters.",
  allowedDomains: "Email's domain must be one of: {allowedDomains}",
  allowDisposables: "Disposable email addresses are not allowed.",
  noLeading: "Email should not have leading spaces.",
  noTrailing: "Email should not have trailing spaces.",
  caseSensitive: "Email should be in lowercase.",
};

export const defaultPhoneProps: PhoneValidatorProps = {
  allowDashes: false,
  allowParentheses: false,
  minLen: 10,
  maxLen: 15,
  allowedCountryCodes: ["*"],
  requireCountryCode: true,
  throwErrorsAs: "throw-all",
  safe: false,
};

export const defaultPhoneErrorMsgs: Partial<
  Record<keyof PhoneValidatorProps, string>
> = {
  format:
    "Phone number is invalid, only spaces, digits, dashes and paranthesis are allowed!",
  allowDashes: "Dashes are not valid in phone number.",
  allowParentheses: "Parentheses are not valid in phone number.",
  minLen: "Phone number must be at least {minLen} digits long.",
  maxLen: "Phone number must not exceed {maxLen} digits.",
  allowedCountryCodes:
    "Phone number must start with one of the allowed country codes: {allowedCountryCodes}.",
  requireCountryCode:
    "Phone number must include a country code (e.g., +1, +91).",
  throwErrorsAs: "",
  safe: "",
};

export const defaultAddressProps: AddressValidatorProps = {
  minLen: 5,
  maxLen: 255,
  allowedSpChars: ["#", ",", "."],
  properCapitalization: true,
  noConsecutiveSpaces: true,
  throwErrorsAs: "throw-all",
  safe: false,
};

export const defaultAddressErrorMsgs: Partial<
  Record<keyof AddressValidatorProps, string>
> = {
  minLen: "Address must be at least {minLen} characters long.",
  maxLen: "Address must not exceed {maxLen} characters.",
  allowedSpChars:
    "Address contains invalid characters. Only alphanumeric characters and {allowedSpChars} are allowed.",
  properCapitalization:
    "Each word in the address must be properly capitalized.",
  noConsecutiveSpaces: "Address must not contain consecutive spaces.",
};

export const defaultPasswordProps: PasswordValidatorProps = {
  minLen: 8,
  maxLen: 99,
  requireSpChars: false,
  requireNum: false,
  requireUpper: true,
  requireLower: true,
  noConsecutiveSpaces: true,
  throwErrorsAs: "throw-all",
  safe: false,
};

export const defaultPasswordErrorMsgs: Partial<
  Record<keyof PasswordValidatorProps, string>
> = {
  minLen: "Password must be at least {minLen} characters long.",
  maxLen: "Password must not exceed ${maxLen} characters.",
  requireSpChars:
    "Password must include at least one of the following special characters: ${allowedSpChars}",
  requireNum: "Password must include at least one numeric character.",
  requireUpper: "Password must include at least one uppercase letter.",
  requireLower: "Password must include at least one lowercase letter.",
  noConsecutiveSpaces: "Password must not contain consecutive spaces.",
};

export const defaultIPAddressProps: IPAddressValidatorProps = {
  version: "*",
  allowPrivate: false,
  allowLoopback: false,
  throwErrorsAs: "throw-all",
  safe: false,
};

export const defaultIPAddressErrorMsgs: Partial<
  Record<keyof IPAddressValidatorProps, string>
> = {
  format: "Invalid IP Address.",
  version: "Invalid IP address version. Allowed versions are IPv4 or IPv6.",
  allowPrivate: "Private IP addresses are not allowed.",
  allowLoopback: "Loopback IP addresses are not allowed.",
};

export const defaultUsernameProps: UsernameValidatorProps = {
  minLen: 3,
  maxLen: 30,
  allowNumbers: true,
  allowUnderscores: true,
  allowDashes: true,
  allowSpecialChars: false,
  allowSpaces: false,
  allowUppercase: true,
  throwErrorsAs: "throw-all",
  safe: false,
};

export const defaultUsernameErrorMsgs: Partial<
  Record<keyof UsernameValidatorProps, string>
> = {
  format: "Username's format is invalid!",
  minLen: "Username must be at least {minLen} characters long.",
  maxLen: "Username must not exceed {maxLen} characters.",
  allowNumbers: "Username contains invalid numbers.",
  allowUnderscores: "Username contains invalid underscores.",
  allowDashes: "Username contains invalid dashes.",
  allowSpecialChars: "Username cannot contains special characters.",
  allowSpaces: "Username cannot include spaces.",
  allowUppercase: "Username cannot include uppercase letters.",
  customRegex: "Username does not match the required format.",
};

export const defaultDateProps: DateValidatorProps = {
  format: "YYYY-MM-DD",
  allowFutureDates: true,
  allowPastDates: true,
  requireLeapYear: false,
  throwErrorsAs: "throw-all",
  safe: false,
};

export const defaultDateErrorMsgs: Partial<
  Record<keyof DateValidatorProps, string>
> = {
  format: "Date format is invalid.",
  minDate: "Date is earlier than the minimum allowed date.",
  maxDate: "Date is later than the maximum allowed date.",
  allowFutureDates: "Future dates are not allowed.",
  allowPastDates: "Past dates are not allowed.",
  requireLeapYear: "Date is not in a leap year.",
};

export const defaultCardProps: Partial<CardDetails>= {
  safe: false,
  throwErrorsAs: 'throw-all'
}

export const defaultCardErrorMsgs = {
  number: "Invalid card number.",
  expirationDate: "Invalid expiration date.",
  cvv: "Invalid CVV.",
  cardHolderName: "Invalid cardholder name.",
};

export const setDefaults = (
  defaultConfig: DefaultType = {},
  defaultError: DefaultErrorType = {}
) => {
  // Name config
  if (defaultConfig.name) {
    Object.assign(defaultNameProps, defaultConfig.name);
  }
  if (defaultError.name) {
    Object.assign(defaultNameErrorMsgs, defaultError.name);
  }

  // Email config
  if (defaultConfig.email) {
    Object.assign(defaultEmailProps, defaultConfig.email);
  }
  if (defaultError.email) {
    Object.assign(defaultEmailErrorMsgs, defaultError.email);
  }

  // Email config
  if (defaultConfig.phone) {
    Object.assign(defaultPhoneProps, defaultConfig.phone);
  }
  if (defaultError.phone) {
    Object.assign(defaultPhoneErrorMsgs, defaultError.phone);
  }

  // Address config
  if (defaultConfig.address) {
    Object.assign(defaultAddressProps, defaultConfig.address);
  }
  if (defaultError.address) {
    Object.assign(defaultAddressErrorMsgs, defaultError.address);
  }

  // Password config
  if (defaultConfig.password) {
    Object.assign(defaultPasswordProps, defaultConfig.password);
  }
  if (defaultError.password) {
    Object.assign(defaultPasswordErrorMsgs, defaultError.password);
  }

  // IP Config
  if (defaultConfig.ip) {
    Object.assign(defaultIPAddressProps, defaultConfig.ip);
  }
  if (defaultError.ip) {
    Object.assign(defaultIPAddressErrorMsgs, defaultError.ip);
  }

  // Username Config
  if (defaultConfig.username) {
    Object.assign(defaultUsernameProps, defaultConfig.username);
  }
  if (defaultError.username) {
    Object.assign(defaultUsernameErrorMsgs, defaultError.username);
  }

  // Username Config
  if (defaultConfig.date) {
    Object.assign(defaultDateProps, defaultConfig.date);
  }
  if (defaultError.date) {
    Object.assign(defaultDateErrorMsgs, defaultError.date);
  }
};
