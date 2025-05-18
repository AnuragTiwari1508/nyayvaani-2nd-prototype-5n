"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, ArrowLeft, Clock, CheckCircle, AlertCircle, FileText } from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface TimelineItem {
  status: string
  date: string
  details: string
}

interface ApplicationStatus {
  trackingId: string
  status: string
  statusDetails: string
  formType: string
  submittedAt: string
  timeline: TimelineItem[]
}

export default function StatusPage({ params }: { params: { id: string } }) {
  const [status, setStatus] = useState<ApplicationStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchApplicationStatus(params.id)
  }, [params.id])

  const fetchApplicationStatus = async (trackingId: string) => {
    setIsLoading(true)
    try {
      // In a real implementation, you would fetch the status from your API
      // For now, we'll simulate a response after a delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const submittedAt = new Date()
      submittedAt.setHours(submittedAt.getHours() - 36) // 36 hours ago

      const mockStatus: ApplicationStatus = {
        trackingId: trackingId,
        status: "Under Review",
        statusDetails: "Your application is under review by the concerned authority.",
        formType: "noise_complaint",
        submittedAt: submittedAt.toISOString(),
        timeline: [
          {
            status: "Submitted",
            date: submittedAt.toISOString(),
            details: "Your application has been submitted successfully.",
          },
          {
            status: "Received",
            date: new Date(submittedAt.getTime() + 24 * 60 * 60 * 1000).toISOString(),
            details: "Your application has been received and is awaiting processing.",
          },
          {
            status: "Under Review",
            date: new Date(submittedAt.getTime() + 36 * 60 * 60 * 1000).toISOString(),
            details: "Your application is under review by the concerned authority.",
          },
        ],
      }

      setStatus(mockStatus)
    } catch (error) {
      console.error("Error fetching application status:", error)
      toast({
        variant: "destructive",
        title: "Failed to load status",
        description: "There was an error loading the application status. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Submitted":
        return "bg-blue-500"
      case "Received":
        return "bg-yellow-500"
      case "Under Review":
        return "bg-purple-500"
      case "Approved":
        return "bg-green-500"
      case "Rejected":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getFormTypeName = (formType: string) => {
    switch (formType) {
      case "noise_complaint":
        return "Noise Complaint"
      case "property_dispute":
        return "Property Dispute"
      case "consumer_complaint":
        return "Consumer Complaint"
      case "rti":
        return "RTI Application"
      default:
        return "Legal Application"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Submitted":
        return <FileText className="h-5 w-5" />
      case "Received":
        return <Clock className="h-5 w-5" />
      case "Under Review":
        return <AlertCircle className="h-5 w-5" />
      case "Approved":
        return <CheckCircle className="h-5 w-5" />
      default:
        return <Clock className="h-5 w-5" />
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center gap-2 mb-6">
            <Button variant="outline" size="icon" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">Application Status</h1>
          </div>
        </motion.div>

        {isLoading ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p>Loading application status...</p>
            </CardContent>
          </Card>
        ) : status ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Tracking ID: {status.trackingId}</CardTitle>
                    <CardDescription>
                      {getFormTypeName(status.formType)} submitted on{" "}
                      {new Date(status.submittedAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(status.status) + " text-white"}>{status.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted p-4 rounded-lg">
                  <p className="font-medium mb-1">Current Status:</p>
                  <p>{status.statusDetails}</p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Application Timeline</h3>
                  <div className="space-y-4">
                    {status.timeline.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 * index }}
                        className="flex gap-4"
                      >
                        <div className="flex flex-col items-center">
                          <div className={`rounded-full p-2 ${getStatusColor(item.status)} text-white`}>
                            {getStatusIcon(item.status)}
                          </div>
                          {index < status.timeline.length - 1 && (
                            <div className="w-0.5 h-full bg-muted-foreground/30 my-1"></div>
                          )}
                        </div>
                        <div className="pb-4">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{item.status}</h4>
                            <span className="text-xs text-muted-foreground">
                              {new Date(item.date).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{item.details}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Next Steps</h3>
                  <p className="mb-2">Your application is currently being processed. Here's what to expect next:</p>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>The concerned authority will review your application (2-3 business days)</li>
                    <li>You may be contacted for additional information if needed</li>
                    <li>Once reviewed, a decision will be made on your application</li>
                    <li>You will be notified of the decision via SMS and email</li>
                  </ol>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link href="/">Return to Home</Link>
                </Button>
                <Button asChild>
                  <Link href="/chat">Get Help</Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-xl font-bold mb-2">Application Not Found</h2>
              <p className="text-muted-foreground mb-4">
                We couldn't find an application with the tracking ID: {params.id}
              </p>
              <Button asChild>
                <Link href="/">Return to Home</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
