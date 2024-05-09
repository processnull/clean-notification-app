import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from 'vitest';
import { TokenBucketRepository } from 'modules/notification/infrastructure/repository/token_bucket.repository';
import { TokenBucketRateLimitService } from 'modules/notification/application/service/token_bucket_rate_limit.service';
// import { BucketConfigDTO } from 'modules/notification/application/interface/token_bucket_rate_limit.service.interface';
// import { NotificationServiceError } from 'modules/notification/application/error/notification.service.error';

// vi.mock(
//   'modules/notification/infrastructure/repository/token_bucket.repository'
// );
// vi.mock('modules/notification/application/error/notification.service.error');
// vi.mock('modules/notification/application/error/notification.service.error', async (importOriginal) => {
//   const mod = await importOriginal<typeof import('modules/notification/application/error/notification.service.error')>()
//   return {
//     ...mod,
//     // replace some exports
//     NotificationLimitError: vi.fn(),
//   }
// })
// const mockNotificationLimitError = vi.fn(NotificationServiceError.NotificationLimitError);

// Mock the entire NotificationServiceError namespace
// vi.mock('modules/notification/application/error/notification.service.error');
//   vi.mock('modules/notification/application/error/notification.service.error', () => ({
//     NotificationServiceError: {
//     NotificationLimitError: vi.fn(NotificationServiceError.NotificationLimitError),
//   },
// }));

let tokenBucketrepository: TokenBucketRepository;
let tokenBucketRateLimitService: TokenBucketRateLimitService;

describe('index', () => {
  beforeEach(() => {
    tokenBucketrepository = new TokenBucketRepository();
    tokenBucketRateLimitService = new TokenBucketRateLimitService(
      tokenBucketrepository
    );
    console.log('HEEEY');
    // const tokenBucketrepository: TokenBucketRepositoryInterface = () => {
    //   setBucket: (key, tokens) => {};
    // };
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  test('should create a bucket if does not exist and take one token', async () => {
    // GIVEN
    const key = 'USER_1|UPDATES';
    const bucketConfig: any = {
      tokens: 1,
      fillRate: 60 * 1000,
    };
    let remainingTokens = undefined;
    // WHEN
    const tokenBucketSpy = vi.spyOn(tokenBucketrepository, 'takeToken');
    const setBucketSpy = vi.spyOn(tokenBucketrepository, 'setBucket');

    const isAllowed = await tokenBucketRateLimitService.isAllowed(
      key,
      bucketConfig
    );
    const remainingTokensOrError = await tokenBucketrepository.getBucket(key);
    if (remainingTokensOrError.isRight()) {
      remainingTokens = remainingTokensOrError.value.tokens;
    }
    // THEN
    expect(isAllowed.isRight()).toBe(true);

    expect(tokenBucketSpy).toHaveBeenCalledTimes(1);
    expect(tokenBucketSpy).toHaveBeenCalledWith(key);

    expect(setBucketSpy).toHaveBeenCalledTimes(1);
    expect(setBucketSpy).toHaveBeenCalledWith(key, bucketConfig.tokens - 1);
    expect(remainingTokens).toBe(bucketConfig.tokens - 1);
  });

  test('Should allow up to 2 tokens per minute and reject the rest', async () => {
    const key = 'AAA';
    const bucketConfig: any = {
      tokens: 2,
      fillRate: 60 * 1000,
    };

    const isAllowed1 = await tokenBucketRateLimitService.isAllowed(
      key,
      bucketConfig
    );
    const isAllowed2 = await tokenBucketRateLimitService.isAllowed(
      key,
      bucketConfig
    );
    const isAllowed3 = await tokenBucketRateLimitService.isAllowed(
      key,
      bucketConfig
    );
    expect(isAllowed1.isRight()).toBe(true);
    expect(isAllowed2.isRight()).toBe(true);
    expect(isAllowed3.isRight()).toBe(false);

    // const res = add(a, b);
    // expect(res).toBe(a + b);
  });
  test('should refill the bucket if the refill time has been exceeded', async () => {
    const startTime = new Date('01-01-1999');
    const endTime = new Date(startTime.getTime() + 60001);
    // const endTime = new Date(startTime);
    // endTime.setMinutes(startTime.getMinutes() + 1);

    console.log(startTime, endTime);

    vi.useFakeTimers();
    vi.setSystemTime(startTime);

    const key = 'AAA';
    const bucketConfig: any = {
      tokens: 2,
      fillRate: 60 * 1000,
    };

    const isAllowed1 = await tokenBucketRateLimitService.isAllowed(
      key,
      bucketConfig
    );
    const isAllowed2 = await tokenBucketRateLimitService.isAllowed(
      key,
      bucketConfig
    );

    vi.setSystemTime(endTime);

    const isAllowed3 = await tokenBucketRateLimitService.isAllowed(
      key,
      bucketConfig
    );
    const isAllowed4 = await tokenBucketRateLimitService.isAllowed(
      key,
      bucketConfig
    );
    const isAllowed5 = await tokenBucketRateLimitService.isAllowed(
      key,
      bucketConfig
    );
    expect(isAllowed1.isRight()).toBe(true);
    expect(isAllowed2.isRight()).toBe(true);
    expect(isAllowed3.isRight()).toBe(true);
    expect(isAllowed4.isRight()).toBe(true);
    expect(isAllowed5.isRight()).toBe(false);
    vi.useRealTimers();
  });
});
