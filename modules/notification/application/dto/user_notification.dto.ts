import { NotificationType } from '../../domain/entity/notification';

export interface UserNotificationDTO {
  userName: string;
  notificationType: NotificationType;
  notificationSubject: string;
  notificationMessage: string;
}
