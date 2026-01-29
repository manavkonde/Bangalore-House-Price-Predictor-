import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";

// Simulated price trends data for major Bangalore locations
const priceTrendsData = [
  { location: "Indira Nagar", price2022: 120, price2023: 135, price2024: 150 },
  { location: "Koramangala", price2022: 110, price2023: 125, price2024: 140 },
  { location: "Whitefield", price2022: 70, price2023: 80, price2024: 90 },
  { location: "HSR Layout", price2022: 85, price2023: 100, price2024: 110 },
  { location: "Electronic City", price2022: 55, price2023: 62, price2024: 70 },
  { location: "JP Nagar", price2022: 75, price2023: 85, price2024: 95 },
  { location: "Marathahalli", price2022: 65, price2023: 75, price2024: 85 },
  { location: "Hebbal", price2022: 80, price2023: 92, price2024: 105 },
];

export function PriceTrendsChart() {
  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={priceTrendsData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <XAxis 
            dataKey="location" 
            tick={{ fontSize: 12 }} 
            angle={-45}
            textAnchor="end"
            height={80}
            stroke="hsl(var(--muted-foreground))"
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `₹${value}L`}
            stroke="hsl(var(--muted-foreground))"
          />
          <Tooltip 
            formatter={(value: number) => [`₹${value}L`, ""]}
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
            labelStyle={{ color: "hsl(var(--foreground))" }}
          />
          <Legend wrapperStyle={{ paddingTop: 10 }} />
          <Bar 
            dataKey="price2022" 
            name="2022" 
            fill="hsl(var(--muted-foreground))" 
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            dataKey="price2023" 
            name="2023" 
            fill="hsl(var(--primary) / 0.6)" 
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            dataKey="price2024" 
            name="2024" 
            fill="hsl(var(--primary))" 
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
