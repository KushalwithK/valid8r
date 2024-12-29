import { defaultAddressErrorMsgs, defaultAddressProps } from "../defaults";
import { AddressValidatorProps } from "../utils/types";

export const validateAddress = (
  address: string,
  {
    minLen = defaultAddressProps.minLen!,
    maxLen = defaultAddressProps.maxLen!,
    allowedSpChars = defaultAddressProps.allowedSpChars!,
    properCapitalization = defaultAddressProps.properCapitalization!,
    noConsecutiveSpaces = defaultAddressProps.noConsecutiveSpaces!,
    throwErrorsAs = defaultAddressProps.throwErrorsAs!,
    safe = defaultAddressProps.safe!,
  }: AddressValidatorProps = {},
  errorMsgs: Partial<
    Record<keyof AddressValidatorProps, string>
  > = defaultAddressErrorMsgs
): [boolean, null | Partial<Record<keyof AddressValidatorProps, string>>] => {
  let errors: Partial<Record<keyof AddressValidatorProps, string>> = {};

  const addError = (key: keyof AddressValidatorProps, message: string) => {
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
    key: keyof AddressValidatorProps,
    defaultMsg: string,
    replacements: Record<string, string> = {}
  ) => {
    let msg = errorMsgs[key] ?? defaultMsg;
    for (const [placeholder, value] of Object.entries(replacements)) {
      msg = msg.replace(`{${placeholder}}`, value);
    }
    return msg;
  };

  const buildSpecialCharsPattern = () => {
    if (typeof allowedSpChars === "boolean") return "";
    if (Array.isArray(allowedSpChars)) {
      return allowedSpChars.map((char) => `\\${char}`).join("");
    }
    return "";
  };

  // Validations
  if (address.length < minLen) {
    addError(
      "minLen",
      getMessage("minLen", defaultAddressErrorMsgs.minLen!, {
        minLen: minLen.toString(),
      })
    );
  }

  if (address.length > maxLen) {
    addError(
      "maxLen",
      getMessage("maxLen", defaultAddressErrorMsgs.maxLen!, {
        maxLen: maxLen.toString(),
      })
    );
  }

  const specialCharsPattern = buildSpecialCharsPattern();
  const invalidCharsRegex = new RegExp(`[^a-zA-Z0-9\\s${specialCharsPattern}]`);

  if (
    typeof allowedSpChars === "boolean" &&
    !allowedSpChars &&
    !invalidCharsRegex.test(address)
  ) {
    addError(
      "allowedSpChars",
      getMessage(
        "allowedSpChars",
        "No Special Characters are allowed!"
      )
    );
  }

  if (
    Array.isArray(allowedSpChars) &&
    !invalidCharsRegex.test(address)
  ) {
    addError(
      "allowedSpChars",
      getMessage("allowedSpChars", defaultAddressErrorMsgs.allowedSpChars!, {
        allowedSpChars: allowedSpChars.join(" or "),
      })
    );
  }

  if (properCapitalization) {
    const words = address.split(/\s+/);
    const isProperCapitalization = words.every(
      (word) =>
        word.charAt(0) === word.charAt(0).toUpperCase() &&
        word.slice(1) === word.slice(1).toLowerCase()
    );
    if (!isProperCapitalization) {
      addError(
        "properCapitalization",
        getMessage(
          "properCapitalization",
          defaultAddressErrorMsgs.properCapitalization!
        )
      );
    }
  }

  if (noConsecutiveSpaces && /\s{2,}/.test(address)) {
    addError(
      "noConsecutiveSpaces",
      getMessage(
        "noConsecutiveSpaces",
        defaultAddressErrorMsgs.noConsecutiveSpaces!
      )
    );
  }

  if (!safe && Object.keys(errors).length > 0) {
    if (throwErrorsAs === "throw-first") {
      throw new Error(Object.values(errors)[0]);
    } else if (throwErrorsAs === "throw-last") {
      throw new Error(Object.values(errors).pop()!);
    } else if (throwErrorsAs === "throw-all") {
      throw new Error(JSON.stringify(errors));
    }
  }

  return Object.keys(errors).length > 0 ? [false, errors] : [true, null];
};