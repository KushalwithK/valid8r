import { defaultCardErrorMsgs } from "../defaults";
import { CardDetails } from "../utils/types";

export const validateCard = (
  {
    number,
    expirationDate,
    cvv,
    cardHolderName,
    throwErrorsAs = "throw-all",
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
    !expirationDate ||
    !(expirationDate instanceof Date) ||
    expirationDate < new Date()
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

  return Object.keys(errors).length > 0 ? [false, errors] : [true, null];
};
