export interface ProjectionRow {
  year: number;
  propertyValue: number;
  rentalIncome: number;
  cumulativeRental: number;
  totalReturn: number;
}

export interface InvestmentComparison {
  year: number;
  property: number;
  fd: number;
  mutualFund: number;
  gold: number;
}

export function calculatePropertyROI(
  price: number,
  appreciationRate: number,
  years: number,
  rentalYield: number
): ProjectionRow[] {
  const rows: ProjectionRow[] = [];
  let cumulativeRental = 0;

  for (let y = 1; y <= years; y++) {
    const propertyValue = price * Math.pow(1 + appreciationRate / 100, y);
    const yearlyRental = propertyValue * (rentalYield / 100);
    cumulativeRental += yearlyRental;

    rows.push({
      year: y,
      propertyValue: Math.round(propertyValue),
      rentalIncome: Math.round(yearlyRental),
      cumulativeRental: Math.round(cumulativeRental),
      totalReturn: Math.round(propertyValue + cumulativeRental - price),
    });
  }

  return rows;
}

export function calculateCompoundReturn(principal: number, rate: number, years: number): number {
  return principal * Math.pow(1 + rate / 100, years);
}

export function compareInvestments(
  principal: number,
  years: number,
  appreciationRate: number = 6.5,
  rentalYield: number = 3
): InvestmentComparison[] {
  const fdRate = 7;
  const mfRate = 12;
  const goldRate = 8;

  const data: InvestmentComparison[] = [];

  for (let y = 1; y <= years; y++) {
    const propertyVal = principal * Math.pow(1 + appreciationRate / 100, y);
    let cumulativeRental = 0;
    for (let r = 1; r <= y; r++) {
      cumulativeRental += principal * Math.pow(1 + appreciationRate / 100, r) * (rentalYield / 100);
    }

    data.push({
      year: y,
      property: Math.round(propertyVal + cumulativeRental),
      fd: Math.round(calculateCompoundReturn(principal, fdRate, y)),
      mutualFund: Math.round(calculateCompoundReturn(principal, mfRate, y)),
      gold: Math.round(calculateCompoundReturn(principal, goldRate, y)),
    });
  }

  return data;
}

export function getBestInvestment(
  principal: number,
  years: number,
  appreciationRate: number,
  rentalYield: number
): { name: string; returnPct: number; margin: string } {
  const data = compareInvestments(principal, years, appreciationRate, rentalYield);
  const last = data[data.length - 1];

  const returns = [
    { name: "Property", value: last.property },
    { name: "Fixed Deposit", value: last.fd },
    { name: "Mutual Fund", value: last.mutualFund },
    { name: "Gold", value: last.gold },
  ];

  returns.sort((a, b) => b.value - a.value);
  const best = returns[0];
  const second = returns[1];
  const marginPct = (((best.value - second.value) / second.value) * 100).toFixed(1);

  return {
    name: best.name,
    returnPct: Number((((best.value - principal) / principal) * 100).toFixed(1)),
    margin: `${marginPct}% more than ${second.name}`,
  };
}
