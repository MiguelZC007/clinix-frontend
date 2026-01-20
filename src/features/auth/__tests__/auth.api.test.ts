import { describe, it, expect } from 'vitest';
import { login, forgotPassword, resetPassword, logout } from '../api/auth.api';

describe('login', () => {
  it('inicia sesion con credenciales validas', async () => {
    const result = await login({
      email: 'test@test.com',
      password: 'password123',
    });

    expect(result.user).toBeDefined();
    expect(result.user.email).toBe('test@test.com');
    expect(result.accessToken).toBeDefined();
    expect(result.refreshToken).toBeDefined();
  });

  it('lanza error con credenciales invalidas', async () => {
    await expect(
      login({
        email: 'test@test.com',
        password: 'wrongpassword',
      })
    ).rejects.toThrow();
  });
});

describe('forgotPassword', () => {
  it('envia email de recuperacion', async () => {
    await expect(
      forgotPassword({ email: 'test@example.com' })
    ).resolves.not.toThrow();
  });
});

describe('resetPassword', () => {
  it('resetea contraseña correctamente', async () => {
    await expect(
      resetPassword({
        token: 'valid-token',
        password: 'newpassword123',
        confirmPassword: 'newpassword123',
      })
    ).resolves.not.toThrow();
  });
});

describe('logout', () => {
  it('cierra sesion correctamente', async () => {
    await expect(logout()).resolves.not.toThrow();
  });
});
