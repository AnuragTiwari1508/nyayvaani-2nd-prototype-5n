import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: Request) {
  try {
    // Authenticate user
    const supabase = createRouteHandlerClient({ cookies })
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get request body
    const { text, formType } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 })
    }

    // Get form fields based on form type
    const formFields = getFormFields(formType)

    // Extract form data from text using AI
    const formData = await extractFormData(text, formFields, formType)

    // Store form data in Supabase
    const { data: savedFormData, error } = await supabase
      .from("forms")
      .insert({
        user_id: session.user.id,
        form_type: formType,
        form_data: formData,
        original_text: text,
        status: "draft",
      })
      .select()

    if (error) {
      console.error("Error storing form data:", error)
    }

    return NextResponse.json({
      success: true,
      formId: savedFormData?.[0]?.id,
      formData: formData,
    })
  } catch (error) {
    console.error("Error auto-filling form:", error)
    return NextResponse.json({ error: "Failed to auto-fill form" }, { status: 500 })
  }
}

// Function to get form fields based on form type
function getFormFields(formType: string): string[] {
  const formFields: Record<string, string[]> = {
    noise_complaint: [
      "complainant_name",
      "complainant_address",
      "respondent_name",
      "respondent_address",
      "incident_date",
      "incident_time",
      "description",
      "relief_sought",
    ],
    property_dispute: [
      "complainant_name",
      "complainant_address",
      "property_address",
      "dispute_type",
      "respondent_name",
      "respondent_address",
      "description",
      "relief_sought",
    ],
    consumer_complaint: [
      "complainant_name",
      "complainant_address",
      "company_name",
      "company_address",
      "product_service",
      "purchase_date",
      "complaint_details",
      "relief_sought",
    ],
    rti: [
      "applicant_name",
      "applicant_address",
      "public_authority",
      "information_requested",
      "period_of_information",
      "application_fee_details",
    ],
  }

  return formFields[formType] || []
}

// Function to extract form data from text using AI
async function extractFormData(text: string, fields: string[], formType: string): Promise<Record<string, string>> {
  try {
    const prompt = `
      Extract the following information from the text below into a JSON object with these keys: ${fields.join(", ")}.
      If any information is missing, leave the value as an empty string.
      
      Form type: ${formType}
      
      Text:
      ${text}
      
      Return ONLY a valid JSON object with the extracted information.
    `

    const { text: jsonString } = await generateText({
      model: openai("gpt-4o"),
      prompt: prompt,
    })

    try {
      // Clean the JSON string (remove any non-JSON content)
      const cleanedJsonString = jsonString.replace(/```json|```/g, "").trim()
      const extractedData = JSON.parse(cleanedJsonString)
      return extractedData
    } catch (parseError) {
      console.error("Error parsing JSON from AI response:", parseError)
      // Fallback to empty values if parsing fails
      return fields.reduce((acc, field) => ({ ...acc, [field]: "" }), {})
    }
  } catch (error) {
    console.error("Error extracting form data:", error)
    // Fallback to empty values if AI fails
    return fields.reduce((acc, field) => ({ ...acc, [field]: "" }), {})
  }
}
