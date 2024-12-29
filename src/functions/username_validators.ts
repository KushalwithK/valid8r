import { defaultUsernameErrorMsgs, defaultUsernameProps } from "../defaults";
import { UsernameValidationFailed } from "../errors/ValidationErrors";
import { UsernameValidatorProps } from "../utils/types";

export const validateUsername = (
  username: string,
  {
    minLen = defaultUsernameProps.minLen!,
    maxLen = defaultUsernameProps.maxLen!,
    allowNumbers = defaultUsernameProps.allowNumbers!,
    allowUnderscores = defaultUsernameProps.allowUnderscores!,
    allowDashes = defaultUsernameProps.allowDashes!,
    allowSpecialChars = defaultUsernameProps.allowSpecialChars!,
    allowSpaces = defaultUsernameProps.allowSpaces!,
    allowUppercase = defaultUsernameProps.allowUppercase!,
    customRegex = defaultUsernameProps.customRegex,
    throwErrorsAs = defaultUsernameProps.throwErrorsAs!,
    safe = defaultUsernameProps.safe!,
  }: UsernameValidatorProps = {},
  errorMsgs: Partial<
    Record<keyof UsernameValidatorProps, string>
  > = defaultUsernameErrorMsgs
): [boolean, null | Partial<Record<keyof UsernameValidatorProps, string>>] => {
  let errors: Partial<Record<keyof UsernameValidatorProps, string>> = {};

  const addError = (key: keyof UsernameValidatorProps, message: string) => {
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
    key: keyof UsernameValidatorProps,
    defaultMsg: string,
    replacements: Record<string, string> = {}
  ): string => {
    let msg = errorMsgs[key] ?? defaultMsg;
    for (const [placeholder, value] of Object.entries(replacements)) {
      msg = msg.replace(`{${placeholder}}`, value);
    }
    return msg;
  };

  if (username.length < minLen) {
    addError(
      "minLen",
      getMessage("minLen", defaultUsernameErrorMsgs.minLen!, {
        minLen: minLen.toString(),
      })
    );
  }
  if (username.length > maxLen) {
    addError(
      "maxLen",
      getMessage("maxLen", defaultUsernameErrorMsgs.maxLen!, {
        maxLen: maxLen.toString(),
      })
    );
  }

  const basePattern: string[] = [];
  if (allowUppercase) {
    basePattern.push("A-Z");
  } else if (/[A-Z]/.test(username)) {
    addError(
      "allowUppercase",
      getMessage("allowUppercase", defaultUsernameErrorMsgs.allowUppercase!, {})
    );
  }
  basePattern.push("a-z"); // Lowercase letters are always allowed
  if (allowNumbers) {
    basePattern.push("0-9");
  } else if (/\d/.test(username)) {
    addError(
      "allowNumbers",
      getMessage("allowNumbers", defaultUsernameErrorMsgs.allowNumbers!, {})
    );
  }
  if (allowUnderscores) {
    basePattern.push("_");
  } else if (/_/.test(username)) {
    addError(
      "allowUnderscores",
      getMessage(
        "allowUnderscores",
        defaultUsernameErrorMsgs.allowUnderscores!,
        {}
      )
    );
  }
  if (allowDashes) {
    basePattern.push("-");
  } else if (/-/.test(username)) {
    addError(
      "allowDashes",
      getMessage("allowDashes", defaultUsernameErrorMsgs.allowDashes!, {})
    );
  }
  if (allowSpaces) {
    basePattern.push("\\s");
  } else if (/\s/.test(username)) {
    addError(
      "allowSpaces",
      getMessage("allowSpaces", defaultUsernameErrorMsgs.allowSpaces!, {})
    );
  }
  if (Array.isArray(allowSpecialChars)) {
    basePattern.push(allowSpecialChars.map((char) => `\\${char}`).join(""));
  } else if (allowSpecialChars) {
    basePattern.push("\\W");
  } else if (
    /[\W]/.test(username) &&
    (!allowSpaces || !/\s/.test(username)) &&
    !/[_-]/.test(username)
  ) {
    addError(
      "allowSpecialChars",
      getMessage(
        "allowSpecialChars",
        defaultUsernameErrorMsgs.allowSpecialChars!,
        {}
      )
    );
  }

  const allowedRegex = new RegExp(`^[${basePattern.join("")}]+$`);
  if (!allowedRegex.test(username)) {
    addError(
      "allowSpecialChars",
      getMessage(
        "allowSpecialChars",
        defaultUsernameErrorMsgs.allowSpecialChars!,
        {}
      )
    );
  }

  if (customRegex && !customRegex.test(username)) {
    addError(
      "customRegex",
      getMessage("customRegex", defaultUsernameErrorMsgs.customRegex!, {
        format: String(customRegex),
      })
    );
  }

  if (!safe && Object.keys(errors).length > 0) {
    if (["throw-first", "throw-last"].includes(throwErrorsAs)) {
      throw new UsernameValidationFailed(Object.values(errors)[0]);
    } else if (throwErrorsAs === "throw-all") {
      throw new UsernameValidationFailed(JSON.stringify(errors));
    }
  }

  return Object.keys(errors).length > 0 ? [false, errors] : [true, null];
};
