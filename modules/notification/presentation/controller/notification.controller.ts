import { UserNotificationDTO } from '../../application/dto/user_notification.dto';
import { NotifyUserUseCase } from '../../application/notify_user.usecase';

export class NotificationController {
  constructor(private notifyUserUseCase: NotifyUserUseCase) {}
  async NotifyUser(userNotification: UserNotificationDTO) {
    return await this.notifyUserUseCase.execute(userNotification);
  }
}
