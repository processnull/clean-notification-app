import { notificationConfig } from '../../../config';
import { InputBoundary } from '../../../shared/core/input_boundary';
import { OutputBoundary } from '../../../shared/core/output_boundary';
import { ResponseDTO } from '../../../shared/core/response_dto';
import { UserRepositoryInterface } from '../../user/domain/interface/user.repository.interface';
import { NotificationType } from '../domain/entity/notification';
import { NotificationGateway } from '../infrastructure/gateway/notification.gateway';
import { NotificationDTO } from './interface/notification.gateway.interface';
import { RateLimitServiceInterface } from './interface/token_bucket_rate_limit.service.interface';

export type NotifyUserUseCaseRequestDTO = {
  userName: string;
  notificationType: NotificationType;
  notificationSubject: string;
  notificationMessage: string;
};
export interface NotifyUserUseCaseInterface
  extends InputBoundary<NotifyUserUseCaseRequestDTO, void> {
  execute(request: NotifyUserUseCaseRequestDTO): void;
}

export interface NotifyUserUseCaseResponseDTO extends ResponseDTO {}

export interface NotifyUserPresenterInterface
  extends OutputBoundary<NotifyUserUseCaseResponseDTO> {
  present(response: NotifyUserUseCaseResponseDTO): void;
}

export type NotifyUserUseCaseResponseInterface = {
  ok: boolean;
  error?: string;
};
export class NotifyUserUseCase implements NotifyUserUseCaseInterface {
  constructor(
    private userRepository: UserRepositoryInterface,
    private tokenBucketRateLimitService: RateLimitServiceInterface,
    private notificationGateway: NotificationGateway,
    private presenter: NotifyUserPresenterInterface
  ) {}
  async execute(request: NotifyUserUseCaseRequestDTO) {
    const userOrError = await this.userRepository.getByName(request.userName);
    if (userOrError.isLeft()) {
      const responseDtoError: NotifyUserUseCaseResponseDTO = {
        status: 'error',
        errors: [
          {
            code: userOrError.error.name,
            message: userOrError.error.message,
            details: userOrError.error.stack || '',
          },
        ],
      };
      this.presenter.present(responseDtoError);
    } else {
      const key = `${userOrError.value.id}|${request.notificationType}`;
      const notificationConfiguration =
        notificationConfig[request.notificationType];
      const isAllowedOrError = await this.tokenBucketRateLimitService.isAllowed(
        key,
        notificationConfiguration
      );
      if (isAllowedOrError.isLeft()) {
        const responseDtoError: NotifyUserUseCaseResponseDTO = {
          status: 'error',
          errors: [
            {
              code: isAllowedOrError.error.name,
              message: isAllowedOrError.error.message,
              details: isAllowedOrError.error.stack || '',
            },
          ],
        };
        this.presenter.present(responseDtoError);
      }
      const notification: NotificationDTO = {
        id: 'UUID',
        subject: request.notificationSubject,
        message: request.notificationMessage,
      };
      const notificationSentOrError = await this.notificationGateway.send(
        userOrError.value,
        notification
      );

      if (notificationSentOrError.isLeft()) {
        const responseDtoError: NotifyUserUseCaseResponseDTO = {
          status: 'error',
          errors: [
            {
              code: notificationSentOrError.error.name,
              message: notificationSentOrError.error.message,
              details: notificationSentOrError.error.stack || '',
            },
          ],
        };
        this.presenter.present(responseDtoError);
      }
      const responseDto: NotifyUserUseCaseResponseDTO = {
        status: 'success',
      };
      this.presenter.present(responseDto);
    }
  }
}
