'use client';

import { toast } from 'sonner';
import { AppError } from '@/lib/api/errors';
import type { ErrorCode } from '@/lib/api/errors';

type ErrorHandlerOptions = {
  showToast?: boolean;
  logError?: boolean;
};

/**
 * Muestra un error al usuario usando toast
 */
export function showError(error: unknown, options: ErrorHandlerOptions = {}) {
  const { showToast = true, logError = true } = options;

  let appError: AppError;
  
  if (error instanceof AppError) {
    appError = error;
  } else if (error instanceof Error) {
    appError = new AppError(error.message, 'UNKNOWN_ERROR');
  } else {
    appError = new AppError('Ha ocurrido un error inesperado', 'UNKNOWN_ERROR');
  }

  if (logError) {
    console.error('Error:', appError);
  }

  if (showToast) {
    // Obtener mensaje traducido si está disponible
    const message = getErrorMessage(appError);
    toast.error(message, {
      description: appError.errors ? formatValidationErrors(appError.errors) : undefined,
      duration: 5000,
    });
  }

  return appError;
}

/**
 * Obtiene el mensaje de error traducido
 */
function getErrorMessage(error: AppError): string {
  // Intentar obtener traducción desde el contexto
  // Por ahora retornamos mensajes en español, pero se puede mejorar
  // para usar next-intl dinámicamente
  
  const errorMessages: Record<ErrorCode, string> = {
    UNKNOWN_ERROR: 'Ha ocurrido un error inesperado',
    CLIENT_ERROR: 'Error en la solicitud. Por favor, verifica los datos.',
    NETWORK_ERROR: 'Error de conexión. Verifica tu conexión a internet o que el servidor esté disponible.',
    SERVER_ERROR: 'Error del servidor. Por favor, intenta de nuevo más tarde.',
    VALIDATION_ERROR: 'Los datos ingresados no son válidos',
    UNAUTHORIZED: 'No tienes autorización. Por favor, inicia sesión.',
    FORBIDDEN: 'No tienes permisos para realizar esta acción.',
    NOT_FOUND: 'El recurso solicitado no fue encontrado.',
  };

  // Si hay un mensaje específico del error, usarlo
  if (error.message && error.message !== 'Unknown error') {
    return error.message;
  }

  return errorMessages[error.code] || errorMessages.UNKNOWN_ERROR;
}

/**
 * Formatea errores de validación para mostrarlos en el toast
 */
function formatValidationErrors(errors: Record<string, string[]>): string {
  const errorList = Object.entries(errors)
    .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
    .join('\n');
  
  return errorList;
}

/**
 * Hook para manejar errores en componentes
 */
function useErrorHandler() {
  return {
    showError,
    handleError: (error: unknown) => showError(error),
  };
}
