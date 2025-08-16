import { WithdrawalInterface } from "@/components/withdrawal-interface"
import { WithdrawalHistory } from "@/components/withdrawal-history"
import { BankAccountSettings } from "@/components/bank-account-settings"
import { DashboardNav } from "@/components/dashboard-nav"

export default function WithdrawalsPage() {
  // In a real app, this would come from authentication/session
  const vendorData = {
    id: "CV-ABC12345",
    businessName: "Maria's Fresh Fruits",
    ownerName: "Maria Rodriguez",
    phone: "+1 (555) 123-4567",
    location: "Corner of Main St & 5th Ave",
    businessType: "Food & Beverages",
  }

  return (
    <main className="min-h-screen bg-background">
      <DashboardNav vendorData={vendorData} />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Withdrawals</h1>
            <p className="text-muted-foreground">Manage your earnings and withdrawal requests</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <WithdrawalInterface />
              <WithdrawalHistory />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <BankAccountSettings />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
