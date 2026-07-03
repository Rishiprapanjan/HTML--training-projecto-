// Safe expression evaluator
export const evaluate = (expression) => {
  try {
    // Remove any dangerous characters
    const cleaned = expression.replace(/[^0-9+\-*./()\s]/g, '');
    // Use Function instead of eval for slightly better safety
    const result = Function('"use strict"; return (' + cleaned + ')')();
    return result;
  } catch {
    throw new Error('Invalid expression');
  }
};

// Scientific Functions
export const scientificFunctions = {
  sin: (deg) => Math.sin((deg * Math.PI) / 180),
  cos: (deg) => Math.cos((deg * Math.PI) / 180),
  tan: (deg) => Math.tan((deg * Math.PI) / 180),
  asin: (value) => (Math.asin(value) * 180) / Math.PI,
  acos: (value) => (Math.acos(value) * 180) / Math.PI,
  atan: (value) => (Math.atan(value) * 180) / Math.PI,
  sinh: (value) => Math.sinh(value),
  cosh: (value) => Math.cosh(value),
  tanh: (value) => Math.tanh(value),
  log: (value) => Math.log10(value),
  ln: (value) => Math.log(value),
  sqrt: (value) => Math.sqrt(value),
  cbrt: (value) => Math.cbrt(value),
  power: (base, exp) => Math.pow(base, exp),
  factorial: (n) => {
    if (n < 0) throw new Error('Factorial of negative number');
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
  },
  reciprocal: (value) => 1 / value,
  absolute: (value) => Math.abs(value),
  exp: (value) => Math.exp(value),
  Pi: () => Math.PI,
  E: () => Math.E,
};

// Unit Conversion
export const unitConversions = {
  length: {
    mm: { to_m: 0.001, display: 'mm' },
    cm: { to_m: 0.01, display: 'cm' },
    m: { to_m: 1, display: 'm' },
    km: { to_m: 1000, display: 'km' },
    inch: { to_m: 0.0254, display: 'in' },
    foot: { to_m: 0.3048, display: 'ft' },
    yard: { to_m: 0.9144, display: 'yd' },
    mile: { to_m: 1609.34, display: 'mi' },
  },
  weight: {
    mg: { to_kg: 0.000001, display: 'mg' },
    g: { to_kg: 0.001, display: 'g' },
    kg: { to_kg: 1, display: 'kg' },
    ton: { to_kg: 1000, display: 't' },
    oz: { to_kg: 0.0283495, display: 'oz' },
    lb: { to_kg: 0.453592, display: 'lb' },
  },
  temperature: {
    c_to_f: (c) => (c * 9) / 5 + 32,
    f_to_c: (f) => ((f - 32) * 5) / 9,
    c_to_k: (c) => c + 273.15,
    k_to_c: (k) => k - 273.15,
    f_to_k: (f) => ((f - 32) * 5) / 9 + 273.15,
    k_to_f: (k) => ((k - 273.15) * 9) / 5 + 32,
  },
  volume: {
    ml: { to_l: 0.001, display: 'ml' },
    l: { to_l: 1, display: 'L' },
    gallon_us: { to_l: 3.78541, display: 'gal (US)' },
    gallon_uk: { to_l: 4.54609, display: 'gal (UK)' },
    fl_oz: { to_l: 0.0295735, display: 'fl oz' },
  },
};

export const convertUnit = (value, fromUnit, toUnit, category) => {
  if (category === 'temperature') {
    const func = unitConversions.temperature[`${fromUnit}_to_${toUnit}`];
    if (!func) throw new Error('Invalid temperature conversion');
    return func(value);
  }

  const units = unitConversions[category];
  if (!units) throw new Error('Invalid category');

  const fromKey = Object.keys(units).find((k) => k === fromUnit);
  const toKey = Object.keys(units).find((k) => k === toUnit);

  if (!fromKey || !toKey) throw new Error('Invalid units');

  const baseValue = value * units[fromKey][Object.keys(units[fromKey])[0]];
  const toFactor = Object.keys(units[toKey])[0];
  return baseValue / units[toKey][toFactor];
};

// Financial Calculations
export const financialCalculations = {
  simpleInterest: (principal, rate, time) => {
    return principal + (principal * rate * time) / 100;
  },
  compoundInterest: (principal, rate, time, frequency = 1) => {
    return principal * Math.pow(1 + rate / 100 / frequency, frequency * time);
  },
  loanPayment: (principal, annualRate, years) => {
    const monthlyRate = annualRate / 100 / 12;
    const numberOfPayments = years * 12;
    if (monthlyRate === 0) return principal / numberOfPayments;
    return (
      (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
    );
  },
  roi: (gain, investment) => {
    if (investment === 0) throw new Error('Investment cannot be zero');
    return ((gain - investment) / investment) * 100;
  },
  discountedValue: (futureValue, rate, time) => {
    return futureValue / Math.pow(1 + rate / 100, time);
  },
  futureValue: (presentValue, rate, time) => {
    return presentValue * Math.pow(1 + rate / 100, time);
  },
  breakEven: (fixedCost, pricePerUnit, variableCostPerUnit) => {
    return fixedCost / (pricePerUnit - variableCostPerUnit);
  },
  taxCalculation: (amount, taxRate) => {
    return amount * (1 + taxRate / 100);
  },
  discountAmount: (originalPrice, discountPercent) => {
    return originalPrice * (1 - discountPercent / 100);
  },
};

// Number Formatting
export const formatNumber = (num, options = {}) => {
  const {
    decimals = 2,
    useThousands = true,
    notation = 'standard', // 'standard', 'scientific', 'engineering'
  } = options;

  if (notation === 'scientific') {
    return num.toExponential(decimals);
  }

  if (notation === 'engineering') {
    const abs = Math.abs(num);
    const exponent = Math.floor(Math.log10(abs) / 3) * 3;
    const mantissa = num / Math.pow(10, exponent);
    return `${mantissa.toFixed(decimals)}e${exponent}`;
  }

  const formatted = parseFloat(num.toFixed(decimals));
  if (!useThousands) return formatted.toString();

  return formatted.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

// Number Base Conversion
export const baseConversion = {
  toDecimal: (value, base) => {
    return parseInt(value, base);
  },
  fromDecimal: (value, base) => {
    if (base < 2 || base > 36) throw new Error('Base must be between 2 and 36');
    return Math.floor(value).toString(base).toUpperCase();
  },
  toHex: (value) => '0x' + Math.floor(value).toString(16).toUpperCase(),
  fromHex: (value) => parseInt(value, 16),
  toBinary: (value) => '0b' + Math.floor(value).toString(2),
  fromBinary: (value) => parseInt(value, 2),
  toOctal: (value) => '0o' + Math.floor(value).toString(8),
  fromOctal: (value) => parseInt(value, 8),
};

// Statistics
export const statistics = {
  average: (numbers) => numbers.reduce((a, b) => a + b, 0) / numbers.length,
  sum: (numbers) => numbers.reduce((a, b) => a + b, 0),
  product: (numbers) => numbers.reduce((a, b) => a * b, 1),
  max: (numbers) => Math.max(...numbers),
  min: (numbers) => Math.min(...numbers),
  median: (numbers) => {
    const sorted = [...numbers].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0
      ? sorted[mid]
      : (sorted[mid - 1] + sorted[mid]) / 2;
  },
  standardDeviation: (numbers) => {
    const avg = statistics.average(numbers);
    const squareDiffs = numbers.map((n) => Math.pow(n - avg, 2));
    return Math.sqrt(statistics.average(squareDiffs));
  },
};
