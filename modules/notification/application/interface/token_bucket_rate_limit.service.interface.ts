import { Either } from '../../../../shared/core/either';
import { ResponseDTO } from '../../../../shared/core/response_dto';
// import { UserDTO } from '../../../user/domain/interface/user.repository.interface';

export interface SendResponseDTO extends ResponseDTO {}

// type NotificationType = 'STATUS' | 'NEWS' | 'MARKETING';
// export interface NotificationDTO {
//   id: string;
//   type: NotificationType;
//   message: string;
// }
export interface BucketConfigDTO {
  tokens: number;
  fillRate: number;
}

export interface RateLimitServiceInterface {
  isAllowed(
    key: string,
    bucketConfig: BucketConfigDTO
  ): Promise<Either<Error, SendResponseDTO>>;
}
