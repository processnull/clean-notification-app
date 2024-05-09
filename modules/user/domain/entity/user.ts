export type NotificationType = 'STATUS' | 'NEWS' | 'MARKETING';

export interface NotificationPreference {
  type: NotificationType;
  quantity: number;
  intervalStart: number;
  intervalEnd: number;
}
export interface User {
  id: string;
  name: string;
  email: string;
  preferences: {
    notifications: NotificationPreference[];
  };
}
