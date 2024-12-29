import { defaultDateErrorMsgs, defaultDateProps } from "../defaults";
import { DateValidatorProps } from "../utils/types";
import { DateValidationFailed } from "../errors/ValidationErrors";

export const validateDate = (
  date: string,
  {
    format = defaultDateProps.format!,
    minDate = defaultDateProps.minDate!,
    maxDate = defaultDateProps.maxDate!,
    allowFutureDates = defaultDateProps.allowFutureDates!,
    allowPastDates = defaultDateProps.allowPastDates!,
    requireLeapYear = defaultDateProps.requireLeapYear!,
    throwErrorsAs = defaultDateProps.throwErrorsAs!,
    safe = defaultDateProps.safe!,
  }: DateValidatorProps = {},
  errorMsgs: Partial<
    Record<keyof DateValidatorProps, string>
  > = defaultDateErrorMsgs
): [boolean, null | Partial<Record<keyof DateValidatorProps, string>>] => {
  let errors: Partial<Record<keyof DateValidatorProps, string>> = {};

  const addError = (key: keyof DateValidatorProps, message: string) => {
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
    key: keyof DateValidatorProps,
    defaultMsg: string,
    replacements: Record<string, string> = {}
  ) => {
    let msg = errorMsgs[key] ?? defaultMsg;
    for (const [placeholder, value] of Object.entries(replacements)) {
      msg = msg.replace(`{${placeholder}}`, value);
    }
    return msg;
  };

  const isLeapYear = (year: number): boolean =>
    (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

  const parseDate = (input: string, format: string): Date | null => {
    const dateParts = input.split("-");
    let _year: string, _month: string, _day: string;
    let year: number, month: number, day: number;

    if (format === "YYYY-MM-DD") {
      [_year, _month, _day] = dateParts.map(String);
      [year, month, day] = dateParts.map(Number);
    } else if (format === "DD-MM-YYYY") {
      [_day, _month, _year] = dateParts.map(String);
      [day, month, year] = dateParts.map(Number);
    } else if (format === "MM-DD-YYYY") {
      [_month, _day, _year] = dateParts.map(String);
      [month, day, year] = dateParts.map(Number);
    } else {
      return null;
    }

    if (_month.toString().length != 2 || _day.toString().length != 2) {
      addError(
        "format",
        getMessage("format", defaultDateErrorMsgs.format!, { format })
      );
      return null;
    }

    if (
      !year ||
      !month ||
      !day ||
      month < 1 ||
      month > 12 ||
      day < 1 ||
      day > 31
    ) {
      return null;
    }

    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
      ? date
      : null;
  };

  const parsedDate = parseDate(date, format);
  if (!parsedDate) {
    addError(
      "format",
      getMessage("format", defaultDateErrorMsgs.format!, { format })
    );
  }

  const validateBoundaryDate = (
    boundaryDate: string,
    key: keyof DateValidatorProps
  ) => {
    const parsedBoundaryDate = parseDate(boundaryDate, format);
    if (!parsedBoundaryDate) {
      addError(
        key,
        getMessage(
          key,
          `Invalid ${
            key === "minDate" ? "minimum" : "maximum"
          } date format. Expected {format}.`,
          { format }
        )
      );
    }
    return parsedBoundaryDate;
  };

  const parsedMinDate = minDate
    ? validateBoundaryDate(minDate, "minDate")
    : null;
  const parsedMaxDate = maxDate
    ? validateBoundaryDate(maxDate, "maxDate")
    : null;

  if (parsedMinDate && parsedDate && parsedDate < parsedMinDate) {
    addError(
      "minDate",
      getMessage("minDate", defaultDateErrorMsgs.minDate!, { minDate })
    );
  }

  if (parsedMaxDate && parsedDate && parsedDate > parsedMaxDate) {
    addError(
      "maxDate",
      getMessage("maxDate", defaultDateErrorMsgs.maxDate!, { maxDate })
    );
  }

  const now = new Date();
  if (!allowFutureDates && parsedDate && parsedDate > now) {
    addError(
      "allowFutureDates",
      getMessage("allowFutureDates", defaultDateErrorMsgs.allowFutureDates!)
    );
  }

  if (!allowPastDates && parsedDate && parsedDate < now) {
    addError(
      "allowPastDates",
      getMessage("allowPastDates", defaultDateErrorMsgs.allowPastDates!)
    );
  }

  if (requireLeapYear && parsedDate && !isLeapYear(parsedDate.getFullYear())) {
    addError(
      "requireLeapYear",
      getMessage("requireLeapYear", defaultDateErrorMsgs.requireLeapYear!)
    );
  }

  if (!safe && Object.keys(errors).length > 0) {
    if (["throw-first", "throw-last"].includes(throwErrorsAs)) {
      throw new DateValidationFailed(Object.values(errors)[0]);
    } else if (throwErrorsAs === "throw-all") {
      throw new DateValidationFailed(JSON.stringify(errors));
    }
  }

  return Object.keys(errors).length > 0 ? [false, errors] : [true, null];
};
