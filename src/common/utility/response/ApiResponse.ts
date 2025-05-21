import { HttpStatus } from '@nestjs/common';

export class ApiResponse<T = null> {
  statusCode: number;
  message: string;
  data: T | null;
  meta?: Record<string, any>;
  success: boolean;
  timestamp: string;

  constructor(
    statusCode: number,
    message: string,
    data: T | null = null,
    success = true,
    meta?: Record<string, any>,
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = success;
    this.timestamp = new Date().toISOString();
    if (meta) this.meta = meta;
  }

  static success<T = null>(
    message: string,
    data?: T,
    meta?: Record<string, any>,
    statusCode: number = HttpStatus.OK,
  ): ApiResponse<T> {
    return new ApiResponse(statusCode, message, data ?? null, true, meta);
  }

  static error<T = null>(
    message: string,
    statusCode: number = HttpStatus.BAD_REQUEST,
  ): ApiResponse<T> {
    return new ApiResponse(statusCode, message, null, false);
  }
}
