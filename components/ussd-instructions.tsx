import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, Smartphone, Shield, Clock } from "lucide-react"

export function USSDInstructions() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            USSD Quick Start
          </CardTitle>
          <CardDescription>Access your vendor account from any mobile phone</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-primary/10 p-4 rounded-lg">
              <h4 className="font-semibold text-lg mb-2">Dial: *123*456#</h4>
              <p className="text-sm text-muted-foreground">Works on any mobile phone - no internet required</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold">Available Options:</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Check wallet balance</li>
                  <li>• View recent transactions</li>
                  <li>• Get help and support</li>
                  <li>• Account information</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Benefits:</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Smartphone className="h-4 w-4 text-primary" />
                    Works on basic phones
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-primary" />
                    Available 24/7
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="h-4 w-4 text-primary" />
                    Secure and encrypted
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
