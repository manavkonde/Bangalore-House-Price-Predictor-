import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import {
  TrendingUp,
  IndianRupee,
  Home,
  PiggyBank,
  Landmark,
  Coins,
  ArrowUpRight,
  Info,
  Award
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  calculatePropertyROI,
  compareInvestments,
  getBestInvestment,
} from "@/utils/roiCalculations";
import { formatINR } from "@/utils/emiCalculations";

export default function ROIAnalyzerPage() {
  const [searchParams] = useSearchParams();
  const prefilledAmount = searchParams.get("amount");

  const [propertyPrice, setPropertyPrice] = useState<number>(
    prefilledAmount ? Number(prefilledAmount) * 100000 : 5000000
  );
  const [horizon, setHorizon] = useState<number>(10);
  const [appreciationRate, setAppreciationRate] = useState<number>(6.5);
  const [rentalYield, setRentalYield] = useState<number>(3.0);

  const propertyData = useMemo(
    () => calculatePropertyROI(propertyPrice, appreciationRate, horizon, rentalYield),
    [propertyPrice, appreciationRate, horizon, rentalYield]
  );

  const comparisonData = useMemo(
    () => compareInvestments(propertyPrice, horizon, appreciationRate, rentalYield),
    [propertyPrice, horizon, appreciationRate, rentalYield]
  );

  const bestInvestment = useMemo(
    () => getBestInvestment(propertyPrice, horizon, appreciationRate, rentalYield),
    [propertyPrice, horizon, appreciationRate, rentalYield]
  );

  const lastYearData = propertyData[propertyData.length - 1];
  const totalReturnPct = ((lastYearData.propertyValue + lastYearData.cumulativeRental - propertyPrice) / propertyPrice) * 100;

  return (
    <AppLayout>
      <div className="relative mb-8">
        <div className="absolute -top-8 -left-8 w-32 h-32 bg-gradient-to-br from-green-500/10 to-emerald-500/5 rounded-full blur-3xl" />
        <PageHeader
          title="Investment ROI Analyzer"
          description="Project property value over time and compare returns with other investment options"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* Left Column: Inputs & Summary */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="rounded-3xl shadow-card border-border/30 overflow-hidden relative">
              <div className="absolute -inset-[1px] bg-gradient-to-br from-emerald-500/20 via-transparent to-teal-500/10 rounded-3xl -z-10" />
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 font-display">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-navy-800 to-navy-900 flex items-center justify-center shadow-lg">
                    <TrendingUp className="h-5 w-5 text-emerald-400" />
                  </div>
                  Investment Basics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Property Price */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-foreground">Property Price</label>
                    <span className="text-sm font-bold text-primary">{formatINR(propertyPrice)}</span>
                  </div>
                  <Slider
                    value={[propertyPrice]}
                    onValueChange={([v]) => setPropertyPrice(v)}
                    min={1000000}
                    max={100000000}
                    step={100000}
                    className="w-full"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                    <span>₹10L</span><span>₹10Cr</span>
                  </div>
                </div>

                {/* Investment Horizon */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-foreground">Time Horizon</label>
                    <span className="text-sm font-bold text-primary">{horizon} Years</span>
                  </div>
                  <Slider
                    value={[horizon]}
                    onValueChange={([v]) => setHorizon(v)}
                    min={1}
                    max={30}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                    <span>1 yr</span><span>30 yrs</span>
                  </div>
                </div>

                {/* Appreciation Rate */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-foreground">Appreciation Rate (p.a.)</label>
                    <span className="text-sm font-bold text-primary">{appreciationRate}%</span>
                  </div>
                  <Slider
                    value={[appreciationRate]}
                    onValueChange={([v]) => setAppreciationRate(Number(v.toFixed(1)))}
                    min={2}
                    max={15}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                    <span>2%</span><span>15%</span>
                  </div>
                </div>

                {/* Rental Yield */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-foreground">Rental Yield (p.a.)</label>
                    <span className="text-sm font-bold text-primary">{rentalYield}%</span>
                  </div>
                  <Slider
                    value={[rentalYield]}
                    onValueChange={([v]) => setRentalYield(Number(v.toFixed(1)))}
                    min={0}
                    max={10}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                    <span>0%</span><span>10%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Summary Cards */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="rounded-2xl border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-sm overflow-hidden">
               <CardContent className="p-5">
                <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <ArrowUpRight className="h-3.5 w-3.5" /> Total Return
                </p>
                <p className="text-3xl font-display font-bold text-emerald-600 dark:text-emerald-500">
                  +{totalReturnPct.toFixed(0)}%
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Absolute gain over {horizon} years
                </p>
              </CardContent>
            </Card>
          </motion.div>
          
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="rounded-2xl border-amber-500/20 bg-amber-50/50 dark:bg-amber-950/20 shadow-sm overflow-hidden">
              <CardContent className="p-5">
                 <p className="text-xs font-semibold text-amber-800 dark:text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                   <Home className="h-3.5 w-3.5" /> Rental Income
                 </p>
                 <p className="text-2xl font-display font-bold text-amber-600 dark:text-amber-500">
                   {formatINR(lastYearData.cumulativeRental)}
                 </p>
                 <p className="text-sm text-muted-foreground mt-1">
                   Total accumulated rent
                 </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Column: Charts & Analysis */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Projection Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="rounded-3xl shadow-card border-border/30">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <div>
                   <CardTitle className="font-display">Property Value Projection</CardTitle>
                   <CardDescription>Value appreciation + Cumulative Rental Income</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={propertyData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorRent" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                      <XAxis dataKey="year" tickLine={false} axisLine={false} dy={10} tickFormatter={(v) => `Yr ${v}`} />
                      <YAxis tickLine={false} axisLine={false} dx={-10} tickFormatter={(v) => formatINR(v).replace('₹', '')} />
                      <Tooltip
                        formatter={(value: number) => [formatINR(value), ""]}
                        labelFormatter={(label) => `Year ${label}`}
                        contentStyle={{
                          borderRadius: "12px",
                          border: "1px solid hsl(var(--border))",
                          backgroundColor: "hsl(var(--background))",
                        }}
                      />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                      <Area type="monotone" dataKey="propertyValue" name="Property Value" stroke="#10b981" strokeWidth={3} fill="url(#colorVal)" />
                      <Area type="monotone" dataKey="cumulativeRental" name="Cumulative Rent" stroke="#f59e0b" strokeWidth={3} fill="url(#colorRent)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Investment Comparison */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="rounded-3xl shadow-card border-border/30">
               <CardHeader className="pb-2">
                 <CardTitle className="font-display">Investment Comparison</CardTitle>
                 <CardDescription>Property vs Mutual Funds, Fixed Deposit, and Gold</CardDescription>
               </CardHeader>
               <CardContent>
                 <div className="h-[300px] w-full mt-4">
                   <ResponsiveContainer width="100%" height="100%">
                     <LineChart data={comparisonData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                        <XAxis dataKey="year" tickLine={false} axisLine={false} dy={10} tickFormatter={(v) => `Yr ${v}`} />
                        <YAxis tickLine={false} axisLine={false} dx={-10} tickFormatter={(v) => formatINR(v).replace('₹', '')} />
                        <Tooltip
                          formatter={(value: number, name: string) => [
                            formatINR(value),
                            name === "property" ? "Property + Rent" :
                            name === "mutualFund" ? "Mutual Fund (12%)" :
                            name === "gold" ? "Gold (8%)" : "Fixed Deposit (7%)"
                          ]}
                          labelFormatter={(label) => `Year ${label}`}
                          contentStyle={{
                            borderRadius: "12px",
                            border: "1px solid hsl(var(--border))",
                            backgroundColor: "hsl(var(--background))",
                            fontSize: "12px"
                          }}
                        />
                        <Legend iconType="circle" wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                        <Line type="monotone" dataKey="property" name="Property + Rent" stroke="#10b981" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                        <Line type="monotone" dataKey="mutualFund" name="Mutual Fund (12%)" stroke="#8b5cf6" strokeWidth={3} dot={false} />
                        <Line type="monotone" dataKey="gold" name="Gold (8%)" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                        <Line type="monotone" dataKey="fd" name="Fixed Deposit (7%)" stroke="#64748b" strokeWidth={2} strokeDasharray="3 3" dot={false} />
                     </LineChart>
                   </ResponsiveContainer>
                 </div>
                 
                 {/* Verdict Card */}
                 <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-navy-800 to-navy-900 border border-navy-700">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center shrink-0">
                        <Award className="h-5 w-5 text-gold-400" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white">Best Performing Asset</h4>
                        <p className="text-xs text-white/70 mt-0.5">
                          Over {horizon} years, <strong className="text-gold-400">{bestInvestment.name}</strong> yields the highest returns ({bestInvestment.returnPct}% total return, {bestInvestment.margin}).
                        </p>
                      </div>
                    </div>
                 </div>
               </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}
