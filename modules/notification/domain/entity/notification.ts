import { Bucket } from './bucket';

export type NotificationType = 'STATUS' | 'NEWS' | 'MARKETING';

export interface Notification {
  id: string;
  type: NotificationType;
  subject: string;
  message: string;
}

export type NotificationConfigMap = {
  [key in NotificationType]: Bucket;
};
