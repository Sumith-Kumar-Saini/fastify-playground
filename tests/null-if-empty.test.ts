import nullIfEmpty from '../src/utils/null-if-empty';

describe('nullIfEmpty utility', () => {
  it('returns null for an empty array', () => {
    expect(nullIfEmpty([])).toBeNull();
  });

  it('returns original array when not empty', () => {
    expect(nullIfEmpty([1, 2])).toEqual([1, 2]);
  });

  it('works with arrays of objects', () => {
    const arr = [{ a: 1 }];
    expect(nullIfEmpty(arr)).toBe(arr);
  });

  it('does not clone the array', () => {
    const arr = ['x'];
    expect(nullIfEmpty(arr)).toBe(arr);
  });
});
