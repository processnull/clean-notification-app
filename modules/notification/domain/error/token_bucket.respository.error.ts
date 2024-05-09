export namespace TokenBucketRepositoryError {
  export class TokenLimitError extends Error {
    constructor() {
      super(`User reach token limit`);
    }
  }
  export class BuketKeyError extends Error {
    constructor() {
      super(`Bucket does not exist`);
    }
  }
}
