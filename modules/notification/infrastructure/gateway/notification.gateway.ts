import { Either, right } from '../../../../shared/core/either';
import { UserDTO } from '../../../user/domain/interface/user.repository.interface';
import {
  NotificationDTO,
  NotificationGatewayInterface,
  SendResponseDTO,
} from '../../application/interface/notification.gateway.interface';

export class NotificationGateway implements NotificationGatewayInterface {
  send(
    user: UserDTO,
    notification: NotificationDTO
  ): Promise<Either<Error, SendResponseDTO>> {
    const email = {
      recipient: user.email,
      subject: notification.subject,
      body: notification.message,
    };
    console.log('Email sent', email);
    return Promise.resolve(right({ status: 'success' }));
  }
}
