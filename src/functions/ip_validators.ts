import { defaultIPAddressErrorMsgs, defaultIPAddressProps } from "../defaults";
import { IPValidationFailed } from "../errors/ValidationErrors";
import { IPAddressValidatorProps } from "../utils/types";

export const validateIPAddress = (
  ip: string,
  {
    version = '*',
    allowPrivate = defaultIPAddressProps.allowPrivate!,
    allowLoopback = defaultIPAddressProps.allowLoopback!,
    throwErrorsAs = defaultIPAddressProps.throwErrorsAs!,
    safe = defaultIPAddressProps.safe!,
  }: IPAddressValidatorProps = {},
  errorMsgs: Partial<
    Record<keyof IPAddressValidatorProps, string>
  > = defaultIPAddressErrorMsgs
): [boolean, null | Partial<Record<keyof IPAddressValidatorProps, string>>] => {
  let errors: Partial<Record<keyof IPAddressValidatorProps, string>> = {};

  const addError = (key: keyof IPAddressValidatorProps, message: string) => {
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
    key: keyof IPAddressValidatorProps,
    defaultMsg: string,
    replacements: Record<string, string> = {}
  ): string => {
    let msg = errorMsgs[key] ?? defaultMsg;
    for (const [placeholder, value] of Object.entries(replacements)) {
      msg = msg.replace(`{${placeholder}}`, value);
    }
    return msg;
  };

  const isIPv4 = (address: string) =>
    /^(([0-9]{1,3}\.){3}[0-9]{1,3})$/.test(address) &&
    address
      .split(".")
      .every((octet) => parseInt(octet, 10) >= 0 && parseInt(octet, 10) <= 255);

  const isIPv6 = (address: string) =>
    /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/.test(address);

  const isPrivateIPv4 = (address: string) => {
    const parts = address.split(".").map(Number);
    return (
      parts[0] === 10 ||
      (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
      (parts[0] === 192 && parts[1] === 168)
    );
  };

  const isLoopbackIPv4 = (address: string) => address.startsWith("127.");
  const isLoopbackIPv6 = (address: string) => address === "::1";

  if (version === "v4" && !isIPv4(ip)) {
    addError(
      "version",
      getMessage("version", defaultIPAddressErrorMsgs.version!)
    );
  } else if (version === "v6" && !isIPv6(ip)) {
    addError(
      "version",
      getMessage("version", defaultIPAddressErrorMsgs.version!)
    );
  } else if (version === '*' && !isIPv4(ip) && !isIPv6(ip)) {
    addError(
      "version",
      getMessage("format", defaultIPAddressErrorMsgs.format!)
    );
  }

  if (!allowPrivate && isIPv4(ip) && isPrivateIPv4(ip)) {
    addError(
      "allowPrivate",
      getMessage("allowPrivate", defaultIPAddressErrorMsgs.allowPrivate!)
    );
  }

  if (
    !allowLoopback &&
    ((isIPv4(ip) && isLoopbackIPv4(ip)) || (isIPv6(ip) && isLoopbackIPv6(ip)))
  ) {
    addError(
      "allowLoopback",
      getMessage("allowLoopback", defaultIPAddressErrorMsgs.allowLoopback!)
    );
  }

  if (!safe && Object.keys(errors).length > 0) {
    if (["throw-first", "throw-last"].includes(throwErrorsAs)) {
      throw new IPValidationFailed(Object.values(errors)[0]);
    } else if (throwErrorsAs === "throw-all") {
      throw new IPValidationFailed(JSON.stringify(errors));
    }
  }

  return Object.keys(errors).length > 0 ? [false, errors] : [true, null];
};
