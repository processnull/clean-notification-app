import { UpdateViewCallback } from '../../../../shared/core/update_view_callback';
import {
  NotifyUserPresenterInterface,
  NotifyUserUseCaseResponseDTO,
} from '../../application/notify_user.usecase';

export class NotificationPresenter implements NotifyUserPresenterInterface {
  constructor(private readonly updateViewCallback: UpdateViewCallback) {}
  present(response: NotifyUserUseCaseResponseDTO) {
    this.updateViewCallback(response);
  }
}
