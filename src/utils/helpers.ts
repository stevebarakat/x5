export function array(length: number, filler?: unknown) {
  return Array(length).fill(filler || null);
}

export function roundToFraction(num: number, frac: number): number {
  return parseFloat((Math.round(num * frac) / frac).toFixed(2));
}
