export interface NameValidatorProps {
  onlyFirst?: boolean;
  firstLast?: boolean;
  fullNameWithMiddle?: boolean;
  noSpChars?: boolean;
  minLen?: number;
  maxLen?: number;
  minLenPerWord?: number;
  maxLenPerWord?: number;
  allowNumbers?: boolean;
  properCapitalized?: boolean;
  noLeadingSpaces?: boolean;
  noTrailingSpaces?: boolean;
  noConsecutiveSpaces?: boolean;
  throwErrorsAs?: "throw-first" | "throw-last" | "throw-all";
  safe?: boolean;
}

type DomainSpecificString = `${string}.${string}` | "*";

export interface EmailValidatorProps {
  format?: never;
  noSpChars?: boolean;
  startWithNum?: boolean;
  endWithNum?: boolean;
  minLen?: number;
  maxLen?: number;
  allowedDomains?: string[];
  customDisposables?: DomainSpecificString[];
  allowDisposables?: boolean;
  noLeading?: boolean;
  noTrailing?: boolean;
  caseSensitive?: boolean;
  throwErrorsAs?: "throw-first" | "throw-last" | "throw-all";
  safe?: boolean;
}

export interface PhoneValidatorProps {
  format?: never;
  allowDashes?: boolean;
  allowParentheses?: boolean;
  minLen?: number;
  maxLen?: number;
  allowedCountryCodes?: string[];
  requireCountryCode?: boolean;
  throwErrorsAs?: "throw-first" | "throw-last" | "throw-all";
  safe?: boolean;
}

export interface AddressValidatorProps {
  format?: never;
  minLen?: number;
  maxLen?: number;
  allowedSpChars?: boolean | string[];
  properCapitalization?: boolean;
  noConsecutiveSpaces?: boolean;
  throwErrorsAs?: "throw-first" | "throw-last" | "throw-all";
  safe?: boolean;
}

export interface PasswordValidatorProps {
  format?: never;
  minLen?: number;
  maxLen?: number;
  requireSpChars?: boolean | string[];
  requireNum?: boolean;
  requireUpper?: boolean;
  requireLower?: boolean;
  noConsecutiveSpaces?: boolean;
  throwErrorsAs?: "throw-first" | "throw-last" | "throw-all";
  safe?: boolean;
}

export interface IPAddressValidatorProps {
  format?: never;
  version?: "*" | "v4" | "v6";
  allowPrivate?: boolean;
  allowLoopback?: boolean;
  throwErrorsAs?: "throw-first" | "throw-last" | "throw-all";
  safe?: boolean;
}

export interface UsernameValidatorProps {
  format?: never;
  minLen?: number;
  maxLen?: number;
  allowNumbers?: boolean;
  allowUnderscores?: boolean;
  allowDashes?: boolean;
  allowSpecialChars?: boolean | string[];
  allowSpaces?: boolean;
  allowUppercase?: boolean;
  customRegex?: RegExp;
  throwErrorsAs?: "throw-first" | "throw-last" | "throw-all";
  safe?: boolean;
}

export interface DateValidatorProps {
  format?: "DD-MM-YYYY" | "MM-DD-YYYY" | "YYYY-MM-DD";
  minDate?: `${string}-${string}-${string}`;
  maxDate?: `${string}-${string}-${string}`;
  allowFutureDates?: boolean;
  allowPastDates?: boolean;
  requireLeapYear?: boolean;
  throwErrorsAs?: "throw-first" | "throw-last" | "throw-all";
  safe?: boolean;
}

export interface DefaultType {
  name?: NameValidatorProps;
  email?: EmailValidatorProps;
  phone?: PhoneValidatorProps;
  address?: AddressValidatorProps;
  password?: PasswordValidatorProps;
  ip?: IPAddressValidatorProps;
  username?: UsernameValidatorProps;
  date?: DateValidatorProps;
  card?: {
    throwErrorsAs?: "throw-first" | "throw-last" | "throw-all";
    safe?: boolean;
  };
}

export interface DefaultErrorType {
  name?: Partial<Record<keyof NameValidatorProps, string>>;
  email?: Partial<Record<keyof EmailValidatorProps, string>>;
  phone?: Partial<Record<keyof PhoneValidatorProps, string>>;
  address?: Partial<Record<keyof AddressValidatorProps, string>>;
  password?: Partial<Record<keyof PasswordValidatorProps, string>>;
  ip?: Partial<Record<keyof IPAddressValidatorProps, string>>;
  username?: Partial<Record<keyof UsernameValidatorProps, string>>;
  date?: Partial<Record<keyof DateValidatorProps, string>>;
  card?: {
    throwErrorsAs?: string;
    safe?: string;
  };
}

export interface CardDetails {
  number: string;
  expirationDate: Date;
  cvv: number;
  cardHolderName: string;
  throwErrorsAs?: "throw-first" | "throw-last" | "throw-all";
  safe?: boolean;
}
