"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  DollarSign,
  Wallet,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { formatCurrency, getCurrencySymbol } from "@/lib/utils";

export function WithdrawalInterface() {
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Mock account data
  const accountData = {
    availableBalance: 1247.5,
    pendingWithdrawals: 450.0,
    minimumWithdrawal: 10.0,
    maximumWithdrawal: 1000.0,
    processingFee: 2.5,
    estimatedArrival: "1-2 business days",
  };

  const handleWithdrawal = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setShowSuccess(true);
    setAmount("");

    // Hide success message after 5 seconds
    setTimeout(() => setShowSuccess(false), 5000);
  };

  const withdrawalAmount = Number.parseFloat(amount) || 0;
  const totalFee = withdrawalAmount > 0 ? accountData.processingFee : 0;
  const netAmount = withdrawalAmount - totalFee;
  const isValidAmount =
    withdrawalAmount >= accountData.minimumWithdrawal &&
    withdrawalAmount <=
      Math.min(accountData.maximumWithdrawal, accountData.availableBalance);

  return (
    <div className="space-y-6">
      {/* Balance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wallet className="w-5 h-5 text-primary" />
            <span>Account Balance</span>
          </CardTitle>
          <CardDescription>
            Your current earnings and withdrawal status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {formatCurrency(accountData.availableBalance)}
              </div>
              <p className="text-sm text-muted-foreground">Available Balance</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {formatCurrency(accountData.pendingWithdrawals)}
              </div>
              <p className="text-sm text-muted-foreground">
                Pending Withdrawals
              </p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-foreground">
                {formatCurrency(
                  accountData.availableBalance + accountData.pendingWithdrawals
                )}
              </div>
              <p className="text-sm text-muted-foreground">Total Earnings</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Success Alert */}
      {showSuccess && (
        <Alert className="border-primary bg-primary/5">
          <CheckCircle className="h-4 w-4 text-primary" />
          <AlertDescription className="text-primary">
            Withdrawal request submitted successfully! You'll receive
            confirmation via SMS.
          </AlertDescription>
        </Alert>
      )}

      {/* Withdrawal Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-primary" />
            <span>Request Withdrawal</span>
          </CardTitle>
          <CardDescription>
            Transfer your earnings to your bank account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Withdrawal Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  {getCurrencySymbol()}
                </span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-8 text-lg"
                  step="0.01"
                  min={accountData.minimumWithdrawal}
                  max={Math.min(
                    accountData.maximumWithdrawal,
                    accountData.availableBalance
                  )}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>
                  Min: {formatCurrency(accountData.minimumWithdrawal)}
                </span>
                <span>
                  Max:{" "}
                  {formatCurrency(
                    Math.min(
                      accountData.maximumWithdrawal,
                      accountData.availableBalance
                    )
                  )}
                </span>
              </div>
            </div>

            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-4 gap-2">
              {[25, 50, 100, accountData.availableBalance].map(
                (quickAmount) => (
                  <Button
                    key={quickAmount}
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setAmount(
                        Math.min(
                          quickAmount,
                          accountData.availableBalance
                        ).toFixed(2)
                      )
                    }
                    disabled={quickAmount > accountData.availableBalance}
                  >
                    {quickAmount === accountData.availableBalance
                      ? "All"
                      : formatCurrency(quickAmount)}
                  </Button>
                )
              )}
            </div>
          </div>

          {/* Withdrawal Summary */}
          {withdrawalAmount > 0 && (
            <div className="bg-muted p-4 rounded-lg space-y-3">
              <h4 className="font-semibold">Withdrawal Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Withdrawal Amount:</span>
                  <span>{formatCurrency(withdrawalAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Processing Fee:</span>
                  <span>{formatCurrency(totalFee)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>You'll Receive:</span>
                  <span>{formatCurrency(Math.max(0, netAmount))}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>Estimated arrival: {accountData.estimatedArrival}</span>
              </div>
            </div>
          )}

          {/* Validation Messages */}
          {amount && !isValidAmount && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {withdrawalAmount < accountData.minimumWithdrawal
                  ? `Minimum withdrawal amount is ${formatCurrency(
                      accountData.minimumWithdrawal
                    )}`
                  : withdrawalAmount > accountData.availableBalance
                  ? "Insufficient balance for this withdrawal"
                  : `Maximum withdrawal amount is ${formatCurrency(
                      accountData.maximumWithdrawal
                    )}`}
              </AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handleWithdrawal}
            disabled={!isValidAmount || isSubmitting || !amount}
            className="w-full"
          >
            {isSubmitting ? "Processing..." : `Request Withdrawal`}
          </Button>

          {/* Important Notes */}
          <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
            <h4 className="font-semibold text-sm mb-2 text-blue-900 dark:text-blue-100">
              Important Notes:
            </h4>
            <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Withdrawals are processed within 1-2 business days</li>
              <li>
                • A processing fee of{" "}
                {formatCurrency(accountData.processingFee)} applies to all
                withdrawals
              </li>
              <li>• Ensure your bank account details are up to date</li>
              <li>• You'll receive SMS confirmation once processed</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
