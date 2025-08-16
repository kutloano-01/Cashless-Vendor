import { DashboardOverview } from "@/components/dashboard-overview"
import { QRGenerator } from "@/components/qr-generator"
import { RecentTransactions } from "@/components/recent-transactions"
import { DashboardNav } from "@/components/dashboard-nav"

export default function DashboardPage() {
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
            <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {vendorData.ownerName}!</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <DashboardOverview />
              <RecentTransactions />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <QRGenerator vendorId={vendorData.id} businessName={vendorData.businessName} />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
