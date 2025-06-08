import { UseInterceptors, applyDecorators, Type } from '@nestjs/common';
import { SerializeInterceptor } from './serialize.interceptor';

export const Serialize = (dto: Type<unknown>) => {
  return applyDecorators(UseInterceptors(new SerializeInterceptor(dto)));
};
