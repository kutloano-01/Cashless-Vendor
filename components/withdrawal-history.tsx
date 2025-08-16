"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Download, Clock, CheckCircle, XCircle } from "lucide-react"

interface WithdrawalRecord {
  id: string
  amount: number
  fee: number
  netAmount: number
  status: "pending" | "processing" | "completed" | "failed"
  requestDate: string
  completedDate?: string
  bankAccount: string
  transactionId?: string
}

export function WithdrawalHistory() {
  // Mock withdrawal history data
  const withdrawals: WithdrawalRecord[] = [
    {
      id: "WD-001",
      amount: 200.0,
      fee: 2.5,
      netAmount: 197.5,
      status: "completed",
      requestDate: "2024-01-15 10:30",
      completedDate: "2024-01-16 14:22",
      bankAccount: "****1234",
      transactionId: "TXN-ABC123",
    },
    {
      id: "WD-002",
      amount: 150.0,
      fee: 2.5,
      netAmount: 147.5,
      status: "processing",
      requestDate: "2024-01-14 16:45",
      bankAccount: "****1234",
    },
    {
      id: "WD-003",
      amount: 75.0,
      fee: 2.5,
      netAmount: 72.5,
      status: "completed",
      requestDate: "2024-01-12 09:15",
      completedDate: "2024-01-13 11:30",
      bankAccount: "****1234",
      transactionId: "TXN-DEF456",
    },
    {
      id: "WD-004",
      amount: 300.0,
      fee: 2.5,
      netAmount: 297.5,
      status: "failed",
      requestDate: "2024-01-10 14:20",
      bankAccount: "****5678",
    },
    {
      id: "WD-005",
      amount: 125.0,
      fee: 2.5,
      netAmount: 122.5,
      status: "completed",
      requestDate: "2024-01-08 11:00",
      completedDate: "2024-01-09 15:45",
      bankAccount: "****1234",
      transactionId: "TXN-GHI789",
    },
  ]

  const getStatusIcon = (status: WithdrawalRecord["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-primary" />
      case "processing":
        return <Clock className="w-4 h-4 text-yellow-600" />
      case "pending":
        return <Clock className="w-4 h-4 text-muted-foreground" />
      case "failed":
        return <XCircle className="w-4 h-4 text-destructive" />
      default:
        return null
    }
  }

  const getStatusColor = (status: WithdrawalRecord["status"]) => {
    switch (status) {
      case "completed":
        return "bg-primary text-primary-foreground"
      case "processing":
        return "bg-yellow-500 text-yellow-50"
      case "pending":
        return "bg-muted text-muted-foreground"
      case "failed":
        return "bg-destructive text-destructive-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusDescription = (withdrawal: WithdrawalRecord) => {
    switch (withdrawal.status) {
      case "completed":
        return `Completed on ${withdrawal.completedDate}`
      case "processing":
        return "Being processed by bank"
      case "pending":
        return "Waiting for processing"
      case "failed":
        return "Failed - contact support"
      default:
        return ""
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Withdrawal History</CardTitle>
            <CardDescription>Track your withdrawal requests and their status</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {withdrawals.map((withdrawal) => (
            <div key={withdrawal.id} className="border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(withdrawal.status)}
                  <div>
                    <p className="font-medium text-sm">{withdrawal.id}</p>
                    <p className="text-xs text-muted-foreground">Requested on {withdrawal.requestDate}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${withdrawal.netAmount.toFixed(2)}</p>
                  <Badge className={`text-xs ${getStatusColor(withdrawal.status)}`}>{withdrawal.status}</Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Amount Requested</p>
                  <p className="font-medium">${withdrawal.amount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Processing Fee</p>
                  <p className="font-medium">${withdrawal.fee.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Bank Account</p>
                  <p className="font-medium">{withdrawal.bankAccount}</p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{getStatusDescription(withdrawal)}</p>
                <div className="flex items-center space-x-2">
                  {withdrawal.transactionId && (
                    <Badge variant="outline" className="text-xs">
                      {withdrawal.transactionId}
                    </Badge>
                  )}
                  <Button variant="ghost" size="sm">
                    <Eye className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {withdrawals.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No withdrawal history yet</p>
            <p className="text-sm text-muted-foreground mt-1">Your withdrawal requests will appear here</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
