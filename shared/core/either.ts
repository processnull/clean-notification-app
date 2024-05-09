export type Either<L, R> = Left<L> | Right<R>;

class Left<L> {
  readonly error: L;

  constructor(error: L) {
    this.error = error;
  }

  isLeft(): this is Left<L> {
    return true;
  }

  isRight(): this is Right<never> {
    return false;
  }
}

class Right<R> {
  readonly value: R;

  constructor(value: R) {
    this.value = value;
  }

  isLeft(): this is Left<never> {
    return false;
  }

  isRight(): this is Right<R> {
    return true;
  }
}

export const left = <L, R>(error: L): Either<L, R> => {
  return new Left(error);
};

export const right = <L, R>(value: R): Either<L, R> => {
  return new Right(value);
};

export const sequence = <L, R>(eithers: Either<L, R>[]): Either<L, R[]> => {
  const rightValues: R[] = [];
  for (const either of eithers) {
    if (either.isLeft()) {
      return left(either.error);
    } else {
      rightValues.push(either.value);
    }
  }
  return right(rightValues);
};

// export const pipe = <T, U>(
//   value: Either<any, T>,
//   ...fns: ((input: T) => Either<any, U>)[]
// ): Either<any, U> => {
//   let result: Either<any, U> = value;

//   for (const fn of fns) {
//     if (result.isRight()) {
//       result = fn(result.value);
//     } else {
//       break; // Stop processing if a Left value is encountered
//     }
//   }

//   return result;
// };

// const pipe = <T extends any[], U>(
//   fn1: (...args: T) => U,
//   ...fns: Array<(a: U) => U>
// ) => {
//   const piped = fns.reduce((prevFn, nextFn) => (value: U) => nextFn(prevFn(value)), value => value);
//   return (...args: T) => piped(fn1(...args));
// };

// export const pipe = <T, U>(
//   fn1: (input: T) => Either<any, U>,
//   ...fns: Array<(input: U) => Either<any, U>>
// ) => {
//   const piped = fns.reduce((prevFn, nextFn) => (value: U) => {
//     const result = prevFn(value);
//     return result.isRight() ? nextFn(result.value) : result;
//   }, (input: U) => right(input));

//   return (input: T) => piped(fn1(input));
// };

// export const compose = <T>(fn1: (a: T) => T, ...fns: Array<(a: T) => T>) =>
//   fns.reduce((prevFn, nextFn) => value => prevFn(nextFn(value)), fn1);
