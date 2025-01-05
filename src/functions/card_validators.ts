import { defaultCardErrorMsgs, defaultCardProps } from "../defaults";
import { CardValidationFailed } from "../errors/ValidationErrors";
import { CardDetails } from "../utils/types";

export const validateCard = (
  {
    number,
    expirationDate,
    cvv,
    cardHolderName,
    throwErrorsAs = defaultCardProps.throwErrorsAs!,
    safe = defaultCardProps.safe!,
  }: CardDetails,
  errorMsgs: Partial<Record<keyof CardDetails, string>> = defaultCardErrorMsgs
): [boolean, null | Partial<Record<keyof CardDetails, string>>] => {
  let errors: Partial<Record<keyof CardDetails, string>> = {};

  const addError = (key: keyof CardDetails, message: string) => {
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
    key: keyof CardDetails,
    defaultMsg: string,
    replacements: Record<string, string> = {}
  ) => {
    let msg = errorMsgs[key] ?? defaultMsg;
    for (const [placeholder, value] of Object.entries(replacements)) {
      msg = msg.replace(`{${placeholder}}`, value);
    }
    return msg;
  };

  const isValidCardNumber = (number: string): boolean => {
    const cleaned = number.replace(/\D/g, "");
    if (!/^\d{13,19}$/.test(cleaned)) return false;

    let sum = 0;
    let shouldDouble = false;
    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned.charAt(i), 10);

      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }

      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
  };

  if (!isValidCardNumber(number)) {
    addError("number", getMessage("number", defaultCardErrorMsgs.number));
  }

  if (
    !/^\d{2}\/\d{2}$/.test(expirationDate) ||
    (() => {
      const [month, year] = expirationDate.split("/").map(Number);
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear() % 100;
      return (
        month < 1 ||
        month > 12 ||
        year < currentYear ||
        (year >= currentYear && month < currentMonth)
      );
    })()
  ) {
    addError(
      "expirationDate",
      getMessage("expirationDate", defaultCardErrorMsgs.expirationDate)
    );
  }

  if (!/^\d{3}$/.test(cvv.toString())) {
    addError("cvv", getMessage("cvv", defaultCardErrorMsgs.cvv));
  }

  if (
    !cardHolderName ||
    typeof cardHolderName !== "string" ||
    cardHolderName.trim().length < 3 ||
    /[^a-zA-Z\s]/.test(cardHolderName)
  ) {
    addError(
      "cardHolderName",
      getMessage("cardHolderName", defaultCardErrorMsgs.cardHolderName)
    );
  }

  if (!safe && Object.keys(errors).length > 0) {
    if (["throw-first", "throw-last"].includes(throwErrorsAs)) {
      throw new CardValidationFailed(Object.values(errors)[0]);
    } else if (throwErrorsAs === "throw-all") {
      throw new CardValidationFailed(JSON.stringify(errors));
    }
  }

  return Object.keys(errors).length > 0 ? [false, errors] : [true, null];
};
