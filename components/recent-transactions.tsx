"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Download } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface Transaction {
  id: string;
  amount: number;
  customerInfo: string;
  timestamp: string;
  status: "completed" | "pending" | "failed";
  paymentMethod: "card" | "wallet";
}

export function RecentTransactions() {
  // Mock transaction data
  const transactions: Transaction[] = [
    {
      id: "TXN-ABC123",
      amount: 12.5,
      customerInfo: "Customer #1234",
      timestamp: "2024-01-15 14:30",
      status: "completed",
      paymentMethod: "card",
    },
    {
      id: "TXN-DEF456",
      amount: 8.75,
      customerInfo: "Customer #5678",
      timestamp: "2024-01-15 14:15",
      status: "completed",
      paymentMethod: "wallet",
    },
    {
      id: "TXN-GHI789",
      amount: 25.0,
      customerInfo: "Customer #9012",
      timestamp: "2024-01-15 13:45",
      status: "completed",
      paymentMethod: "card",
    },
    {
      id: "TXN-JKL012",
      amount: 15.25,
      customerInfo: "Customer #3456",
      timestamp: "2024-01-15 13:20",
      status: "pending",
      paymentMethod: "wallet",
    },
    {
      id: "TXN-MNO345",
      amount: 6.5,
      customerInfo: "Customer #7890",
      timestamp: "2024-01-15 12:55",
      status: "completed",
      paymentMethod: "card",
    },
  ];

  const getStatusColor = (status: Transaction["status"]) => {
    switch (status) {
      case "completed":
        return "bg-primary text-primary-foreground";
      case "pending":
        return "bg-yellow-500 text-yellow-50";
      case "failed":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getPaymentMethodLabel = (method: Transaction["paymentMethod"]) => {
    return method === "card" ? "Card" : "Wallet";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Recent Transactions</CardTitle>
            <CardDescription>Your latest payment activities</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 border border-border rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="flex flex-col">
                  <p className="font-medium text-sm">{transaction.id}</p>
                  <p className="text-xs text-muted-foreground">
                    {transaction.customerInfo}
                  </p>
                </div>
                <div className="flex flex-col">
                  <p className="text-sm text-muted-foreground">
                    {transaction.timestamp}
                  </p>
                  <Badge variant="outline" className="w-fit text-xs">
                    {getPaymentMethodLabel(transaction.paymentMethod)}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="font-semibold">
                    {formatCurrency(transaction.amount)}
                  </p>
                  <Badge
                    className={`text-xs ${getStatusColor(transaction.status)}`}
                  >
                    {transaction.status}
                  </Badge>
                </div>
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Button variant="outline">View All Transactions</Button>
        </div>
      </CardContent>
    </Card>
  );
}
