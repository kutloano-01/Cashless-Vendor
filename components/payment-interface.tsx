"use client";

import { useState, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  Store,
  CreditCard,
  Smartphone,
  ArrowLeft,
} from "lucide-react";
import { formatCurrency, getCurrencySymbol } from "@/lib/utils";

interface VendorInfo {
  id: string;
  businessName: string;
  ownerName: string;
  businessType: string;
  location: string;
  description?: string;
}

interface PaymentInterfaceProps {
  vendorId: string;
}

export function PaymentInterface({ vendorId }: PaymentInterfaceProps) {
  const [vendor, setVendor] = useState<VendorInfo | null>(null);
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState<
    "amount" | "confirm" | "processing" | "success"
  >("amount");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "wallet">("card");
  const quickAmounts = ["5.00", "10.00", "20.00", "50.00"];

  const handleQuickAmount = (quickAmount: string) => {
    setAmount(quickAmount);
  };

  useEffect(() => {
    // Simulate fetching vendor info
    const fetchVendor = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setVendor({
        id: vendorId,
        businessName: "Maria's Fresh Fruits",
        ownerName: "Maria Rodriguez",
        businessType: "Food & Beverages",
        location: "Corner of Main St & 5th Ave",
        description: "Fresh, locally sourced fruits and vegetables daily",
      });
    };
    fetchVendor();
  }, [vendorId]);

  const handleAmountSubmit = () => {
    if (amount && Number.parseFloat(amount) > 0) {
      setStep("confirm");
    }
  };

  const handlePayment = async () => {
    setStep("processing");
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setStep("success");
  };

  if (!vendor) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2">
              Loading vendor information...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === "success") {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Payment Successful!
              </h3>
              <p className="text-muted-foreground mb-4">
                Your payment of {formatCurrency(amount)} to{" "}
                {vendor.businessName} has been processed.
              </p>
            </div>
            <div className="bg-muted p-4 rounded-lg text-left">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Transaction ID:</span>
                <span className="font-mono">
                  TXN-{Math.random().toString(36).substr(2, 8).toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-semibold">{formatCurrency(amount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Vendor:</span>
                <span>{vendor.businessName}</span>
              </div>
            </div>
            <Button
              onClick={() => window.close()}
              variant="outline"
              className="w-full"
            >
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === "processing") {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Processing Payment...
              </h3>
              <p className="text-muted-foreground">
                Please wait while we process your payment of{" "}
                {formatCurrency(amount)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Store className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg">{vendor.businessName}</CardTitle>
            <CardDescription>{vendor.location}</CardDescription>
          </div>
          <Badge variant="secondary">{vendor.businessType}</Badge>
        </div>
        {vendor.description && (
          <p className="text-sm text-muted-foreground mt-2">
            {vendor.description}
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {step === "amount" && (
          <>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Payment Amount</Label>
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
                    min="0.01"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Quick amounts
                </Label>
                <div className="grid grid-cols-4 gap-2">
                  {quickAmounts.map((quickAmount) => (
                    <Button
                      key={quickAmount}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAmount(quickAmount)}
                      className="text-sm"
                    >
                      {formatCurrency(quickAmount)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            <Button
              onClick={handleAmountSubmit}
              disabled={!amount || Number.parseFloat(amount) <= 0}
              className="w-full"
            >
              Continue to Payment
            </Button>
          </>
        )}

        {step === "confirm" && (
          <>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep("amount")}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Payment Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-semibold text-lg">
                      {formatCurrency(amount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">To:</span>
                    <span>{vendor.businessName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Processing Fee:
                    </span>
                    <span>{formatCurrency(0)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>{formatCurrency(amount)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Payment Method</Label>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant={paymentMethod === "card" ? "default" : "outline"}
                    onClick={() => setPaymentMethod("card")}
                    className="flex items-center justify-center space-x-2 h-12"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Card</span>
                  </Button>
                  <Button
                    variant={paymentMethod === "wallet" ? "default" : "outline"}
                    onClick={() => setPaymentMethod("wallet")}
                    className="flex items-center justify-center space-x-2 h-12"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Wallet</span>
                  </Button>
                </div>
              </div>
            </div>

            <Button onClick={handlePayment} className="w-full">
              Pay {formatCurrency(amount)}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
