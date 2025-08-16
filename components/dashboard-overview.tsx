"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  DollarSign,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export function DashboardOverview() {
  // Mock data - in a real app this would come from an API
  const stats = {
    totalEarnings: 2847.5,
    todayEarnings: 156.75,
    totalTransactions: 342,
    todayTransactions: 23,
    averageTransaction: 8.32,
    pendingWithdrawals: 450.0,
  };

  const recentActivity = [
    { type: "earning", amount: 12.5, time: "2 min ago", trend: "up" },
    { type: "earning", amount: 8.75, time: "15 min ago", trend: "up" },
    { type: "withdrawal", amount: 200.0, time: "2 hours ago", trend: "down" },
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Earnings
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.totalEarnings)}
            </div>
            <p className="text-xs text-muted-foreground">
              +{formatCurrency(stats.todayEarnings)} today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTransactions}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.todayTransactions} today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Sale</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.averageTransaction)}
            </div>
            <p className="text-xs text-muted-foreground">Per transaction</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <CardDescription>Manage your account and payments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="font-medium">Pending Withdrawals</p>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(stats.pendingWithdrawals)} available
                </p>
              </div>
              <Badge variant="secondary">Withdraw</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="font-medium">Account Status</p>
                <p className="text-sm text-muted-foreground">
                  Verified & Active
                </p>
              </div>
              <Badge className="bg-primary">Active</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <CardDescription>Your latest transactions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      activity.trend === "up"
                        ? "bg-primary"
                        : "bg-muted-foreground"
                    }`}
                  />
                  <div>
                    <p className="text-sm font-medium">
                      {activity.type === "earning"
                        ? "Payment received"
                        : "Withdrawal processed"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <span
                    className={`text-sm font-medium ${
                      activity.trend === "up"
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    {activity.trend === "up" ? "+" : "-"}
                    {formatCurrency(activity.amount)}
                  </span>
                  {activity.trend === "up" ? (
                    <ArrowUpRight className="w-3 h-3 text-primary" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 text-muted-foreground" />
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
