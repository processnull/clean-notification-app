import { Either, left, right } from '../../../../shared/core/either';
import { TokenBucketRepositoryError } from '../../domain/error/token_bucket.respository.error';
import {
  GetBucketResponseDTO,
  SetBucketResponseDTO,
  TakeTokenResponseDTO,
  TokenBucketRepositoryInterface,
} from '../../domain/interface/token_bucket.repository.interface';

type SetBucketErrors = TokenBucketRepositoryError.BuketKeyError;
type GetBucketErrors = TokenBucketRepositoryError.BuketKeyError;
type TakeTokenErrors =
  | TokenBucketRepositoryError.TokenLimitError
  | TokenBucketRepositoryError.BuketKeyError;

interface Bucket {
  filledAt: Date;
  tokens: number;
}
interface KVBD {
  [key: string]: Bucket;
}
export class TokenBucketRepository implements TokenBucketRepositoryInterface {
  private inMemoryKVDB: KVBD;

  constructor() {
    this.inMemoryKVDB = {};
    console.log(this.inMemoryKVDB);
  }

  setBucket(
    key: string,
    tokens: number
  ): Promise<Either<SetBucketErrors, SetBucketResponseDTO>> {
    console.log(
      key,
      tokens,
      Number.isNaN(tokens),
      typeof tokens,
      typeof tokens != 'number'
    );
    this.inMemoryKVDB[key] = {
      filledAt: new Date(),
      tokens: Number.isNaN(tokens) || Number(tokens) < 0 ? 0 : tokens,
    };
    console.log('setBucket', this.inMemoryKVDB);

    // console.log(this.inMemoryKVDB)
    return Promise.resolve(right({ ok: true }));
  }

  getBucket(
    key: string
  ): Promise<Either<GetBucketErrors, GetBucketResponseDTO>> {
    const hasToken = Object.prototype.hasOwnProperty.call(
      this.inMemoryKVDB,
      key
    );

    if (!hasToken) {
      return Promise.resolve(
        left(new TokenBucketRepositoryError.BuketKeyError())
      );
    }
    console.log('getBucket', this.inMemoryKVDB);

    const response: GetBucketResponseDTO = this.inMemoryKVDB[key];
    return Promise.resolve(right(response));
  }
  takeToken(
    key: string
  ): Promise<Either<TakeTokenErrors, TakeTokenResponseDTO>> {
    const hasToken = Object.prototype.hasOwnProperty.call(
      this.inMemoryKVDB,
      key
    );
    if (!hasToken) {
      return Promise.resolve(
        left(new TokenBucketRepositoryError.BuketKeyError())
      );
    }
    const tokensLeft = this.inMemoryKVDB[key].tokens;
    if (tokensLeft <= 0) {
      console.log('takeToken', 'NO HAY TOKENS');

      return Promise.resolve(
        left(new TokenBucketRepositoryError.TokenLimitError())
      );
    }
    this.inMemoryKVDB[key].tokens--;
    console.log('takeToken', this.inMemoryKVDB, hasToken);
    return Promise.resolve(right({ ok: true }));
  }
}
