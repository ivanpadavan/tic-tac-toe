export const sum = (a: number, b: number) => a + b;
export const range = (n: number): Array<number> =>
  Array.from(Array(n), (_, idx) => idx);
