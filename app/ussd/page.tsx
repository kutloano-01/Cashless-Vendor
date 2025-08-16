"use client";

import { useState } from "react";
import { ArrowLeft, Phone, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

export default function USSDPage() {
  const [currentMenu, setCurrentMenu] = useState("main");
  const [inputValue, setInputValue] = useState("");
  const [vendorId, setVendorId] = useState("");

  const mockTransactions = [
    { id: "1", amount: 25.5, customer: "***1234", time: "2:30 PM" },
    { id: "2", amount: 15.0, customer: "***5678", time: "1:45 PM" },
    { id: "3", amount: 8.75, customer: "***9012", time: "12:20 PM" },
  ];

  const handleMenuSelection = (option: string) => {
    switch (currentMenu) {
      case "main":
        if (option === "1") setCurrentMenu("balance");
        else if (option === "2") setCurrentMenu("transactions");
        else if (option === "3") setCurrentMenu("help");
        break;
      case "balance":
      case "transactions":
      case "help":
        setCurrentMenu("main");
        break;
    }
    setInputValue("");
  };

  const renderMenu = () => {
    switch (currentMenu) {
      case "main":
        return (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <h3 className="font-semibold">CashlessVendor USSD</h3>
              <p className="text-sm text-muted-foreground">Select an option:</p>
            </div>
            <div className="space-y-2 text-sm">
              <div>1. Check Wallet Balance</div>
              <div>2. View Recent Transactions</div>
              <div>3. Help & Support</div>
              <div>0. Exit</div>
            </div>
            <div className="pt-4">
              <Input
                placeholder="Enter option (1-3)"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="text-center"
                maxLength={1}
              />
              <Button
                onClick={() => handleMenuSelection(inputValue)}
                className="w-full mt-2"
                disabled={!inputValue}
              >
                Send
              </Button>
            </div>
          </div>
        );

      case "balance":
        return (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <h3 className="font-semibold">Wallet Balance</h3>
              <div className="text-2xl font-bold text-primary">
                {formatCurrency(247.85)}
              </div>
              <p className="text-sm text-muted-foreground">Available Balance</p>
            </div>
            <div className="space-y-2 text-sm">
              <div>Pending: {formatCurrency(12.5)}</div>
              <div>Last Updated: Just now</div>
            </div>
            <Button onClick={() => setCurrentMenu("main")} className="w-full">
              Back to Main Menu
            </Button>
          </div>
        );

      case "transactions":
        return (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <h3 className="font-semibold">Recent Transactions</h3>
              <p className="text-sm text-muted-foreground">Last 3 payments</p>
            </div>
            <div className="space-y-3 text-sm">
              {mockTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex justify-between items-center py-2 border-b"
                >
                  <div>
                    <div className="font-medium">
                      {formatCurrency(tx.amount)}
                    </div>
                    <div className="text-muted-foreground">{tx.customer}</div>
                  </div>
                  <div className="text-muted-foreground">{tx.time}</div>
                </div>
              ))}
            </div>
            <Button onClick={() => setCurrentMenu("main")} className="w-full">
              Back to Main Menu
            </Button>
          </div>
        );

      case "help":
        return (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <h3 className="font-semibold">Help & Support</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <strong>USSD Code:</strong> *123*456#
              </div>
              <div>
                <strong>Support:</strong> Call 1-800-VENDOR
              </div>
              <div>
                <strong>Hours:</strong> 24/7 Support
              </div>
              <div>
                <strong>SMS:</strong> Text HELP to 12345
              </div>
            </div>
            <Button onClick={() => setCurrentMenu("main")} className="w-full">
              Back to Main Menu
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">USSD Access</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Basic Phone Access
            </CardTitle>
            <CardDescription>
              Access your vendor account from any mobile phone using USSD codes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">How to Use USSD:</h4>
                <ol className="text-sm space-y-1 list-decimal list-inside">
                  <li>Dial *123*456# from your phone</li>
                  <li>Enter your vendor ID when prompted</li>
                  <li>Follow the menu options</li>
                  <li>No internet connection required</li>
                </ol>
              </div>

              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Try the USSD interface below:
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">USSD Simulator</CardTitle>
            <CardDescription className="text-center">
              Experience how basic phone users interact with the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm min-h-[300px]">
              {renderMenu()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>USSD Benefits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-semibold">Works on Any Phone</h4>
                  <p className="text-sm text-muted-foreground">
                    No smartphone or internet required
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Smartphone className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-semibold">Instant Access</h4>
                  <p className="text-sm text-muted-foreground">
                    Check balance and transactions immediately
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
