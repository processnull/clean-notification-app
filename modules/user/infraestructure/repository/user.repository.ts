import { Either, left, right } from '../../../../shared/core/either';
import { UserRepositoryError } from '../../domain/error/user.repository.error';
import {
  UserDTO,
  UserRepositoryErrors,
  UserRepositoryInterface,
} from '../../domain/interface/user.repository.interface';

export class UserRepository implements UserRepositoryInterface {
  private userList: UserDTO[];
  constructor() {
    this.userList = [
      {
        id: '1',
        name: 'daniel',
        email: 'daniel.visualfx@gmail.com',
        preferences: {
          notifications: [
            {
              type: 'NEWS',
              limit: 2,
              rate: 60 * 1000,
              intervalStart: 60 * 60 * 1000 * 8.5, // '8:30'
              intervalEnd: 60 * 60 * 1000 * 12.0, // '18:30'
            },
            {
              type: 'STATUS',
              limit: 10,
              rate: 60 * 1000 * 60 * 24,
              intervalStart: 60 * 60 * 1000 * 8.5, // '8:30'
              intervalEnd: 60 * 60 * 1000 * 17.5, // '18:30'
            },
            {
              type: 'MARKETING',
              limit: 3,
              rate: 60 * 1000 * 60,
              intervalStart: 60 * 60 * 1000 * 12.5, // '8:30'
              intervalEnd: 60 * 60 * 1000 * 17.5, // '18:30'
            },
          ],
        },
      },
    ];
  }
  getByName(userName: string): Promise<Either<UserRepositoryErrors, UserDTO>> {
    const user = this.userList.find((user) => user.name == userName);
    if (!!user) {
      return Promise.resolve(right(user));
    }
    return Promise.resolve(
      left(new UserRepositoryError.UserDoesNotExistError())
    );
  }
}
