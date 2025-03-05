import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class ResponseService {
  success<T>(data: T, message = 'Success') {
    return {
      success: true,
      message,
      data,
    };
  }

  error(
    message: string,
    error: any = null,
    statusCode: number = HttpStatus.BAD_REQUEST,
  ) {
    throw new HttpException(
      {
        success: false,
        message,
        error,
      },
      statusCode,
    );
  }

  successWithStatus<T>(
    res: Response,
    data: T,
    message = 'Success',
    statusCode: number = HttpStatus.OK,
  ) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }
}
