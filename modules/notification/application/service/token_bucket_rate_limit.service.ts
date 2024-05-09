import { Either, left, right } from '../../../../shared/core/either';
import { NotificationServiceError } from '../../application/error/notification.service.error';
import {
  BucketConfigDTO,
  RateLimitServiceInterface,
  SendResponseDTO,
} from '../../application/interface/token_bucket_rate_limit.service.interface';
import { TokenBucketRepositoryError } from '../../domain/error/token_bucket.respository.error';
import { TokenBucketRepositoryInterface } from '../../domain/interface/token_bucket.repository.interface';
export type SendErrors = NotificationServiceError.NotificationLimitError;

export class TokenBucketRateLimitService implements RateLimitServiceInterface {
  constructor(private tokenBucketRepository: TokenBucketRepositoryInterface) {}
  async isAllowed(
    key: string,
    bucketConfig: BucketConfigDTO
  ): Promise<Either<SendErrors, SendResponseDTO>> {
    const canSendNotification = await this.canSendNotification(
      key,
      bucketConfig
    );
    console.log('canSendNotification', canSendNotification);
    if (!canSendNotification) {
      return left(new NotificationServiceError.NotificationLimitError());
    }
    return right({ status: 'success' });
  }
  private async canSendNotification(
    key: string,
    bucketConfig: BucketConfigDTO
  ): Promise<boolean> {
    const tokenTakedOrError = await this.tokenBucketRepository.takeToken(key);
    if (tokenTakedOrError.isLeft()) {
      switch (tokenTakedOrError.error.constructor) {
        case TokenBucketRepositoryError.BuketKeyError:
          return await this.onInexistentBucket(key, bucketConfig);
        case TokenBucketRepositoryError.TokenLimitError:
          return await this.onBucketOutOfTokens(key, bucketConfig);
        default:
          console.log('DEFAULT?');
          return false;
      }
    }
    console.log('Token taked success');
    return true;
  }
  private async onInexistentBucket(key: string, bucketConfig: BucketConfigDTO) {
    if (bucketConfig.tokens - 1 < 0) {
      return false;
    }
    const setBucketOrError = await this.tokenBucketRepository.setBucket(
      key,
      bucketConfig.tokens - 1
    );
    return setBucketOrError.isRight();
  }
  private async onBucketOutOfTokens(
    key: string,
    bucketConfig: BucketConfigDTO
  ) {
    const bucketOrError = await this.tokenBucketRepository.getBucket(key);
    if (bucketOrError.isRight()) {
      const bucketFilledAt = bucketOrError.value.filledAt;
      console.log(
        'REFILL',
        bucketFilledAt.getTime() + bucketConfig.fillRate >= Date.now()
      );
      if (bucketFilledAt.getTime() + bucketConfig.fillRate >= Date.now()) {
        // REJECT NOTIFICATION
        console.log('DESCARTAR');
        return false;
      }
      // REFILL BUCKET AND TAKE ONE
      const setBucketOrError = await this.tokenBucketRepository.setBucket(
        key,
        bucketConfig.tokens - 1
      );
      return setBucketOrError.isRight();
    }
    return false;
  }
}
