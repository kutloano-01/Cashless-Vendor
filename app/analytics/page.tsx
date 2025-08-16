import { AnalyticsOverview } from "@/components/analytics-overview"
import { EarningsChart } from "@/components/earnings-chart"
import { TransactionAnalytics } from "@/components/transaction-analytics"
import { PaymentMethodChart } from "@/components/payment-method-chart"
import { DashboardNav } from "@/components/dashboard-nav"

export default function AnalyticsPage() {
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
            <h1 className="text-3xl font-bold text-foreground mb-2">Analytics</h1>
            <p className="text-muted-foreground">Insights into your business performance</p>
          </div>

          <div className="space-y-6">
            <AnalyticsOverview />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <EarningsChart />
              <PaymentMethodChart />
            </div>

            <TransactionAnalytics />
          </div>
        </div>
      </div>
    </main>
  )
}
