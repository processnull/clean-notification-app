import { Either } from '../../../../shared/core/either';

export interface GetBucketResponseDTO {
  filledAt: Date;
  tokens: number;
}
export interface SetBucketResponseDTO {
  ok: boolean;
}
export interface TakeTokenResponseDTO {
  ok: boolean;
}
// BUCKET = USERID_NOTIFICATIONTYPE
export interface TokenBucketRepositoryInterface {
  setBucket(
    key: string,
    tokens: number
  ): Promise<Either<Error, SetBucketResponseDTO>>;

  getBucket(key: string): Promise<Either<Error, GetBucketResponseDTO>>;

  takeToken(key: string): Promise<Either<Error, TakeTokenResponseDTO>>;
}
