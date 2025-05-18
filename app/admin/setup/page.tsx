"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, CheckCircle, AlertCircle, Database } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function SetupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [setupStatus, setSetupStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const { toast } = useToast()

  const handleSetupDatabase = async () => {
    setIsLoading(true)
    setSetupStatus("idle")
    setErrorMessage("")

    try {
      const response = await fetch("/api/setup-database", {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to set up database")
      }

      setSetupStatus("success")
      toast({
        title: "Database setup successful",
        description: "Your database has been set up successfully",
      })
    } catch (error) {
      console.error("Error setting up database:", error)
      setSetupStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Unknown error occurred")
      toast({
        variant: "destructive",
        title: "Database setup failed",
        description: error instanceof Error ? error.message : "Failed to set up database",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database Setup
            </CardTitle>
            <CardDescription>Set up your Supabase database structure for the NyayVaani application</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              This will create all the necessary tables, security policies, and storage buckets for your NyayVaani
              application. This should only be run once when setting up your application.
            </p>

            {setupStatus === "success" && (
              <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>
                  Your database has been set up successfully. You can now start using the application.
                </AlertDescription>
              </Alert>
            )}

            {setupStatus === "error" && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{errorMessage || "Failed to set up database. Please try again."}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/">Return to Home</Link>
            </Button>
            <Button onClick={handleSetupDatabase} disabled={isLoading || setupStatus === "success"}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting Up...
                </>
              ) : setupStatus === "success" ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Setup Complete
                </>
              ) : (
                "Set Up Database"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
