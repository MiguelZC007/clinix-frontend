import { describe, it, expect } from 'vitest';
import { loginSchema, forgotPasswordSchema } from '../schemas/login.schema';

describe('loginSchema', () => {
  const validLogin = {
    email: 'test@example.com',
    password: 'password123',
  };

  it('valida login correcto', () => {
    expect(loginSchema.parse(validLogin)).toEqual(validLogin);
  });

  it('rechaza email vacio', () => {
    expect(() => loginSchema.parse({ ...validLogin, email: '' })).toThrow();
  });

  it('rechaza email invalido', () => {
    expect(() =>
      loginSchema.parse({ ...validLogin, email: 'invalid-email' })
    ).toThrow();
  });

  it('rechaza password muy corto', () => {
    expect(() =>
      loginSchema.parse({ ...validLogin, password: '12345' })
    ).toThrow();
  });

  it('rechaza password vacio', () => {
    expect(() => loginSchema.parse({ ...validLogin, password: '' })).toThrow();
  });

  it('rechaza campos faltantes', () => {
    expect(() => loginSchema.parse({})).toThrow();
    expect(() => loginSchema.parse({ email: 'test@example.com' })).toThrow();
  });
});

describe('forgotPasswordSchema', () => {
  const validEmail = {
    email: 'test@example.com',
  };

  it('valida email correcto', () => {
    expect(forgotPasswordSchema.parse(validEmail)).toEqual(validEmail);
  });

  it('rechaza email vacio', () => {
    expect(() => forgotPasswordSchema.parse({ email: '' })).toThrow();
  });

  it('rechaza email invalido', () => {
    expect(() =>
      forgotPasswordSchema.parse({ email: 'invalid-email' })
    ).toThrow();
  });

  it('rechaza campo faltante', () => {
    expect(() => forgotPasswordSchema.parse({})).toThrow();
  });
});
