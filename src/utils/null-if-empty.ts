export default function nullIfEmpty<T>(arr: T[]) {
  return arr.length === 0 ? null : arr;
}
