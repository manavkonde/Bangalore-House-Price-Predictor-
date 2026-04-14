import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import {
  Calculator,
  IndianRupee,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Info,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  calculateEMI,
  calculateTotalInterest,
  calculateAmortizationSchedule,
  compareRates,
  formatINR,
} from "@/utils/emiCalculations";

export default function EMICalculatorPage() {
  const [searchParams] = useSearchParams();
  const prefilledAmount = searchParams.get("amount");

  const [loanAmount, setLoanAmount] = useState<number>(
    prefilledAmount ? Math.round(Number(prefilledAmount) * 100000 * 0.8) : 5000000
  );
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [tenure, setTenure] = useState<number>(20);
  const [downPaymentPct, setDownPaymentPct] = useState<number>(20);
  const [showAmortization, setShowAmortization] = useState(false);

  const propertyValue = prefilledAmount ? Number(prefilledAmount) * 100000 : loanAmount / (1 - downPaymentPct / 100);
  const principal = Math.round(propertyValue * (1 - downPaymentPct / 100));

  const emi = useMemo(() => calculateEMI(principal, interestRate, tenure), [principal, interestRate, tenure]);
  const totalInterest = useMemo(() => calculateTotalInterest(principal, interestRate, tenure), [principal, interestRate, tenure]);
  const totalAmount = principal + totalInterest;
  const amortization = useMemo(() => calculateAmortizationSchedule(principal, interestRate, tenure), [principal, interestRate, tenure]);
  const rateComparison = useMemo(() => compareRates(principal, tenure), [principal, tenure]);

  const pieData = [
    { name: "Principal", value: principal, color: "#1e3a5f" },
    { name: "Interest", value: Math.round(totalInterest), color: "#f59e0b" },
  ];

  return (
    <AppLayout>
      <div className="relative mb-8">
        <div className="absolute -top-8 -left-8 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-orange-500/5 rounded-full blur-3xl" />
        <PageHeader
          title="EMI Calculator"
          description="Calculate your monthly mortgage payments and explore different loan scenarios"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {/* Left: Input Form */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="absolute -inset-[1px] bg-gradient-to-br from-amber-500/20 via-transparent to-blue-500/10 rounded-3xl" />
          <Card className="rounded-3xl shadow-card border-border/30 relative overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-3 font-display">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-navy-800 to-navy-900 flex items-center justify-center shadow-lg">
                  <Calculator className="h-5 w-5 text-gold-400" />
                </div>
                Loan Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-2">
              {/* Property Value */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-foreground">Property Value</label>
                  <span className="text-sm font-bold text-primary">{formatINR(propertyValue)}</span>
                </div>
                <Slider
                  value={[propertyValue]}
                  onValueChange={([v]) => setLoanAmount(Math.round(v * (1 - downPaymentPct / 100)))}
                  min={500000}
                  max={100000000}
                  step={100000}
                  className="w-full"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                  <span>₹5L</span><span>₹10Cr</span>
                </div>
              </div>

              {/* Down Payment */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-foreground">Down Payment</label>
                  <span className="text-sm font-bold text-primary">{downPaymentPct}% ({formatINR(propertyValue * downPaymentPct / 100)})</span>
                </div>
                <Slider
                  value={[downPaymentPct]}
                  onValueChange={([v]) => setDownPaymentPct(v)}
                  min={0}
                  max={50}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                  <span>0%</span><span>50%</span>
                </div>
              </div>

              {/* Interest Rate */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-foreground">Interest Rate</label>
                  <span className="text-sm font-bold text-primary">{interestRate}%</span>
                </div>
                <Slider
                  value={[interestRate]}
                  onValueChange={([v]) => setInterestRate(Number(v.toFixed(1)))}
                  min={6}
                  max={15}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                  <span>6%</span><span>15%</span>
                </div>
              </div>

              {/* Tenure */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-foreground">Loan Tenure</label>
                  <span className="text-sm font-bold text-primary">{tenure} years</span>
                </div>
                <Slider
                  value={[tenure]}
                  onValueChange={([v]) => setTenure(v)}
                  min={1}
                  max={30}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                  <span>1 yr</span><span>30 yrs</span>
                </div>
              </div>

              {/* Loan Amount Display */}
              <div className="bg-muted/30 rounded-xl p-4 border border-border/30">
                <p className="text-xs text-muted-foreground mb-1">Loan Amount (after down payment)</p>
                <p className="text-xl font-display font-bold text-foreground">{formatINR(principal)}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right: Results */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
          {/* EMI Display */}
          <Card className="rounded-3xl shadow-card border-border/30 overflow-hidden">
            <div className="bg-gradient-to-r from-navy-800 to-navy-900 p-6 text-center relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/15 to-transparent rounded-full blur-3xl" />
              <p className="text-xs font-bold text-gold-400/80 uppercase tracking-[0.2em] mb-2">Monthly EMI</p>
              <motion.p
                key={emi}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-4xl font-display font-bold text-white text-shimmer"
              >
                {formatINR(Math.round(emi))}
              </motion.p>
              <p className="text-xs text-white/40 mt-2">{formatINR(Math.round(emi * 12))} per year</p>
            </div>
            <CardContent className="pt-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-muted/30 rounded-xl">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Principal</p>
                  <p className="text-sm font-bold text-foreground">{formatINR(principal)}</p>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded-xl">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Interest</p>
                  <p className="text-sm font-bold text-amber-600">{formatINR(Math.round(totalInterest))}</p>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded-xl">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Total</p>
                  <p className="text-sm font-bold text-foreground">{formatINR(Math.round(totalAmount))}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Donut Chart */}
          <Card className="rounded-2xl shadow-card border-border/30">
            <CardContent className="pt-4">
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [formatINR(value), ""]}
                      contentStyle={{
                        borderRadius: "10px",
                        border: "1px solid hsl(var(--border))",
                        backgroundColor: "hsl(var(--background))",
                        fontSize: "12px",
                      }}
                    />
                    <Legend
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ fontSize: "11px", fontFamily: "Inter" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="text-center mt-1">
                <p className="text-xs text-muted-foreground">
                  Interest is <span className="font-bold text-amber-600">{((totalInterest / principal) * 100).toFixed(0)}%</span> of principal
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Rate Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-6xl mx-auto mt-6"
      >
        <Card className="rounded-2xl shadow-card border-border/30">
          <CardHeader className="border-b border-border/40 bg-muted/20 pb-3">
            <CardTitle className="flex items-center gap-2 font-display text-base">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <TrendingUp className="h-3.5 w-3.5 text-white" />
              </div>
              Compare Interest Rates
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={rateComparison} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                  <XAxis dataKey="rate" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                  <YAxis fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => formatINR(v)} />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      formatINR(value),
                      name === "emi" ? "Monthly EMI" : name === "totalInterest" ? "Total Interest" : name,
                    ]}
                    contentStyle={{
                      borderRadius: "10px",
                      border: "1px solid hsl(var(--border))",
                      backgroundColor: "hsl(var(--background))",
                      fontSize: "12px",
                    }}
                  />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
                  <Bar dataKey="emi" name="Monthly EMI" fill="#1e3a5f" radius={[4, 4, 0, 0]} maxBarSize={35} />
                  <Bar dataKey="totalInterest" name="Total Interest" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={35} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Amortization Schedule */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="max-w-6xl mx-auto mt-6"
      >
        <Card className="rounded-2xl shadow-card border-border/30">
          <CardHeader
            className="border-b border-border/40 bg-muted/20 pb-3 cursor-pointer"
            onClick={() => setShowAmortization(!showAmortization)}
          >
            <CardTitle className="flex items-center justify-between font-display text-base">
              <span className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                  <IndianRupee className="h-3.5 w-3.5 text-white" />
                </div>
                Amortization Schedule
              </span>
              {showAmortization ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </CardTitle>
          </CardHeader>
          {showAmortization && (
            <CardContent className="pt-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/40">
                      <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground">Year</th>
                      <th className="text-right py-2 px-3 text-xs font-semibold text-muted-foreground">Principal</th>
                      <th className="text-right py-2 px-3 text-xs font-semibold text-muted-foreground">Interest</th>
                      <th className="text-right py-2 px-3 text-xs font-semibold text-muted-foreground">Total Paid</th>
                      <th className="text-right py-2 px-3 text-xs font-semibold text-muted-foreground">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {amortization.map((row) => (
                      <tr key={row.year} className="border-b border-border/20 hover:bg-muted/30 transition-colors">
                        <td className="py-2.5 px-3 font-medium">{row.year}</td>
                        <td className="py-2.5 px-3 text-right text-foreground">{formatINR(row.principalPaid)}</td>
                        <td className="py-2.5 px-3 text-right text-amber-600">{formatINR(row.interestPaid)}</td>
                        <td className="py-2.5 px-3 text-right font-medium">{formatINR(row.totalPaid)}</td>
                        <td className="py-2.5 px-3 text-right text-muted-foreground">{formatINR(row.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          )}
        </Card>
      </motion.div>

      {/* Info Note */}
      <div className="max-w-6xl mx-auto mt-4 mb-8">
        <div className="flex items-start gap-2.5 bg-blue-50 dark:bg-blue-900/20 p-3.5 rounded-xl text-xs text-muted-foreground border border-blue-200/50 dark:border-blue-800/50">
          <Info className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
          <p className="leading-relaxed">
            <strong className="text-foreground">Disclaimer:</strong> EMI calculations are indicative and based on standard reducing balance method. Actual EMI may vary based on bank policies, processing fees, and other charges.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
