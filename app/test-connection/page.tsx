"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, CheckCircle, AlertCircle, Globe } from "lucide-react"

export default function TestConnectionPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [testResult, setTestResult] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [debugInfo, setDebugInfo] = useState<any>(null)

  const handleTestConnection = async () => {
    setIsLoading(true)
    setTestResult("idle")
    setErrorMessage("")
    setDebugInfo(null)

    try {
      // Use the server-side proxy instead of direct Supabase connection
      const response = await fetch("/api/supabase-proxy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "testConnection",
          params: {},
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Server returned an error")
      }

      const data = await response.json()

      setDebugInfo({
        connectionSuccess: true,
        data,
        responseStatus: response.status,
      })

      setTestResult("success")
    } catch (error) {
      console.error("Error testing connection:", error)
      setTestResult("error")
      setErrorMessage(error instanceof Error ? error.message : "Unknown error occurred")
      setDebugInfo({
        connectionError: true,
        errorObject: error,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Supabase Connection Test (Server-Side)
            </CardTitle>
            <CardDescription>Test connectivity to Supabase via server-side API route</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p>
                This test will check if your server can connect to Supabase using a server-side API route. This bypasses
                CORS restrictions that might affect client-side connections.
              </p>
            </div>

            <Button onClick={handleTestConnection} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing Connection...
                </>
              ) : (
                "Test Connection"
              )}
            </Button>

            {testResult === "success" && (
              <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>Successfully connected to Supabase via server-side API!</AlertDescription>
              </Alert>
            )}

            {testResult === "error" && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Connection Error</AlertTitle>
                <AlertDescription>{errorMessage || "Failed to connect to Supabase."}</AlertDescription>
              </Alert>
            )}

            {debugInfo && (
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">Debug Information:</h3>
                <pre className="bg-muted p-4 rounded-md overflow-auto max-h-60 text-xs">
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
