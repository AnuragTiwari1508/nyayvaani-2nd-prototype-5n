"use client"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FormData {
  complaintType: string
  issue: string
  location: string
  date: string
  details: string
}

interface LegalFormProps {
  formData: FormData
  setFormData: (data: FormData) => void
}

export default function LegalForm({ formData, setFormData }: LegalFormProps) {
  const handleChange = (field: keyof FormData, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="complaintType">Complaint Type</Label>
        <Select value={formData.complaintType} onValueChange={(value) => handleChange("complaintType", value)}>
          <SelectTrigger id="complaintType">
            <SelectValue placeholder="Select Complaint Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Noise Complaint">Noise Complaint</SelectItem>
            <SelectItem value="Property Dispute">Property Dispute</SelectItem>
            <SelectItem value="Consumer Complaint">Consumer Complaint</SelectItem>
            <SelectItem value="Employment Issue">Employment Issue</SelectItem>
            <SelectItem value="Domestic Violence">Domestic Violence</SelectItem>
            <SelectItem value="Tenant Issue">Tenant Issue</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="issue">Issue Category</Label>
        <Select value={formData.issue} onValueChange={(value) => handleChange("issue", value)}>
          <SelectTrigger id="issue">
            <SelectValue placeholder="Select Issue Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Neighbor Dispute">Neighbor Dispute</SelectItem>
            <SelectItem value="Family Matter">Family Matter</SelectItem>
            <SelectItem value="Commercial Dispute">Commercial Dispute</SelectItem>
            <SelectItem value="Civil Rights">Civil Rights</SelectItem>
            <SelectItem value="Criminal Matter">Criminal Matter</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => handleChange("location", e.target.value)}
          placeholder="City, State"
        />
      </div>

      <div>
        <Label htmlFor="date">Date of Incident</Label>
        <Input id="date" type="date" value={formData.date} onChange={(e) => handleChange("date", e.target.value)} />
      </div>

      <div>
        <Label htmlFor="details">Additional Details</Label>
        <Textarea
          id="details"
          value={formData.details}
          onChange={(e) => handleChange("details", e.target.value)}
          placeholder="Provide any additional details about your case"
          className="h-24"
        />
      </div>
    </div>
  )
}
