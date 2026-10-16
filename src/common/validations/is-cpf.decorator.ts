import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function isValidCpfAlgorithm(cpf: string): boolean {
  if (typeof cpf !== 'string') return false;

  const cleanCpf = cpf.replace(/\D/g, '');

  if (cleanCpf.length !== 11) return false;

  // Rejeita CPFs com todos os dígitos iguais (ex.: '11111111111', '00000000000')
  if (/^(\d)\1{10}$/.test(cleanCpf)) return false;

  // Validação do 1º dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCpf.charAt(i), 10) * (10 - i);
  }
  let rest = 11 - (sum % 11);
  const firstVerifier = rest >= 10 ? 0 : rest;

  if (firstVerifier !== parseInt(cleanCpf.charAt(9), 10)) {
    return false;
  }

  // Validação do 2º dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCpf.charAt(i), 10) * (11 - i);
  }
  rest = 11 - (sum % 11);
  const secondVerifier = rest >= 10 ? 0 : rest;

  return secondVerifier === parseInt(cleanCpf.charAt(10), 10);
}

export function IsCpf(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isCpf',
      target: object.constructor,
      propertyName,
      options: {
        message: 'O CPF informado é inválido',
        ...validationOptions,
      },
      validator: {
        validate(value: unknown, _args: ValidationArguments) {
          if (typeof value !== 'string') return false;
          return isValidCpfAlgorithm(value);
        },
      },
    });
  };
}
