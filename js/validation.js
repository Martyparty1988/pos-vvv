class InputValidator {
  static validateNumber(value, options = {}) {
    const { min = 0, allowZero = true } = options;
    const number = parseFloat(value);
    if (isNaN(number)) {
      return {
        isValid: false,
        message: 'Prosím zadejte platné číslo'
      };
    }
    if (number < min || (!allowZero && number === 0)) {
      return {
        isValid: false,
        message: `Číslo musí být ${allowZero ? '' : 'větší než nula a '}minimálně ${min}`
      };
    }
    return {
      isValid: true,
      value: number
    };
  }
  static validateText(value, options = {}) {
    const { minLength = 1, maxLength = 100 } = options;
    const text = value.trim();
    if (text.length < minLength) {
      return {
        isValid: false,
        message: `Text musí obsahovat alespoň ${minLength} znak${minLength === 1 ? '' : 'y'}`
      };
    }
    if (text.length > maxLength) {
      return {
        isValid: false,
        message: `Text nesmí být delší než ${maxLength} znaků`
      };
    }
    return {
      isValid: true,
      value: text
    };
  }
}
export { InputValidator };
