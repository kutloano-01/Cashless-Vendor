"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Badge } from "@/components/ui/badge"

const chartConfig = {
  transactions: {
    label: "Transactions",
    color: "hsl(var(--chart-1))",
  },
}

export function TransactionAnalytics() {
  // Mock hourly transaction data
  const hourlyData = [
    { hour: "6 AM", transactions: 2 },
    { hour: "7 AM", transactions: 5 },
    { hour: "8 AM", transactions: 12 },
    { hour: "9 AM", transactions: 18 },
    { hour: "10 AM", transactions: 25 },
    { hour: "11 AM", transactions: 32 },
    { hour: "12 PM", transactions: 45 },
    { hour: "1 PM", transactions: 52 },
    { hour: "2 PM", transactions: 58 },
    { hour: "3 PM", transactions: 48 },
    { hour: "4 PM", transactions: 35 },
    { hour: "5 PM", transactions: 28 },
    { hour: "6 PM", transactions: 15 },
    { hour: "7 PM", transactions: 8 },
    { hour: "8 PM", transactions: 3 },
  ]

  // Mock weekly comparison
  const weeklyComparison = [
    { day: "Mon", thisWeek: 45, lastWeek: 38 },
    { day: "Tue", thisWeek: 52, lastWeek: 41 },
    { day: "Wed", thisWeek: 48, lastWeek: 45 },
    { day: "Thu", thisWeek: 61, lastWeek: 52 },
    { day: "Fri", thisWeek: 67, lastWeek: 58 },
    { day: "Sat", thisWeek: 89, lastWeek: 76 },
    { day: "Sun", thisWeek: 34, lastWeek: 29 },
  ]

  const insights = [
    { title: "Peak Performance", description: "2 PM - 3 PM is your busiest hour", type: "success" },
    { title: "Growth Opportunity", description: "Morning sales could be improved", type: "info" },
    { title: "Weekend Boost", description: "Saturday shows 17% increase", type: "success" },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Hourly Transaction Volume</CardTitle>
            <CardDescription>Transaction patterns throughout the day</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={hourlyData}>
                  <XAxis
                    dataKey="hour"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                    className="text-muted-foreground"
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} className="text-muted-foreground" />
                  <ChartTooltip content={<ChartTooltipContent />} formatter={(value) => [`${value}`, "Transactions"]} />
                  <Bar dataKey="transactions" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Comparison</CardTitle>
            <CardDescription>This week vs last week performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                thisWeek: { label: "This Week", color: "hsl(var(--chart-1))" },
                lastWeek: { label: "Last Week", color: "hsl(var(--chart-2))" },
              }}
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyComparison}>
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                    className="text-muted-foreground"
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} className="text-muted-foreground" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="thisWeek" fill="hsl(var(--chart-1))" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="lastWeek" fill="hsl(var(--chart-2))" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Business Insights</CardTitle>
            <CardDescription>AI-powered recommendations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {insights.map((insight, index) => (
              <div key={index} className="p-4 border border-border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-sm">{insight.title}</h4>
                  <Badge variant={insight.type === "success" ? "default" : "secondary"} className="text-xs">
                    {insight.type === "success" ? "Opportunity" : "Insight"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{insight.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Key performance indicators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Busiest Hour</span>
              <span className="font-semibold">2 PM - 3 PM</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Best Day</span>
              <span className="font-semibold">Saturday</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Avg. Daily Sales</span>
              <span className="font-semibold">$67.50</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Growth Rate</span>
              <span className="font-semibold text-primary">+12.3%</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
