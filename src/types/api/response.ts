export interface ApiErrorDetail {
  message: string;
  code: string;
  details?: unknown;
}

export interface ApiResponseSuccess<T> {
  success: true;
  data: T;
  error?: never;
}

export interface ApiResponseError {
  success: false;
  data?: never;
  error: ApiErrorDetail;
}

export type ApiResponse<T> = ApiResponseSuccess<T> | ApiResponseError;
