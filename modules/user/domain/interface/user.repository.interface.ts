import { Either } from '../../../../shared/core/either';
import { UserRepositoryError } from '../error/user.repository.error';

export type UserRepositoryErrors = UserRepositoryError.UserDoesNotExistError;

type NotificationType = 'STATUS' | 'NEWS' | 'MARKETING';
interface NotificationPreference {
  type: NotificationType;
  limit: number;
  rate: number;
  intervalStart: number;
  intervalEnd: number;
}
export interface UserDTO {
  id: string;
  name: string;
  email: string;
  preferences: {
    notifications: NotificationPreference[];
  };
}
export interface UserRepositoryInterface {
  getByName(userName: string): Promise<Either<UserRepositoryErrors, UserDTO>>;
}
