import { defaultEmailErrorMsgs, defaultEmailProps } from "../defaults";
import { EmailValidationFailed } from "../errors/ValidationErrors";
import { EmailValidatorProps } from "../utils/types";

export const validateEmail = (
  email: string,
  {
    noSpChars = defaultEmailProps.noSpChars!,
    startWithNum = defaultEmailProps.startWithNum!,
    endWithNum = defaultEmailProps.endWithNum!,
    minLen = defaultEmailProps.minLen!,
    maxLen = defaultEmailProps.maxLen!,
    allowedDomains = defaultEmailProps.allowedDomains!,
    customDisposables = defaultEmailProps.customDisposables!,
    allowDisposables = defaultEmailProps.allowDisposables!,
    noLeading = defaultEmailProps.noLeading!,
    noTrailing = defaultEmailProps.noTrailing!,
    caseSensitive = defaultEmailProps.caseSensitive!,
    throwErrorsAs = defaultEmailProps.throwErrorsAs!,
    safe = defaultEmailProps.safe!,
  }: EmailValidatorProps = {},
  errorMsgs: Partial<
    Record<keyof EmailValidatorProps, string>
  > = defaultEmailErrorMsgs
): [boolean, null | Partial<Record<keyof EmailValidatorProps, string>>] => {
  let errors: Partial<Record<keyof EmailValidatorProps, string>> = {};

  const addError = (key: keyof EmailValidatorProps, message: string) => {
    if (throwErrorsAs === "throw-first" && Object.keys(errors).length === 0) {
      errors[key] = message;
      return [false, errors];
    } else if (throwErrorsAs === "throw-last") {
      errors = {};
      errors[key] = message;
    } else if (throwErrorsAs === "throw-all") {
      errors[key] = message;
    }
  };

  const getMessage = (
    key: keyof EmailValidatorProps,
    defaultMsg: string,
    replacements: Record<string, string> = {}
  ) => {
    let msg = errorMsgs[key] ?? defaultMsg;
    for (const [placeholder, value] of Object.entries(replacements)) {
      msg = msg.replace(`{${placeholder}}`, value);
    }
    return msg;
  };

  if (noSpChars) {
    const specialCharRegex = /[!#$%^&*()+=\[\]{};':"\\|,<>/?]/g;
    const invalidStartEndRegex =
      /^[!#$%^&*()+=\[\]{};':"\\|,<>/?@.]|[!#$%^&*()+=\[\]{};':"\\|,<>/?@.]$/;
    const beforeAtRegex = /([!#$%^&*()+=\[\]{};':"\\|,<>/?@.])@/;
    const afterAtRegex = /@([!#$%^&*()+=\[\]{};':"\\|,<>/?@.])/;

    // Check if the email starts or ends with a special character
    const startEndMatch = email.match(invalidStartEndRegex);
    if (startEndMatch) {
      addError(
        "noSpChars",
        getMessage(
          "noSpChars",
          `The email must not start or end with special characters. Found: '${startEndMatch[0]}'.`
        )
      );
    }

    // Check if the local part (before @) ends with a special character
    const beforeAtMatch = email.match(beforeAtRegex);
    if (beforeAtMatch) {
      addError(
        "noSpChars",
        getMessage(
          "noSpChars",
          `The email must not contain special characters immediately before '@'. Found: '${beforeAtMatch[1]}'.`
        )
      );
    }

    // Check if the domain part (after @) starts with a special character
    const afterAtMatch = email.match(afterAtRegex);
    if (afterAtMatch) {
      addError(
        "noSpChars",
        getMessage(
          "noSpChars",
          `The email must not contain special characters immediately after '@'. Found: '${afterAtMatch[1]}'.`
        )
      );
    }

    const specialCharMatch = email.match(specialCharRegex);
    if (specialCharMatch) {
      const firstOffendingChar = specialCharMatch[0];
      addError(
        "noSpChars",
        getMessage("noSpChars", defaultEmailErrorMsgs.noSpChars!, {
          allowedSpChars: ". and @",
          encounteredSpChar: firstOffendingChar,
        })
      );
    }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    addError("format", defaultEmailErrorMsgs.format!);
  }

  const disposableDomains = [
    "10minutemail.com",
    "mailinator.com",
    "temp-mail.org",
    "guerrillamail.com",
    "yopmail.com",
    "throwawaymail.com",
    "trashmail.com",
    "getnada.com",
    "maildrop.cc",
    "fakeinbox.com",
    "mintemail.com",
    "moakt.com",
    "mytrashmail.com",
    "spambog.com",
    "mailcatch.com",
    "dispostable.com",
    "spamgourmet.com",
    "temporary-mail.net",
    "mailsac.com",
    "mail.tm",
    ...customDisposables,
  ];

  const getDomain = (email: string) => email.split("@")[1]?.toLowerCase();

  if (email.length < minLen) {
    addError(
      "minLen",
      getMessage("minLen", defaultEmailErrorMsgs.minLen!, {
        minLen: minLen.toString(),
      })
    );
  }

  if (email.length > maxLen) {
    addError(
      "maxLen",
      getMessage("maxLen", defaultEmailErrorMsgs.maxLen!, {
        maxLen: maxLen.toString(),
      })
    );
  }

  if (!startWithNum && /^\d/.test(email)) {
    addError(
      "startWithNum",
      getMessage("startWithNum", defaultEmailErrorMsgs.startWithNum!)
    );
  }

  if (!endWithNum && /\d$/.test(email)) {
    addError(
      "endWithNum",
      getMessage("endWithNum", defaultEmailErrorMsgs.endWithNum!)
    );
  }

  const domain = getDomain(email);

  if (allowedDomains.length <= 0) {
    addError(
      "allowedDomains",
      "No Domain Names are allowed, either allow all or select domains"
    );
  }

  if (allowedDomains.length >= 1 && allowedDomains[0] !== "*" && domain) {
    const isDomainAllowed = allowedDomains.some((allowedDomain) => {
      if (allowedDomain.startsWith("*.")) {
        const wildcardSuffix = allowedDomain.slice(1);
        return domain.endsWith(wildcardSuffix);
      }

      if (allowedDomain.endsWith(".*")) {
        const wildcardPrefix = allowedDomain.slice(0, -2);
        return domain.startsWith(wildcardPrefix);
      }

      return domain === allowedDomain;
    });

    if (!isDomainAllowed) {
      addError(
        "allowedDomains",
        getMessage("allowedDomains", defaultEmailErrorMsgs.allowedDomains!, {
          allowedDomains: allowedDomains.join(", "),
        })
      );
    }
  }

  if (
    !allowDisposables &&
    domain &&
    disposableDomains.includes(domain) &&
    !allowedDomains.includes(domain)
  ) {
    addError(
      "allowDisposables",
      getMessage("allowDisposables", defaultEmailErrorMsgs.allowDisposables!)
    );
  }

  if (noLeading && email.startsWith(" ")) {
    addError(
      "noLeading",
      getMessage("noLeading", defaultEmailErrorMsgs.noLeading!)
    );
  }

  if (noTrailing && email.endsWith(" ")) {
    addError(
      "noTrailing",
      getMessage("noTrailing", defaultEmailErrorMsgs.noTrailing!)
    );
  }

  if (caseSensitive && email !== email.toLowerCase()) {
    addError(
      "caseSensitive",
      getMessage("caseSensitive", defaultEmailErrorMsgs.caseSensitive!)
    );
  }

  if (!safe && Object.keys(errors).length > 0) {
    if (["throw-first", "throw-last"].includes(throwErrorsAs)) {
      throw new EmailValidationFailed(Object.values(errors)[0]);
    } else if (throwErrorsAs === "throw-all") {
      throw new EmailValidationFailed(JSON.stringify(errors));
    }
  }

  return Object.keys(errors).length > 0 ? [false, errors] : [true, null];
};
