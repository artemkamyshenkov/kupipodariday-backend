import { Expose } from 'class-transformer';

export class UserResponseDto {
  @Expose()
  id: string; // если есть ID

  @Expose()
  username: string;

  @Expose()
  about?: string;

  @Expose()
  avatar?: string;

  @Expose()
  email: string;
}
