import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';

export const transformErrorPipe = new ValidationPipe({
  exceptionFactory: (errors: ValidationError[]) => {
    const err = errors[0];
    return new BadRequestException({
      path: err.property,
      error: Object.values(err.constraints || {})[0],
    });
  },
  stopAtFirstError: true,
});
