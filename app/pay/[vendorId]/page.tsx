import { PaymentInterface } from "@/components/payment-interface"

interface PaymentPageProps {
  params: {
    vendorId: string
  }
}

export default function PaymentPage({ params }: PaymentPageProps) {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <PaymentInterface vendorId={params.vendorId} />
        </div>
      </div>
    </main>
  )
}
