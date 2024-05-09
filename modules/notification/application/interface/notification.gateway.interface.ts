import { Either } from '../../../../shared/core/either';
import { ResponseDTO } from '../../../../shared/core/response_dto';
import { UserDTO } from '../../../user/domain/interface/user.repository.interface';

export interface SendResponseDTO extends ResponseDTO {}

export interface NotificationDTO {
  id: string;
  subject: string;
  message: string;
}

export interface NotificationGatewayInterface {
  send(
    user: UserDTO,
    notification: NotificationDTO
  ): Promise<Either<Error, SendResponseDTO>>;
}
