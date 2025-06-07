// types/express/index.d.ts — или рядом с точкой входа проекта
import { User } from '../users/entities/user.entity';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
