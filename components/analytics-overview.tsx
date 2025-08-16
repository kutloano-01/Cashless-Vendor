"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Clock,
  Calendar,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export function AnalyticsOverview() {
  // Mock analytics data
  const analytics = {
    weeklyEarnings: { current: 1247.5, previous: 1089.25, change: 14.5 },
    weeklyTransactions: { current: 156, previous: 142, change: 9.9 },
    averageTransaction: { current: 8.32, previous: 7.67, change: 8.5 },
    peakHour: "2:00 PM - 3:00 PM",
    peakDay: "Saturday",
    topPaymentMethod: "Card (68%)",
  };

  const formatChange = (change: number) => {
    const isPositive = change > 0;
    return {
      value: Math.abs(change).toFixed(1),
      isPositive,
      icon: isPositive ? TrendingUp : TrendingDown,
      color: isPositive ? "text-primary" : "text-destructive",
    };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Weekly Earnings</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(analytics.weeklyEarnings.current)}
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-muted-foreground">vs last week:</span>
            {(() => {
              const change = formatChange(analytics.weeklyEarnings.change);
              const Icon = change.icon;
              return (
                <div className={`flex items-center space-x-1 ${change.color}`}>
                  <Icon className="h-3 w-3" />
                  <span>
                    {change.isPositive ? "+" : "-"}
                    {change.value}%
                  </span>
                </div>
              );
            })()}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Weekly Transactions
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {analytics.weeklyTransactions.current}
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-muted-foreground">vs last week:</span>
            {(() => {
              const change = formatChange(analytics.weeklyTransactions.change);
              const Icon = change.icon;
              return (
                <div className={`flex items-center space-x-1 ${change.color}`}>
                  <Icon className="h-3 w-3" />
                  <span>
                    {change.isPositive ? "+" : "-"}
                    {change.value}%
                  </span>
                </div>
              );
            })()}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Average Transaction
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(analytics.averageTransaction.current)}
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-muted-foreground">vs last week:</span>
            {(() => {
              const change = formatChange(analytics.averageTransaction.change);
              const Icon = change.icon;
              return (
                <div className={`flex items-center space-x-1 ${change.color}`}>
                  <Icon className="h-3 w-3" />
                  <span>
                    {change.isPositive ? "+" : "-"}
                    {change.value}%
                  </span>
                </div>
              );
            })()}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Peak Hour</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-lg font-bold">{analytics.peakHour}</div>
          <p className="text-xs text-muted-foreground">
            Highest transaction volume
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Peak Day</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-lg font-bold">{analytics.peakDay}</div>
          <p className="text-xs text-muted-foreground">Best performing day</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Top Payment Method
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            Popular
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="text-lg font-bold">{analytics.topPaymentMethod}</div>
          <p className="text-xs text-muted-foreground">
            Most used by customers
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
