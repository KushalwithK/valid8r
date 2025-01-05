import {
  parsePhoneNumberFromString,
  getCountries,
  getCountryCallingCode,
  isValidPhoneNumber,
} from "libphonenumber-js";
import { PhoneValidatorProps } from "../utils/types";
import { defaultPhoneErrorMsgs, defaultPhoneProps } from "../defaults";
import { PhoneValidationFailed } from "../errors/ValidationErrors";

export const validatePhone = (
  phone: string,
  {
    allowDashes = defaultPhoneProps.allowDashes!,
    allowParentheses = defaultPhoneProps.allowParentheses!,
    minLen = defaultPhoneProps.minLen!,
    maxLen = defaultPhoneProps.maxLen!,
    allowedCountryCodes = defaultPhoneProps.allowedCountryCodes!,
    requireCountryCode = defaultPhoneProps.requireCountryCode!,
    throwErrorsAs = defaultPhoneProps.throwErrorsAs!,
    safe = defaultPhoneProps.safe!,
  }: PhoneValidatorProps = {},
  errorMsgs: Partial<
    Record<keyof PhoneValidatorProps, string>
  > = defaultPhoneErrorMsgs
): [boolean, null | Partial<Record<keyof PhoneValidatorProps, string>>] => {
  let errors: Partial<Record<keyof PhoneValidatorProps, string>> = {};

  const addError = (key: keyof PhoneValidatorProps, message: string) => {
    if (throwErrorsAs === "throw-first" && Object.keys(errors).length === 0) {
      errors[key] = message;
      if (!safe) throw new Error(message);
    } else if (throwErrorsAs === "throw-last") {
      errors = { [key]: message };
      if (!safe) throw new Error(message);
    } else if (throwErrorsAs === "throw-all") {
      errors[key] = message;
    }
  };

  const getMessage = (
    key: keyof PhoneValidatorProps,
    defaultMsg: string,
    replacements: Record<string, string> = {}
  ) => {
    let msg = errorMsgs[key] ?? defaultMsg;
    for (const [placeholder, value] of Object.entries(replacements)) {
      msg = msg.replace(`{${placeholder}}`, value);
    }
    return msg;
  };

  const defaultCountryCodes =
    allowedCountryCodes.length >= 1 && allowedCountryCodes[0] === "*"
      ? getCountries().map((code) => `+${getCountryCallingCode(code)}`)
      : allowedCountryCodes;

  const sanitizedPhone = phone.replace(/[^+\d\s]/g, "");

  if (requireCountryCode && !sanitizedPhone.startsWith("+")) {
    addError(
      "requireCountryCode",
      getMessage(
        "requireCountryCode",
        defaultPhoneErrorMsgs.requireCountryCode!
      )
    );
  }

  const countryCodeMatch = sanitizedPhone.match(/^\+\d+/);
  const countryCode = countryCodeMatch ? countryCodeMatch[0] : "";
  const rawPhone = requireCountryCode
    ? parsePhoneNumberFromString(phone)?.nationalNumber ?? phone
    : phone;

  if (requireCountryCode && !defaultCountryCodes.includes(countryCode)) {
    addError(
      "allowedCountryCodes",
      getMessage(
        "allowedCountryCodes",
        defaultPhoneErrorMsgs.allowedCountryCodes!,
        {
          allowedCountryCodes: defaultCountryCodes.join(", "),
        }
      )
    );
  }

    if (!allowDashes && /-/.test(phone)) {
      addError(
        "allowDashes",
        getMessage("allowDashes", defaultPhoneErrorMsgs.allowDashes!, {})
      );
    }

    if (!allowParentheses) {
      const parenthesesPattern = /[()]/;
      
      if (parenthesesPattern.test(phone)) {
        addError(
          "allowParentheses",
          getMessage("allowParentheses", defaultPhoneErrorMsgs.allowParentheses!)
        );
      }
    }

    if (!/^[+\d\s\-()]+$/.test(phone)) {
      addError(
        "format",
        "Phone number contains invalid characters. Only digits, spaces, dashes, and parentheses are allowed."
      );
    }

  if (!rawPhone || rawPhone.length < minLen) {
    addError(
      "minLen",
      getMessage("minLen", defaultPhoneErrorMsgs.minLen!, {
        minLen: minLen.toString(),
      })
    );
  }

  if (!rawPhone || rawPhone.length > maxLen) {
    addError(
      "maxLen",
      getMessage("maxLen", defaultPhoneErrorMsgs.maxLen!, {
        maxLen: maxLen.toString(),
      })
    );
  }

  const phoneNumber = parsePhoneNumberFromString(phone);
  if (requireCountryCode && (!phoneNumber || !isValidPhoneNumber(phone))) {
    addError(
      "format",
      getMessage(
        "format",
        defaultPhoneErrorMsgs.format!
      )
    );
  }

  if (!safe && Object.keys(errors).length > 0) {
    if (["throw-first", "throw-last"].includes(throwErrorsAs)) {
      throw new PhoneValidationFailed(Object.values(errors)[0]);
    } else if (throwErrorsAs === "throw-all") {
      throw new PhoneValidationFailed(JSON.stringify(errors));
    }
  }

  return Object.keys(errors).length > 0 ? [false, errors] : [true, null];
};
