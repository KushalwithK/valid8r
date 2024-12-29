import { defaultNameProps, defaultNameErrorMsgs } from "../defaults";
import { NameValidationFailed } from "../errors/ValidationErrors";
import { NameValidatorProps } from "../utils/types";

export const validateName = (
  name: string,
  {
    onlyFirst = defaultNameProps.onlyFirst!,
    firstLast = defaultNameProps.firstLast!,
    fullNameWithMiddle = defaultNameProps.fullNameWithMiddle!,
    noSpChars = defaultNameProps.noSpChars!,
    minLen = defaultNameProps.minLen!,
    maxLen = defaultNameProps.maxLen!,
    minLenPerWord = defaultNameProps.minLenPerWord!,
    maxLenPerWord = defaultNameProps.maxLenPerWord!,
    allowNumbers = defaultNameProps.allowNumbers!,
    properCapitalized = defaultNameProps.properCapitalized!,
    noLeadingSpaces = defaultNameProps.noLeadingSpaces!,
    noTrailingSpaces = defaultNameProps.noTrailingSpaces!,
    noConsecutiveSpaces = defaultNameProps.noConsecutiveSpaces!,
    throwErrorsAs = defaultNameProps.throwErrorsAs!,
    safe = defaultNameProps.safe!,
  }: NameValidatorProps = {},
  errorMsgs: Partial<
    Record<keyof NameValidatorProps, string>
  > = defaultNameErrorMsgs
): [boolean, null | Partial<Record<keyof NameValidatorProps, string>>] => {
  let errors: Partial<Record<keyof NameValidatorProps, string>> = {};
  const trimmedName = name.trim();

  const addError = (key: keyof NameValidatorProps, message: string) => {
    if (throwErrorsAs === "throw-first" && Object.keys(errors).length === 0) {
      errors[key] = message;
      return [false, errors];
    } else if (throwErrorsAs === "throw-last") {
      errors = { [key]: message };
    } else if (throwErrorsAs === "throw-all") {
      errors[key] = message;
    }
  };

  const getMessage = (
    key: keyof NameValidatorProps,
    defaultMsg: string,
    replacements: Record<string, string> = {}
  ) => {
    let msg = errorMsgs[key] ?? defaultMsg;
    for (const [placeholder, value] of Object.entries(replacements)) {
      msg = msg.replace(`{${placeholder}}`, value);
    }
    return msg;
  };

  if (name.length < minLen) {
    addError(
      "minLen",
      getMessage("minLen", defaultNameErrorMsgs.minLen!, {
        minLen: minLen.toString(),
      })
    );
  }

  if (name.length > maxLen) {
    addError(
      "maxLen",
      getMessage("maxLen", defaultNameErrorMsgs.maxLen!, {
        maxLen: maxLen.toString(),
      })
    );
  }

  if (onlyFirst && trimmedName.split(/\s+/).length > 1) {
    addError(
      "onlyFirst",
      getMessage("onlyFirst", defaultNameErrorMsgs.onlyFirst!)
    );
  }

  if (firstLast && trimmedName.split(/\s+/).length < 2) {
    addError(
      "firstLast",
      getMessage("firstLast", defaultNameErrorMsgs.firstLast!)
    );
  }

  if (fullNameWithMiddle && trimmedName.split(/\s+/).length < 3) {
    addError(
      "fullNameWithMiddle",
      getMessage("fullNameWithMiddle", defaultNameErrorMsgs.fullNameWithMiddle!)
    );
  }

  if (noSpChars && /[^a-zA-Z0-9\s]/.test(trimmedName)) {
    addError(
      "noSpChars",
      getMessage("noSpChars", defaultNameErrorMsgs.noSpChars!)
    );
  }

  const words = trimmedName.split(/\s+/);
  words.forEach((word) => {
    if (word.length < minLenPerWord && !errors.minLenPerWord) {
      addError(
        "minLenPerWord",
        getMessage("minLenPerWord", defaultNameErrorMsgs.minLenPerWord!, {
          minLenPerWord: minLenPerWord.toString(),
        })
      );
    }
    if (word.length > maxLenPerWord && !errors.maxLenPerWord) {
      addError(
        "maxLenPerWord",
        getMessage("maxLenPerWord", defaultNameErrorMsgs.maxLenPerWord!, {
          maxLenPerWord: maxLenPerWord.toString(),
        })
      );
    }
  });

  if (!allowNumbers && /\d/.test(trimmedName)) {
    addError(
      "allowNumbers",
      getMessage("allowNumbers", defaultNameErrorMsgs.allowNumbers!)
    );
  }

  if (properCapitalized) {
    words.forEach((word) => {
      if (
        word.charAt(0) !== word.charAt(0).toUpperCase() ||
        word.slice(1) !== word.slice(1).toLowerCase()
      ) {
        addError(
          "properCapitalized",
          getMessage(
            "properCapitalized",
            defaultNameErrorMsgs.properCapitalized!
          )
        );
      }
    });
  }

  if (noLeadingSpaces && name.startsWith(" ")) {
    addError(
      "noLeadingSpaces",
      getMessage("noLeadingSpaces", defaultNameErrorMsgs.noLeadingSpaces!)
    );
  }

  if (noTrailingSpaces && name.endsWith(" ")) {
    addError(
      "noTrailingSpaces",
      getMessage("noTrailingSpaces", defaultNameErrorMsgs.noTrailingSpaces!)
    );
  }

  if (noConsecutiveSpaces && /\s{2,}/.test(trimmedName)) {
    addError(
      "noConsecutiveSpaces",
      getMessage(
        "noConsecutiveSpaces",
        defaultNameErrorMsgs.noConsecutiveSpaces!
      )
    );
  }

  if (!safe && Object.keys(errors).length > 0) {
    if (["throw-first", "throw-last"].includes(throwErrorsAs)) {
      throw new NameValidationFailed(Object.values(errors)[0]);
    } else if (throwErrorsAs === "throw-all") {
      throw new NameValidationFailed(JSON.stringify(errors));
    }
  }

  return Object.keys(errors).length > 0 ? [false, errors] : [true, null];
};
