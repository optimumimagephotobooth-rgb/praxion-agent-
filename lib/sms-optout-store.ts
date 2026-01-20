const optedOutNumbers = new Set<string>();

function normalize(number: string) {
  return number.replace(/\s+/g, "").toLowerCase();
}

export function optOut(number: string) {
  optedOutNumbers.add(normalize(number));
}

export function isOptedOut(number: string): boolean {
  return optedOutNumbers.has(normalize(number));
}
