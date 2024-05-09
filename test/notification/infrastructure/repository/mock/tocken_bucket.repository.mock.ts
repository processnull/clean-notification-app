import { right } from 'shared/core/either';
import { vi } from 'vitest';

const tokenBucketRepositoryMock = vi.mock(
  'modules/notification/infrastructure/repository/token_bucket.repository',
  async (importOriginal) => {
    const mod = await importOriginal<
      typeof import('modules/notification/infrastructure/repository/token_bucket.repository')
    >();
    const result = {
      ...mod,
      // replace some exports
      setBucket: vi.fn().mockImplementation((_key: string, _tokens: number) => {
        return Promise.resolve(right(true));
      }),
      getBucket: vi.fn().mockImplementation((_key: string) => {
        return Promise.resolve(right(true));
      }),
      takeToken: vi.fn().mockReturnValue(Promise.resolve(right(true))),
    };
    return result;
  }
);
export { tokenBucketRepositoryMock };
