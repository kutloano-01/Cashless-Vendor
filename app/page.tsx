import { VendorRegistration } from "@/components/vendor-registration"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { QrCode, Smartphone, TrendingUp, Shield, Phone } from "lucide-react"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">CashlessVendor</h1>
          <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
            Empowering street vendors with QR payments - no POS machine needed
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button asChild size="lg">
              <a href="/demo">See How It Works</a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="#register">Start Selling</a>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          <Card>
            <CardHeader className="text-center">
              <QrCode className="w-8 h-8 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">Simple QR Codes</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Get your unique QR code instantly. Customers scan and pay - no app required.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Smartphone className="w-8 h-8 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">Mobile Friendly</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Works on any smartphone. No expensive hardware or complex setup needed.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">Track Income</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Monitor your earnings, generate reports, and grow your business with insights.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">Secure Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Bank-grade security with instant confirmations and transaction records.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Phone className="w-8 h-8 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">USSD Access</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Check balance and transactions from any basic phone using USSD codes.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div id="register" className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">Start Accepting Payments</h2>
            <p className="text-muted-foreground">Join thousands of vendors already using CashlessVendor</p>
          </div>
          <VendorRegistration />
        </div>
      </div>
    </main>
  )
}
