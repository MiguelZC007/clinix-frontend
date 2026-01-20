import { describe, it, expect, vi, beforeEach } from 'vitest';
import { z } from 'zod';
import { AxiosError } from 'axios';
import { client } from '../api/client';
import { api } from '../api/axios';
import { AppError } from '../api/errors';

vi.mock('../api/axios', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('../api/errors', () => ({
  normalizeError: vi.fn((error) => {
    if (error instanceof AppError) return error;
    return new AppError('Normalized error', 'CLIENT_ERROR');
  }),
}));

describe('client.get', () => {
  const testSchema = z.object({
    id: z.string(),
    name: z.string(),
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('retorna datos validados correctamente', async () => {
    const mockData = { id: '1', name: 'Test' };
    (api.get as any).mockResolvedValue({ data: mockData });

    const result = await client.get('/test', testSchema);
    expect(result).toEqual(mockData);
    expect(api.get).toHaveBeenCalledWith('/test', undefined);
  });

  it('valida respuesta con schema', async () => {
    const invalidData = { id: '1' };
    (api.get as any).mockResolvedValue({ data: invalidData });

    await expect(client.get('/test', testSchema)).rejects.toThrow();
  });

  it('pasa configuracion correctamente', async () => {
    const mockData = { id: '1', name: 'Test' };
    const config = { params: { page: 1 } };
    (api.get as any).mockResolvedValue({ data: mockData });

    await client.get('/test', testSchema, config);
    expect(api.get).toHaveBeenCalledWith('/test', config);
  });

  it('maneja errores correctamente', async () => {
    const axiosError = new AxiosError('Network error');
    (api.get as any).mockRejectedValue(axiosError);

    await expect(client.get('/test', testSchema)).rejects.toThrow();
  });
});

describe('client.post', () => {
  const testSchema = z.object({
    id: z.string(),
    name: z.string(),
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('retorna datos validados correctamente', async () => {
    const requestBody = { name: 'Test' };
    const mockResponse = { id: '1', name: 'Test' };
    (api.post as any).mockResolvedValue({ data: mockResponse });

    const result = await client.post('/test', requestBody, testSchema);
    expect(result).toEqual(mockResponse);
    expect(api.post).toHaveBeenCalledWith('/test', requestBody, undefined);
  });

  it('valida respuesta con schema', async () => {
    const requestBody = { name: 'Test' };
    const invalidResponse = { id: '1' };
    (api.post as any).mockResolvedValue({ data: invalidResponse });

    await expect(
      client.post('/test', requestBody, testSchema)
    ).rejects.toThrow();
  });

  it('maneja errores correctamente', async () => {
    const requestBody = { name: 'Test' };
    const axiosError = new AxiosError('Network error');
    (api.post as any).mockRejectedValue(axiosError);

    await expect(
      client.post('/test', requestBody, testSchema)
    ).rejects.toThrow();
  });
});

describe('client.put', () => {
  const testSchema = z.object({
    id: z.string(),
    name: z.string(),
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('retorna datos validados correctamente', async () => {
    const requestBody = { name: 'Updated' };
    const mockResponse = { id: '1', name: 'Updated' };
    (api.put as any).mockResolvedValue({ data: mockResponse });

    const result = await client.put('/test/1', requestBody, testSchema);
    expect(result).toEqual(mockResponse);
  });

  it('maneja errores correctamente', async () => {
    const requestBody = { name: 'Updated' };
    const axiosError = new AxiosError('Network error');
    (api.put as any).mockRejectedValue(axiosError);

    await expect(
      client.put('/test/1', requestBody, testSchema)
    ).rejects.toThrow();
  });
});

describe('client.delete', () => {
  const testSchema = z.object({
    success: z.boolean(),
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('retorna datos validados correctamente', async () => {
    const mockResponse = { success: true };
    (api.delete as any).mockResolvedValue({ data: mockResponse });

    const result = await client.delete('/test/1', testSchema);
    expect(result).toEqual(mockResponse);
  });

  it('maneja errores correctamente', async () => {
    const axiosError = new AxiosError('Network error');
    (api.delete as any).mockRejectedValue(axiosError);

    await expect(client.delete('/test/1', testSchema)).rejects.toThrow();
  });
});
