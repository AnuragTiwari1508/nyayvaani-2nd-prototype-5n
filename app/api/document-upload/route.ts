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

    // Get form data with document file
    const formData = await request.formData()
    const documentFile = formData.get("document") as File
    const language = (formData.get("language") as string) || "en"

    if (!documentFile) {
      return NextResponse.json({ error: "No document file provided" }, { status: 400 })
    }

    // Upload document to Supabase Storage
    const fileName = `${session.user.id}/${Date.now()}_${documentFile.name}`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("legal_documents")
      .upload(fileName, documentFile, {
        contentType: documentFile.type,
        upsert: false,
      })

    if (uploadError) {
      console.error("Error uploading document:", uploadError)
      return NextResponse.json({ error: "Failed to upload document" }, { status: 500 })
    }

    // Get public URL for the uploaded file
    const {
      data: { publicUrl },
    } = supabase.storage.from("legal_documents").getPublicUrl(fileName)

    // Extract text from document (simplified for now)
    // In a real implementation, you would use a document parsing service
    const documentText = await extractTextFromDocument(documentFile)

    // Summarize document using AI SDK
    const summary = await summarizeDocument(documentText, language)

    // Store document metadata in Supabase
    const { data: documentData, error: documentError } = await supabase
      .from("documents")
      .insert({
        user_id: session.user.id,
        file_name: documentFile.name,
        file_type: documentFile.type,
        file_size: documentFile.size,
        file_url: publicUrl,
        language: language,
        summary: summary,
      })
      .select()

    if (documentError) {
      console.error("Error storing document metadata:", documentError)
    }

    return NextResponse.json({
      success: true,
      documentId: documentData?.[0]?.id,
      fileName: documentFile.name,
      fileUrl: publicUrl,
      summary: summary,
    })
  } catch (error) {
    console.error("Error processing document upload:", error)
    return NextResponse.json({ error: "Failed to process document upload" }, { status: 500 })
  }
}

// Function to extract text from document (simplified)
async function extractTextFromDocument(file: File): Promise<string> {
  // In a real implementation, you would use a document parsing service
  // For now, we'll return a mock text
  return "This is a legal document regarding a property dispute in Delhi. The complainant, Rajesh Kumar, alleges that his neighbor has been making excessive noise during night hours, disturbing the peace and quiet of the neighborhood. The complainant has attempted to resolve the issue amicably on multiple occasions but has been unsuccessful. The complainant is seeking legal intervention to address this nuisance."
}

// Function to summarize document using AI SDK
async function summarizeDocument(text: string, language: string): Promise<string> {
  try {
    const { text: summary } = await generateText({
      model: openai("gpt-4o"),
      prompt: `Summarize the following legal document in simple language. Keep the summary concise but include all important details: ${text}`,
    })

    return summary
  } catch (error) {
    console.error("Error summarizing document:", error)
    return "Failed to generate summary. Please try again later."
  }
}
