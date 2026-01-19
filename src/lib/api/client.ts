import { z } from 'zod';
import { api } from './axios';
import { normalizeError } from './errors';

type RequestConfig = {
  headers?: Record<string, string>;
  params?: Record<string, unknown>;
};

async function get<T>(url: string, schema: z.ZodType<T>, config?: RequestConfig): Promise<T> {
  try {
    const response = await api.get(url, config);
    // Validar respuesta en runtime
    return schema.parse(response.data);
  } catch (error) {
    throw normalizeError(error);
  }
}

async function post<T, B>(url: string, body: B, schema: z.ZodType<T>, config?: RequestConfig): Promise<T> {
  try {
    const response = await api.post(url, body, config);
    return schema.parse(response.data);
  } catch (error) {
    throw normalizeError(error);
  }
}

async function put<T, B>(url: string, body: B, schema: z.ZodType<T>, config?: RequestConfig): Promise<T> {
  try {
    const response = await api.put(url, body, config);
    return schema.parse(response.data);
  } catch (error) {
    throw normalizeError(error);
  }
}

async function del<T>(url: string, schema: z.ZodType<T>, config?: RequestConfig): Promise<T> {
  try {
    const response = await api.delete(url, config);
    return schema.parse(response.data);
  } catch (error) {
    throw normalizeError(error);
  }
}

export const client = {
  get,
  post,
  put,
  delete: del,
};
