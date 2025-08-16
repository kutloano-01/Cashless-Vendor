import { Card, CardContent } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

export default function LoadingPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Loading...</h3>
              <p className="text-muted-foreground">
                Please wait while we prepare your content.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
