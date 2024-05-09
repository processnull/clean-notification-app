export namespace NotificationServiceError {
  export class NotificationLimitError extends Error {
    constructor() {
      super(`Cant send more notifications`);
    }
  }
}
