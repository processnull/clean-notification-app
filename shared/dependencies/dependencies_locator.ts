import { NotifyUserUseCase } from '../../modules/notification/application/notify_user.usecase';
import { TokenBucketRateLimitService } from '../../modules/notification/application/service/token_bucket_rate_limit.service';
import { NotificationGateway } from '../../modules/notification/infrastructure/gateway/notification.gateway';
import { TokenBucketRepository } from '../../modules/notification/infrastructure/repository/token_bucket.repository';
import { NotificationController } from '../../modules/notification/presentation/controller/notification.controller';
import { UserRepository } from '../../modules/user/infraestructure/repository/user.repository';

function provideNotificationController() {
  // Used in case of dependency of presenter in the usecase
  // prepareOrdersViewCallback: UpdateViewCallback<RecordingAudioStartResponseDTO>,
  const userRepository = new UserRepository();
  const tokenBucketRepository = new TokenBucketRepository();
  const tokenBucketRateLimitService = new TokenBucketRateLimitService(
    tokenBucketRepository
  );
  const notificationGateway = new NotificationGateway();
  
  const notifyUserUseCase = new NotifyUserUseCase(
    userRepository,
    tokenBucketRateLimitService,
    notificationGateway
  );

  const notificationController = new NotificationController(notifyUserUseCase);
  return notificationController;
}

export const dependenciesLocator = {
  provideNotificationController,
};
