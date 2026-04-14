// EMI Calculation Utilities
// EMI = P × r × (1+r)^n / ((1+r)^n - 1)
// P = principal, r = monthly interest rate, n = total months

export interface AmortizationRow {
  year: number;
  principalPaid: number;
  interestPaid: number;
  totalPaid: number;
  balance: number;
}

export interface ComparisonRow {
  rate: number;
  emi: number;
  totalInterest: number;
  totalAmount: number;
}

export function calculateEMI(principal: number, annualRate: number, tenureYears: number): number {
  const monthlyRate = annualRate / 12 / 100;
  const totalMonths = tenureYears * 12;

  if (monthlyRate === 0) return principal / totalMonths;

  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1);

  return emi;
}

export function calculateTotalInterest(principal: number, annualRate: number, tenureYears: number): number {
  const emi = calculateEMI(principal, annualRate, tenureYears);
  const totalMonths = tenureYears * 12;
  return emi * totalMonths - principal;
}

export function calculateAmortizationSchedule(
  principal: number,
  annualRate: number,
  tenureYears: number
): AmortizationRow[] {
  const monthlyRate = annualRate / 12 / 100;
  const emi = calculateEMI(principal, annualRate, tenureYears);
  const schedule: AmortizationRow[] = [];

  let balance = principal;

  for (let year = 1; year <= tenureYears; year++) {
    let yearPrincipal = 0;
    let yearInterest = 0;

    for (let month = 0; month < 12; month++) {
      if (balance <= 0) break;
      const interestForMonth = balance * monthlyRate;
      const principalForMonth = Math.min(emi - interestForMonth, balance);

      yearPrincipal += principalForMonth;
      yearInterest += interestForMonth;
      balance -= principalForMonth;
    }

    schedule.push({
      year,
      principalPaid: Math.round(yearPrincipal),
      interestPaid: Math.round(yearInterest),
      totalPaid: Math.round(yearPrincipal + yearInterest),
      balance: Math.max(0, Math.round(balance)),
    });
  }

  return schedule;
}

export function compareRates(
  principal: number,
  tenureYears: number,
  rates: number[] = [7, 8, 8.5, 9, 10, 11]
): ComparisonRow[] {
  return rates.map((rate) => {
    const emi = calculateEMI(principal, rate, tenureYears);
    const totalAmount = emi * tenureYears * 12;
    const totalInterest = totalAmount - principal;

    return {
      rate,
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalAmount: Math.round(totalAmount),
    };
  });
}

export function formatINR(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
}
