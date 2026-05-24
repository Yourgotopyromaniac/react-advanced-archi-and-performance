import axios, { AxiosError } from "axios";

export class ApiError extends Error {
  status: number;
  code?: string;
  details?: unknown;

  constructor(message: string, status: number, code?: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

interface ApiErrorBody {
  status_message?: string;
  status_code?: number;
  message?: string;
  error?: string;
  code?: string;
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorBody>;
    const status = axiosError.response?.status ?? 0;
    const body = axiosError.response?.data;
    const message =
      body?.status_message ??
      body?.message ??
      body?.error ??
      axiosError.message ??
      "Request failed";
    const code =
      body?.code ??
      (body?.status_code != null ? String(body.status_code) : undefined);

    return new ApiError(message, status, code, body);
  }

  if (error instanceof Error) {
    return new ApiError(error.message, 0);
  }

  return new ApiError("Unknown error", 0);
}
