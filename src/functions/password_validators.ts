import { PasswordValidatorProps } from "../utils/types";
import { defaultPasswordErrorMsgs, defaultPasswordProps } from "../defaults";
import { PasswordValidationFailed } from "../errors/ValidationErrors";

export const validatePassword = (
  password: string,
  {
    minLen = defaultPasswordProps.minLen!,
    maxLen = defaultPasswordProps.maxLen!,
    requireSpChars = defaultPasswordProps.requireSpChars!,
    requireNum = defaultPasswordProps.requireNum!,
    requireUpper = defaultPasswordProps.requireUpper!,
    requireLower = defaultPasswordProps.requireLower!,
    noConsecutiveSpaces = defaultPasswordProps.noConsecutiveSpaces!,
    throwErrorsAs = defaultPasswordProps.throwErrorsAs!,
    safe = defaultPasswordProps.safe!,
  }: PasswordValidatorProps = {},
  errorMsgs: Partial<
    Record<keyof PasswordValidatorProps, string>
  > = defaultPasswordErrorMsgs
): [boolean, null | Partial<Record<keyof PasswordValidatorProps, string>>] => {
  let errors: Partial<Record<keyof PasswordValidatorProps, string>> = {};

  const addError = (key: keyof PasswordValidatorProps, message: string) => {
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
    key: keyof PasswordValidatorProps,
    defaultMsg: string,
    replacements: Record<string, string> = {}
  ) => {
    let msg = errorMsgs[key] ?? defaultMsg;
    for (const [placeholder, value] of Object.entries(replacements)) {
      msg = msg.replace(`{${placeholder}}`, value);
    }
    return msg;
  };

  if (password.length < minLen) {
    addError(
      "minLen",
      getMessage("minLen", defaultPasswordErrorMsgs.minLen!, {
        minLen: minLen.toString(),
      })
    );
  }
  if (password.length > maxLen) {
    addError(
      "maxLen",
      getMessage("maxLen", defaultPasswordErrorMsgs.maxLen!, {
        maxLen: maxLen.toString(),
      })
    );
  }

  if (requireSpChars) {
    let spCharPattern = "";
    if (Array.isArray(requireSpChars)) {
      spCharPattern = requireSpChars.map((char) => `\\${char}`).join("");
    } else {
      spCharPattern = `[^a-zA-Z0-9\\s]`;
    }
    const spCharRegex = new RegExp(`[${spCharPattern}]`);
    if (!spCharRegex.test(password)) {
      addError(
        "requireSpChars",
        getMessage(
          "requireSpChars",
          Array.isArray(requireSpChars)
            ? defaultPasswordErrorMsgs.requireSpChars!
            : "Password must include at least one special character (excluding spaces).",
          {
            allowedSpChars: Array.isArray(requireSpChars)
              ? requireSpChars.join(", ")
              : "",
          }
        )
      );
    }
  }  

  if (requireNum && !/\d/.test(password)) {
    addError(
      "requireNum",
      getMessage("requireNum", defaultPasswordErrorMsgs.requireNum!)
    );
  }

  if (requireUpper && !/[A-Z]/.test(password)) {
    addError(
      "requireUpper",
      getMessage(
        "requireUpper",
        getMessage("requireUpper", defaultPasswordErrorMsgs.requireUpper!)
      )
    );
  }

  if (requireLower && !/[a-z]/.test(password)) {
    addError(
      "requireLower",
      getMessage(
        "requireLower",
        getMessage("requireLower", defaultPasswordErrorMsgs.requireLower!)
      )
    );
  }

  if (noConsecutiveSpaces && /\s{2,}/.test(password)) {
    addError(
      "noConsecutiveSpaces",
      getMessage(
        "noConsecutiveSpaces",
        getMessage(
          "noConsecutiveSpaces",
          defaultPasswordErrorMsgs.noConsecutiveSpaces!
        )
      )
    );
  }

  if (!safe && Object.keys(errors).length > 0) {
    if (["throw-first", "throw-last"].includes(throwErrorsAs)) {
      throw new PasswordValidationFailed(Object.values(errors)[0]);
    } else if (throwErrorsAs === "throw-all") {
      throw new PasswordValidationFailed(JSON.stringify(errors));
    }
  }

  return Object.keys(errors).length > 0 ? [false, errors] : [true, null];
};
