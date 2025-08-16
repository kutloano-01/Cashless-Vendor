"use client"

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
    
    // In production, you might want to send this to an error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Example: logErrorToService(error)
    }
  }, [error])

  const isDevelopment = process.env.NODE_ENV === 'development'

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Oops! Something went wrong</CardTitle>
          <CardDescription className="text-base">
            We encountered an unexpected error. Our team has been notified and is working on a fix.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isDevelopment && (
            <div className="bg-muted p-4 rounded-lg border">
              <div className="flex items-center space-x-2 mb-3">
                <Bug className="w-4 h-4 text-muted-foreground" />
                <h4 className="font-semibold text-sm">Development Error Details</h4>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Error Message:</p>
                  <p className="text-sm font-mono bg-background p-2 rounded border break-all">
                    {error.message}
                  </p>
                </div>
                {error.digest && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Error Digest:</p>
                    <p className="text-sm font-mono bg-background p-2 rounded border">
                      {error.digest}
                    </p>
                  </div>
                )}
                {error.stack && (
                  <details className="group">
                    <summary className="text-xs cursor-pointer text-muted-foreground hover:text-foreground">
                      Show Stack Trace
                    </summary>
                    <pre className="text-xs mt-2 p-3 bg-background rounded border overflow-auto max-h-40 group-open:block">
                      {error.stack}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          )}
          
          <div className="space-y-3">
            <Button onClick={reset} className="w-full" size="lg">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/'}
              className="w-full"
              size="lg"
            >
              <Home className="w-4 h-4 mr-2" />
              Return Home
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              If this problem persists, please{' '}
              <a 
                href="mailto:support@cashlessvendor.com" 
                className="text-primary hover:underline"
              >
                contact support
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
