"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const chartConfig = {
  earnings: {
    label: "Earnings",
    color: "hsl(var(--chart-1))",
  },
}

export function EarningsChart() {
  // Mock earnings data for the last 30 days
  const earningsData = [
    { date: "Jan 1", earnings: 45.5 },
    { date: "Jan 2", earnings: 52.25 },
    { date: "Jan 3", earnings: 38.75 },
    { date: "Jan 4", earnings: 67.0 },
    { date: "Jan 5", earnings: 71.25 },
    { date: "Jan 6", earnings: 89.5 },
    { date: "Jan 7", earnings: 95.75 },
    { date: "Jan 8", earnings: 43.25 },
    { date: "Jan 9", earnings: 58.0 },
    { date: "Jan 10", earnings: 72.5 },
    { date: "Jan 11", earnings: 65.25 },
    { date: "Jan 12", earnings: 78.75 },
    { date: "Jan 13", earnings: 92.0 },
    { date: "Jan 14", earnings: 105.25 },
    { date: "Jan 15", earnings: 87.5 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Earnings</CardTitle>
        <CardDescription>Your earnings over the last 15 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={earningsData}>
              <defs>
                <linearGradient id="fillEarnings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-chart-1)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-chart-1)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
                tickFormatter={(value) => `$${value}`}
              />
              <ChartTooltip content={<ChartTooltipContent />} formatter={(value) => [`$${value}`, "Earnings"]} />
              <Area
                type="monotone"
                dataKey="earnings"
                stroke="var(--color-chart-1)"
                strokeWidth={2}
                fill="url(#fillEarnings)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
