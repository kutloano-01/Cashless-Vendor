"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"

const chartConfig = {
  card: {
    label: "Card",
    color: "hsl(var(--chart-1))",
  },
  wallet: {
    label: "Digital Wallet",
    color: "hsl(var(--chart-2))",
  },
}

export function PaymentMethodChart() {
  const paymentData = [
    { method: "Card", value: 68, count: 234 },
    { method: "Digital Wallet", value: 32, count: 108 },
  ]

  const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))"]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Methods</CardTitle>
        <CardDescription>Breakdown of customer payment preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={paymentData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {paymentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value, name, props) => [`${value}% (${props.payload.count} transactions)`, name]}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
        <div className="flex justify-center space-x-6 mt-4">
          {paymentData.map((item, index) => (
            <div key={item.method} className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
              <span className="text-sm text-muted-foreground">
                {item.method}: {item.value}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
