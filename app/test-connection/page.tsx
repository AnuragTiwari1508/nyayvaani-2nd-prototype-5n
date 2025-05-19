"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, CheckCircle, AlertCircle, Globe } from "lucide-react"
import { createClient } from "@supabase/supabase-js"

export default function TestConnectionPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [testResult, setTestResult] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [supabaseUrl, setSupabaseUrl] = useState("")
  const [supabaseKey, setSupabaseKey] = useState("")
  const [debugInfo, setDebugInfo] = useState<any>(null)

  // Get environment variables from window
  useEffect(() => {
    if (typeof window !== "undefined") {
      // These will only be available if you expose them to the client
      setSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL || "")
      setSupabaseKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "")
    }
  }, [])

  const handleTestConnection = async () => {
    setIsLoading(true)
    setTestResult("idle")
    setErrorMessage("")
    setDebugInfo(null)

    try {
      // Create a new Supabase client directly
      const supabase = createClient(supabaseUrl, supabaseKey)

      // Test a simple query that doesn't require authentication
      const { data, error } = await supabase.from("notifications").select("count()", { count: "exact" })

      if (error) {
        throw error
      }

      setDebugInfo({
        connectionSuccess: true,
        data,
        supabaseUrl: supabaseUrl.replace(/^(https?:\/\/[^/]+).*$/, "$1"), // Only show the domain for security
        keyFirstChars: supabaseKey.substring(0, 5) + "..." + supabaseKey.substring(supabaseKey.length - 5),
      })

      setTestResult("success")
    } catch (error) {
      console.error("Error testing connection:", error)
      setTestResult("error")
      setErrorMessage(error instanceof Error ? error.message : "Unknown error occurred")
      setDebugInfo({
        connectionError: true,
        errorObject: error,
        supabaseUrl: supabaseUrl.replace(/^(https?:\/\/[^/]+).*$/, "$1"), // Only show the domain for security
        keyFirstChars: supabaseKey.substring(0, 5) + "..." + supabaseKey.substring(supabaseKey.length - 5),
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
              Supabase Connection Test
            </CardTitle>
            <CardDescription>Test basic connectivity to your Supabase instance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p>
                This test will check if your application can connect to Supabase using the environment variables you've
                configured.
              </p>
              <p className="text-sm text-muted-foreground">
                Current Supabase URL: {supabaseUrl ? supabaseUrl.replace(/^(https?:\/\/[^/]+).*$/, "$1") : "Not set"}
              </p>
              <p className="text-sm text-muted-foreground">
                Current Anon Key:{" "}
                {supabaseKey
                  ? supabaseKey.substring(0, 5) + "..." + supabaseKey.substring(supabaseKey.length - 5)
                  : "Not set"}
              </p>
            </div>

            <Button onClick={handleTestConnection} disabled={isLoading || !supabaseUrl || !supabaseKey}>
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
                <AlertDescription>Successfully connected to Supabase!</AlertDescription>
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
