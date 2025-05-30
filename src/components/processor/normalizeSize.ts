const normalizeSize = (input: any): number => {
  const str = (input ?? '').toString();
  const cleaned = str.replace(/[.+]/g, '');
  const [minStr, maxStr] = cleaned.split('-').map((s: string) => s.trim());

  const min = parseInt(minStr, 10);
  const max = parseInt(maxStr, 10);

  if (!isNaN(min) && !isNaN(max)) {
    return Math.round((min + max) / 2);
  }

  // Si sólo viene un número sin rango, usarlo directamente
  const fallback = parseInt(str, 10);
  if (!isNaN(fallback)) {
    return fallback;
  }

  return 0;
};

export default normalizeSize;
