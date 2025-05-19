"use client"

import React from "react"
import { useState } from "react"
import { MessagingApp } from "@/components/messaging-app"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function Home() {
  const [error, setError] = useState<Error | null>(null)

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <h2 className="text-lg font-semibold text-red-700">Application Error</h2>
              <p className="mt-2 text-sm text-red-600">{error.message}</p>
              <pre className="mt-2 text-xs bg-red-100 p-2 rounded overflow-auto max-h-40">{error.stack}</pre>
              <Button className="mt-4 bg-red-600 hover:bg-red-700" onClick={() => window.location.reload()}>
                Reload Application
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen flex flex-col">
      <ErrorBoundary onError={setError}>
        <MessagingApp />
      </ErrorBoundary>
    </main>
  )
}

class ErrorBoundary extends React.Component<{
  children: React.ReactNode
  onError: (error: Error) => void
}> {
  componentDidCatch(error: Error) {
    this.props.onError(error)
  }

  render() {
    return this.props.children
  }
}
