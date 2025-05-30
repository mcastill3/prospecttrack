const normalizeRevenue = (input: any): number => {
  // Asegurar que sea string
  const str = (input ?? '').toString().toLowerCase();
  const cleaned = str.replace(/[\$,]/g, '');

  // Ej: "$500M to $1B" o "$500M - $1B"
  const match = cleaned.match(/(\d+\.?\d*)\s*([a-zA-Z])\s*(?:to|-)\s*(\d+\.?\d*)\s*([a-zA-Z])/i);

  if (match) {
    const num1 = parseFloat(match[1]);
    const unit1 = match[2].toLowerCase();
    const num2 = parseFloat(match[3]);
    const unit2 = match[4].toLowerCase();

    const multiplier = (unit: string) =>
      unit === 'b' ? 1_000_000_000 : unit === 'm' ? 1_000_000 : 1;

    const min = num1 * multiplier(unit1);
    const max = num2 * multiplier(unit2);

    return Math.round((min + max) / 2);
  }

  // Si no hay match, intentá parsear un número simple
  const simpleMatch = cleaned.match(/(\d+\.?\d*)\s*([a-zA-Z])/);
  if (simpleMatch) {
    const num = parseFloat(simpleMatch[1]);
    const unit = simpleMatch[2].toLowerCase();
    const multiplier = unit === 'b' ? 1_000_000_000 : unit === 'm' ? 1_000_000 : 1;
    return Math.round(num * multiplier);
  }

  return 0;
};

export default normalizeRevenue;