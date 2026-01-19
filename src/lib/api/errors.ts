import { AxiosError } from 'axios';
import { ProblemDetailsSchema, ProblemDetails } from '@/types/contracts/errors';

export class AppError extends Error {
  public readonly code?: string;
  public readonly errors?: Record<string, string[]>;
  public readonly status?: number;

  constructor(message: string, code?: string, status?: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.status = status;
    this.errors = errors;
  }
}

export function normalizeError(error: unknown): AppError {
  if (error instanceof AppError) return error;

  if (error instanceof AxiosError) {
    const data = error.response?.data;
    const status = error.response?.status;

    // Intentar parsear como ProblemDetails
    const parsed = ProblemDetailsSchema.safeParse(data);
    
    if (parsed.success) {
      const { title, detail, code, errors } = parsed.data;
      return new AppError(detail || title || 'Error desconocido del servidor', code, status, errors);
    }

    // Fallback para errores no estructurados
    return new AppError(
      error.message || 'Error de conexión',
      'UNKNOWN_ERROR',
      status,
    );
  }

  if (error instanceof Error) {
    return new AppError(error.message, 'CLIENT_ERROR');
  }

  return new AppError('Error inesperado', 'UNKNOWN_ERROR');
}
