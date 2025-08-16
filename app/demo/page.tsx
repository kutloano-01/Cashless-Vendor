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
import { Badge } from "@/components/ui/badge";
import {
  QrCode,
  Smartphone,
  CreditCard,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { formatCurrency, getCurrencySymbol } from "@/lib/utils";

export default function DemoPage() {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    {
      id: 1,
      title: "Scan QR Code",
      description:
        "Customer scans the vendor's QR code with their phone camera",
      icon: QrCode,
      color: "bg-blue-500",
    },
    {
      id: 2,
      title: "Enter Amount",
      description:
        "Customer enters the purchase amount and sees vendor details",
      icon: Smartphone,
      color: "bg-emerald-500",
    },
    {
      id: 3,
      title: "Choose Payment",
      description: "Customer selects payment method (card or digital wallet)",
      icon: CreditCard,
      color: "bg-purple-500",
    },
    {
      id: 4,
      title: "Payment Complete",
      description:
        "Instant confirmation with transaction receipt for both parties",
      icon: CheckCircle,
      color: "bg-green-500",
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              Customer Experience Demo
            </Badge>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              How Customers Pay Vendors
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A simple, secure payment process that works on any smartphone - no
              app download required
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <Card
                  key={step.id}
                  className={`cursor-pointer transition-all ${
                    isActive ? "ring-2 ring-primary shadow-lg" : ""
                  }`}
                  onClick={() => setCurrentStep(step.id)}
                >
                  <CardHeader className="text-center pb-2">
                    <div
                      className={`w-12 h-12 rounded-full ${step.color} flex items-center justify-center mx-auto mb-3`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-center text-sm">
                      {step.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  {currentStep}
                </span>
                {steps[currentStep - 1].title}
              </CardTitle>
              <CardDescription>
                {steps[currentStep - 1].description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-6 rounded-lg">
                {currentStep === 1 && (
                  <div className="text-center space-y-4">
                    <div className="w-32 h-32 bg-white border-2 border-gray-300 rounded-lg mx-auto flex items-center justify-center">
                      <QrCode className="w-20 h-20 text-gray-600" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Customer opens their phone camera and points it at the
                      vendor's QR code
                    </p>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg border">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                          <span className="text-emerald-600 font-bold">M</span>
                        </div>
                        <div>
                          <h4 className="font-semibold">
                            Maria's Fresh Fruits
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Corner of Main St & 5th Ave
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Payment Amount
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                            {getCurrencySymbol()}
                          </span>
                          <input
                            className="w-full pl-8 pr-4 py-2 border rounded-md text-lg"
                            placeholder="0.00"
                            value="15.50"
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg border">
                      <h4 className="font-semibold mb-3">Payment Summary</h4>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                          <span>Amount:</span>
                          <span className="font-semibold">
                            {formatCurrency(15.5)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Processing Fee:</span>
                          <span>{formatCurrency(0)}</span>
                        </div>
                        <hr />
                        <div className="flex justify-between font-semibold">
                          <span>Total:</span>
                          <span>{formatCurrency(15.5)}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <button className="flex items-center justify-center gap-2 p-3 bg-emerald-500 text-white rounded-md">
                          <CreditCard className="w-4 h-4" />
                          Card
                        </button>
                        <button className="flex items-center justify-center gap-2 p-3 border rounded-md">
                          <Smartphone className="w-4 h-4" />
                          Wallet
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        Payment Successful!
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Payment of $15.50 to Maria's Fresh Fruits completed
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border text-left">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Transaction ID:</span>
                        <span className="font-mono">TXN-A7B9C2D1</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Time:</span>
                        <span>{new Date().toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between mt-6">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>
                <Button
                  onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
                  disabled={currentStep === 4}
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button asChild size="lg">
              <a href="/pay/demo-vendor">Try Demo Payment</a>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
