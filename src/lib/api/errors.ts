import { AxiosError } from 'axios';
import { ProblemDetailsSchema } from '@/types/contracts/errors';

export type ErrorCode =
  | 'UNKNOWN_ERROR'
  | 'CLIENT_ERROR'
  | 'NETWORK_ERROR'
  | 'SERVER_ERROR'
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND';

export const ERROR_TRANSLATION_KEYS: Record<ErrorCode, string> = {
  UNKNOWN_ERROR: 'errors.serverError',
  CLIENT_ERROR: 'errors.serverError',
  NETWORK_ERROR: 'errors.networkError',
  SERVER_ERROR: 'errors.serverError',
  VALIDATION_ERROR: 'errors.validationError',
  UNAUTHORIZED: 'errors.unauthorized',
  FORBIDDEN: 'errors.forbidden',
  NOT_FOUND: 'errors.notFound',
};

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly translationKey: string;
  public readonly errors?: Record<string, string[]>;
  public readonly status?: number;

  constructor(
    message: string,
    code: ErrorCode = 'UNKNOWN_ERROR',
    status?: number,
    errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.translationKey = ERROR_TRANSLATION_KEYS[code];
    this.status = status;
    this.errors = errors;
  }
}

function getErrorCodeFromStatus(status?: number): ErrorCode {
  if (!status) return 'NETWORK_ERROR';

  switch (status) {
    case 401:
      return 'UNAUTHORIZED';
    case 403:
      return 'FORBIDDEN';
    case 404:
      return 'NOT_FOUND';
    case 422:
      return 'VALIDATION_ERROR';
    default:
      return status >= 500 ? 'SERVER_ERROR' : 'CLIENT_ERROR';
  }
}

export function normalizeError(error: unknown): AppError {
  if (error instanceof AppError) return error;

  if (error instanceof AxiosError) {
    const data = error.response?.data;
    const status = error.response?.status;

    // Manejar errores de conexión (ECONNREFUSED, etc.)
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND' || error.message.includes('ECONNREFUSED')) {
      return new AppError(
        'No se pudo conectar con el servidor. Verifica que el servidor esté disponible.',
        'NETWORK_ERROR',
        status
      );
    }

    const parsed = ProblemDetailsSchema.safeParse(data);

    if (parsed.success) {
      const { detail, code, errors } = parsed.data;
      const errorCode = (code as ErrorCode) || getErrorCodeFromStatus(status);
      return new AppError(
        detail || error.message,
        errorCode,
        status,
        errors
      );
    }

    const errorCode = getErrorCodeFromStatus(status);
    return new AppError(error.message, errorCode, status);
  }

  if (error instanceof Error) {
    // Detectar errores de conexión en el mensaje
    if (error.message.includes('ECONNREFUSED') || error.message.includes('ENOTFOUND')) {
      return new AppError(
        'No se pudo conectar con el servidor. Verifica que el servidor esté disponible.',
        'NETWORK_ERROR'
      );
    }
    return new AppError(error.message, 'CLIENT_ERROR');
  }

  return new AppError('Unknown error', 'UNKNOWN_ERROR');
}
