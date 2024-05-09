import { NotificationConfigMap } from '../modules/notification/domain/entity/notification';

const notificationConfig: NotificationConfigMap = {
  STATUS: { tokens: 2, fillRate: 1000 * 60 * 60 }, // 2 per minute
  NEWS: { tokens: 1, fillRate: 1000 * 60 * 60 * 60 * 24 }, // 2 per day
  MARKETING: { tokens: 2, fillRate: 1000 * 60 * 60 * 60 }, // 2 per day
};

export { notificationConfig };
