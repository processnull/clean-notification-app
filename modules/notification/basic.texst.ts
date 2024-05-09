import { describe, expect, test } from 'vitest';
import { add } from '.';

describe('index', () => {
  const a = 4;
  const b = 5;
  test('should add both provided numbers', () => {
    const res = add(a, b);
    expect(res).toBe(a + b);
  });

  test('should work with negative numbers', () => {
    const res = add(a, -b);
    expect(res).toBe(a - b);
  });

  // test('should fail with wrong numbers', () => {
  //   const res = add(a, b);
  //   expect(res).not.toBe(1 + a + b);
  // });
});
