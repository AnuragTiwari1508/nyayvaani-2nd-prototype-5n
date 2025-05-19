"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, CheckCircle, AlertCircle, Database } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { createClientSupabaseClient } from "@/lib/supabase"

export default function TestDbPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [testResult, setTestResult] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [testName, setTestName] = useState("")
  const [testData, setTestData] = useState<any>(null)
  const { toast } = useToast()
  const supabase = createClientSupabaseClient()

  const handleTestInsert = async () => {
    if (!testName) {
      toast({
        variant: "destructive",
        title: "Name required",
        description: "Please enter a test name",
      })
      return
    }

    setIsLoading(true)
    setTestResult("idle")
    setErrorMessage("")
    setTestData(null)

    try {
      // Create a test notification
      const { data, error } = await supabase
        .from("notifications")
        .insert({
          user_id: "00000000-0000-0000-0000-000000000000", // Using a placeholder UUID
          type: "test",
          title: `Test Notification: ${testName}`,
          message: `This is a test notification created at ${new Date().toISOString()}`,
          read: false,
        })
        .select()

      if (error) {
        throw error
      }

      setTestData(data)
      setTestResult("success")
      toast({
        title: "Test successful",
        description: "Successfully inserted test data into the database",
      })
    } catch (error) {
      console.error("Error testing database:", error)
      setTestResult("error")
      setErrorMessage(error instanceof Error ? error.message : "Unknown error occurred")
      toast({
        variant: "destructive",
        title: "Test failed",
        description: error instanceof Error ? error.message : "Failed to insert test data",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleTestQuery = async () => {
    setIsLoading(true)
    setTestResult("idle")
    setErrorMessage("")
    setTestData(null)

    try {
      // Query notifications
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5)

      if (error) {
        throw error
      }

      setTestData(data)
      setTestResult("success")
      toast({
        title: "Query successful",
        description: `Retrieved ${data.length} records from the database`,
      })
    } catch (error) {
      console.error("Error querying database:", error)
      setTestResult("error")
      setErrorMessage(error instanceof Error ? error.message : "Unknown error occurred")
      toast({
        variant: "destructive",
        title: "Query failed",
        description: error instanceof Error ? error.message : "Failed to query data",
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
              <Database className="h-5 w-5" />
              Database Test
            </CardTitle>
            <CardDescription>Test database connectivity and operations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="testName">Test Name</Label>
              <Input
                id="testName"
                placeholder="Enter a name for this test"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={handleTestInsert} disabled={isLoading} className="flex-1">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Testing Insert...
                  </>
                ) : (
                  "Test Insert"
                )}
              </Button>
              <Button onClick={handleTestQuery} disabled={isLoading} variant="outline" className="flex-1">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Testing Query...
                  </>
                ) : (
                  "Test Query"
                )}
              </Button>
            </div>

            {testResult === "success" && (
              <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>Database operation completed successfully.</AlertDescription>
              </Alert>
            )}

            {testResult === "error" && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{errorMessage || "Failed to perform database operation."}</AlertDescription>
              </Alert>
            )}

            {testData && (
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">Result Data:</h3>
                <pre className="bg-muted p-4 rounded-md overflow-auto max-h-60 text-xs">
                  {JSON.stringify(testData, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
