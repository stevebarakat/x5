export function array(length: number, filler?: unknown) {
  return Array(length).fill(filler || null);
}

export function roundToOneTenth(num: number): number {
  return parseFloat((Math.round(num * 10) / 10).toFixed(2));
}
