"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Building2, CreditCard, Shield, Plus, Edit, Trash2, CheckCircle } from "lucide-react"

interface BankAccount {
  id: string
  bankName: string
  accountNumber: string
  accountType: "checking" | "savings"
  isDefault: boolean
  isVerified: boolean
}

export function BankAccountSettings() {
  const [isEditing, setIsEditing] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)

  // Mock bank account data
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([
    {
      id: "1",
      bankName: "Chase Bank",
      accountNumber: "****1234",
      accountType: "checking",
      isDefault: true,
      isVerified: true,
    },
    {
      id: "2",
      bankName: "Bank of America",
      accountNumber: "****5678",
      accountType: "savings",
      isDefault: false,
      isVerified: false,
    },
  ])

  const [newAccount, setNewAccount] = useState({
    bankName: "",
    accountNumber: "",
    routingNumber: "",
    accountType: "checking" as const,
  })

  const handleAddAccount = () => {
    // In a real app, this would make an API call
    const account: BankAccount = {
      id: Date.now().toString(),
      bankName: newAccount.bankName,
      accountNumber: `****${newAccount.accountNumber.slice(-4)}`,
      accountType: newAccount.accountType,
      isDefault: bankAccounts.length === 0,
      isVerified: false,
    }

    setBankAccounts([...bankAccounts, account])
    setNewAccount({ bankName: "", accountNumber: "", routingNumber: "", accountType: "checking" })
    setShowAddForm(false)
  }

  const handleSetDefault = (accountId: string) => {
    setBankAccounts((accounts) =>
      accounts.map((account) => ({
        ...account,
        isDefault: account.id === accountId,
      })),
    )
  }

  const handleDeleteAccount = (accountId: string) => {
    setBankAccounts((accounts) => accounts.filter((account) => account.id !== accountId))
  }

  return (
    <div className="space-y-6">
      {/* Bank Account Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-primary" />
                <span>Bank Accounts</span>
              </CardTitle>
              <CardDescription>Manage your payout destinations</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowAddForm(!showAddForm)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Account
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add Account Form */}
          {showAddForm && (
            <div className="border border-border rounded-lg p-4 space-y-4">
              <h4 className="font-semibold text-sm">Add New Bank Account</h4>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    id="bankName"
                    placeholder="e.g., Chase Bank"
                    value={newAccount.bankName}
                    onChange={(e) => setNewAccount({ ...newAccount, bankName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="routingNumber">Routing Number</Label>
                  <Input
                    id="routingNumber"
                    placeholder="9 digits"
                    value={newAccount.routingNumber}
                    onChange={(e) => setNewAccount({ ...newAccount, routingNumber: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    placeholder="Account number"
                    value={newAccount.accountNumber}
                    onChange={(e) => setNewAccount({ ...newAccount, accountNumber: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={handleAddAccount}
                  disabled={!newAccount.bankName || !newAccount.routingNumber || !newAccount.accountNumber}
                  size="sm"
                >
                  Add Account
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)} size="sm">
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Bank Accounts List */}
          <div className="space-y-3">
            {bankAccounts.map((account) => (
              <div key={account.id} className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">{account.bankName}</p>
                      <p className="text-xs text-muted-foreground">
                        {account.accountType} • {account.accountNumber}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {account.isVerified && (
                      <Badge className="bg-primary text-primary-foreground text-xs">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                    {account.isDefault && (
                      <Badge variant="secondary" className="text-xs">
                        Default
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {!account.isDefault && (
                    <Button variant="outline" size="sm" onClick={() => handleSetDefault(account.id)}>
                      Set as Default
                    </Button>
                  )}
                  <Button variant="ghost" size="sm">
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteAccount(account.id)}
                    disabled={account.isDefault}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {bankAccounts.length === 0 && (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No bank accounts added yet</p>
              <p className="text-sm text-muted-foreground mt-1">Add a bank account to receive withdrawals</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security & Verification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-primary" />
            <span>Security</span>
          </CardTitle>
          <CardDescription>Account verification and security settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="font-medium text-sm">Identity Verification</p>
                <p className="text-xs text-muted-foreground">Required for withdrawals</p>
              </div>
              <Badge className="bg-primary text-primary-foreground">
                <CheckCircle className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="font-medium text-sm">Phone Verification</p>
                <p className="text-xs text-muted-foreground">SMS notifications enabled</p>
              </div>
              <Badge className="bg-primary text-primary-foreground">
                <CheckCircle className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="font-medium text-sm">Two-Factor Authentication</p>
                <p className="text-xs text-muted-foreground">Extra security for withdrawals</p>
              </div>
              <Button variant="outline" size="sm">
                Enable
              </Button>
            </div>
          </div>

          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Your financial information is encrypted and secure. We never store your full account details.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}
