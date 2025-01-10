import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function isbnValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null; // No se aplica la validación si no hay valor
    }

    // Normalizar el valor eliminando guiones
    const normalizedValue = value.replace(/-/g, '');

    // Validación para ISBN-10
    const isbn10Regex = /^(?:\d{9}[\dX])$/;
    const isValidISBN10 = isbn10Regex.test(normalizedValue);

    // Validación para ISBN-13
    const isbn13Regex = /^(?:978|979)\d{10}$/;
    const isValidISBN13 = isbn13Regex.test(normalizedValue);

    // Comprobar la validez de los dígitos del ISBN-10
    const isValidISBN10CheckDigit =
      isValidISBN10 && checkIsbn10Checksum(normalizedValue);

    // Comprobar la validez de los dígitos del ISBN-13
    const isValidISBN13CheckDigit =
      isValidISBN13 && checkIsbn13Checksum(normalizedValue);

    return isValidISBN10CheckDigit || isValidISBN13CheckDigit
      ? null
      : { invalidIsbn: true };
  };
}
// Función para validar el dígito de control de ISBN-10
function checkIsbn10Checksum(isbn: string): boolean {
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(isbn[i]) * (10 - i);
  }
  const checkDigit = isbn[9] === 'X' ? 10 : parseInt(isbn[9]);
  sum += checkDigit;
  return sum % 11 === 0;
}

// Función para validar el dígito de control de ISBN-13
function checkIsbn13Checksum(isbn: string): boolean {
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(isbn[i]) * (i % 2 === 0 ? 1 : 3);
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit === parseInt(isbn[12]);
}

export function positiveIntegerValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    const isValid = Number.isInteger(value) && value > 0;

    return isValid ? null : { positiveInteger: true };
  };
}
export function notUndefinedValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return control.value === undefined ? { undefinedValue: true } : null;
  };
}
