"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Check, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function SubmitPage() {
  const [formType, setFormType] = useState("noise_complaint")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [trackingId, setTrackingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    complainant_name: "",
    complainant_address: "",
    respondent_name: "",
    respondent_address: "",
    incident_date: "",
    incident_time: "",
    description: "",
    relief_sought: "",
  })
  const { toast } = useToast()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async () => {
    // Validate form
    const requiredFields = ["complainant_name", "complainant_address", "respondent_name", "description"]

    const missingFields = requiredFields.filter((field) => !formData[field as keyof typeof formData])

    if (missingFields.length > 0) {
      toast({
        variant: "destructive",
        title: "Missing required fields",
        description: "Please fill in all required fields before submitting.",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // In a real implementation, you would submit the form to your API
      // For now, we'll simulate a response after a delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const mockTrackingId = `NV-${Date.now()}-${Math.floor(Math.random() * 1000)}`
      setTrackingId(mockTrackingId)

      toast({
        title: "Form submitted successfully",
        description: `Your form has been submitted. Tracking ID: ${mockTrackingId}`,
      })
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: "There was an error submitting your form. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-bold mb-6">Legal Form Submission</h1>
          <p className="text-muted-foreground mb-8">
            Fill out and submit legal forms for various issues. Once submitted, you'll receive a tracking ID to monitor
            the status of your application.
          </p>
        </motion.div>

        {trackingId ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Check className="h-6 w-6 text-green-500" />
                  Form Submitted Successfully
                </CardTitle>
                <CardDescription>Your form has been submitted and is being processed.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <p className="font-medium">Tracking ID:</p>
                  <p className="text-xl font-bold">{trackingId}</p>
                </div>
                <p>
                  You can use this tracking ID to check the status of your application. We'll also send updates to your
                  registered mobile number and email address.
                </p>
              </CardContent>
              <CardFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                <Button variant="outline" asChild>
                  <Link href="/">Return to Home</Link>
                </Button>
                <Button asChild>
                  <Link href={`/status/${trackingId}`}>
                    Track Application
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ) : (
          <Tabs defaultValue={formType} onValueChange={setFormType}>
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="noise_complaint">Noise Complaint</TabsTrigger>
              <TabsTrigger value="property_dispute">Property Dispute</TabsTrigger>
              <TabsTrigger value="consumer_complaint">Consumer Complaint</TabsTrigger>
              <TabsTrigger value="rti">RTI Application</TabsTrigger>
            </TabsList>

            <TabsContent value="noise_complaint">
              <Card>
                <CardHeader>
                  <CardTitle>Noise Complaint Form</CardTitle>
                  <CardDescription>File a complaint against noise pollution or disturbance.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="complainant_name">
                        Your Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="complainant_name"
                        value={formData.complainant_name}
                        onChange={(e) => handleInputChange("complainant_name", e.target.value)}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="complainant_address">
                        Your Address <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="complainant_address"
                        value={formData.complainant_address}
                        onChange={(e) => handleInputChange("complainant_address", e.target.value)}
                        placeholder="Enter your complete address"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="respondent_name">
                        Respondent Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="respondent_name"
                        value={formData.respondent_name}
                        onChange={(e) => handleInputChange("respondent_name", e.target.value)}
                        placeholder="Enter the name of the person/entity causing noise"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="respondent_address">Respondent Address</Label>
                      <Input
                        id="respondent_address"
                        value={formData.respondent_address}
                        onChange={(e) => handleInputChange("respondent_address", e.target.value)}
                        placeholder="Enter the address of the person/entity"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="incident_date">Date of Incident</Label>
                      <Input
                        id="incident_date"
                        type="date"
                        value={formData.incident_date}
                        onChange={(e) => handleInputChange("incident_date", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="incident_time">Time of Incident</Label>
                      <Input
                        id="incident_time"
                        type="time"
                        value={formData.incident_time}
                        onChange={(e) => handleInputChange("incident_time", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">
                      Description of Complaint <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Describe the noise issue in detail, including frequency, duration, and impact"
                      rows={5}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="relief_sought">Relief Sought</Label>
                    <Textarea
                      id="relief_sought"
                      value={formData.relief_sought}
                      onChange={(e) => handleInputChange("relief_sought", e.target.value)}
                      placeholder="Describe what action you want taken"
                      rows={3}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" asChild>
                    <Link href="/">Cancel</Link>
                  </Button>
                  <Button onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Form"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="property_dispute">
              <Card>
                <CardHeader>
                  <CardTitle>Property Dispute Form</CardTitle>
                  <CardDescription>File a complaint regarding property disputes or encroachment.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <p className="text-muted-foreground mb-4">
                      Property dispute form is available. Please select the form type above to view and fill it.
                    </p>
                    <p className="text-xs text-muted-foreground">
                      This form follows a similar structure to the Noise Complaint form.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="consumer_complaint">
              <Card>
                <CardHeader>
                  <CardTitle>Consumer Complaint Form</CardTitle>
                  <CardDescription>File a complaint against a product or service provider.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <p className="text-muted-foreground mb-4">
                      Consumer complaint form is available. Please select the form type above to view and fill it.
                    </p>
                    <p className="text-xs text-muted-foreground">
                      This form follows a similar structure to the Noise Complaint form.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rti">
              <Card>
                <CardHeader>
                  <CardTitle>RTI Application Form</CardTitle>
                  <CardDescription>File a Right to Information (RTI) application.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <p className="text-muted-foreground mb-4">
                      RTI application form is available. Please select the form type above to view and fill it.
                    </p>
                    <p className="text-xs text-muted-foreground">
                      This form follows a similar structure to the Noise Complaint form.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}
