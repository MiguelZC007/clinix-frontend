import { z } from 'zod';

export const ApiResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema,
    message: z.string().optional(),
    timestamp: z.string().datetime(),
  });

export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
};

export const PaginatedResponseSchema = <T extends z.ZodType>(itemSchema: T) =>
  z.object({
    success: z.boolean(),
    data: z.object({
      items: z.array(itemSchema),
      total: z.number(),
      page: z.number(),
      pageSize: z.number(),
      totalPages: z.number(),
    }),
    message: z.string().optional(),
    timestamp: z.string().datetime(),
  });

export type PaginatedData<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type PaginatedResponse<T> = ApiResponse<PaginatedData<T>>;

export const MessageResponseSchema = z.object({
  success: z.boolean(),
  data: z.null(),
  message: z.string(),
  timestamp: z.string().datetime(),
});

export type MessageResponse = z.infer<typeof MessageResponseSchema>;
