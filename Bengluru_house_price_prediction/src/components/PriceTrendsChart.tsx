import { useState, useEffect } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe } from "lucide-react";
import { getCities } from "@/services/api";

// Simulated price trends data for major locations by city
const priceTrendsByCity: Record<string, Array<{ location: string, price2022: number, price2023: number, price2024: number }>> = {
  delhi: [
    { location: "Sector 10 Dwarka", price2022: 120, price2023: 135, price2024: 150 },
    { location: "Alaknanda", price2022: 110, price2023: 125, price2024: 140 },
    { location: "Ashok Vihar", price2022: 70, price2023: 80, price2024: 90 },
    { location: "Greater Kailash", price2022: 85, price2023: 100, price2024: 110 },
    { location: "Dwarka Mor", price2022: 55, price2023: 62, price2024: 70 },
    { location: "Babarpur", price2022: 75, price2023: 85, price2024: 95 },
  ],
  bengaluru: [
    { location: "Electronic City", price2022: 120, price2023: 135, price2024: 150 },
    { location: "Koramangala", price2022: 110, price2023: 125, price2024: 140 },
    { location: "Whitefield", price2022: 70, price2023: 80, price2024: 90 },
    { location: "HSR Layout", price2022: 85, price2023: 100, price2024: 110 },
    { location: "Indira Nagar", price2022: 55, price2023: 62, price2024: 70 },
    { location: "JP Nagar", price2022: 75, price2023: 85, price2024: 95 },
  ],
  combined: [
    { location: "Downtown", price2022: 100, price2023: 115, price2024: 130 },
    { location: "Tech Hub", price2022: 95, price2023: 110, price2024: 125 },
    { location: "Suburban", price2022: 60, price2023: 70, price2024: 80 },
    { location: "Business District", price2022: 110, price2023: 125, price2024: 145 },
    { location: "Residential", price2022: 75, price2023: 85, price2024: 100 },
  ],
};

interface PriceTrendsChartProps {
  city?: string;
  onCityChange?: (city: string) => void;
}

export function PriceTrendsChart({ city = "delhi", onCityChange }: PriceTrendsChartProps) {
  const [cities, setCities] = useState<string[]>(["delhi", "bengaluru", "chennai", "hyderabad", "kolkata", "combined"]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const fetchedCities = await getCities();
        setCities(fetchedCities);
      } catch (error) {
        console.error("Failed to fetch cities:", error);
      }
    };
    fetchCities();
  }, []);

  const priceTrendsData = priceTrendsByCity[city] || priceTrendsByCity["delhi"];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Price Trends by Location</h2>
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <Select value={city} onValueChange={(value) => onCityChange?.(value)}>
            <SelectTrigger className="w-[130px] h-9 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {cities.map((c) => (
                <SelectItem key={c} value={c} className="capitalize">
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
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
    </div>
  );
}
