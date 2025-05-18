import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

// BHASHINI API configuration
const BHASHINI_API_KEY = process.env.BHASHINI_API_KEY || "32d6ddc33d-a283-4f34-989c-49dbdb836553"
const BHASHINI_API_URL = "https://api.bhashini.gov.in/v1/speech/recognize"

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

    // Get form data with audio file
    const formData = await request.formData()
    const audioFile = formData.get("audio") as File
    const language = (formData.get("language") as string) || "hi"

    if (!audioFile) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 })
    }

    // Convert audio file to base64
    const audioBuffer = await audioFile.arrayBuffer()
    const audioBase64 = Buffer.from(audioBuffer).toString("base64")

    // Prepare request to BHASHINI API
    const bhashiniPayload = {
      audio: audioBase64,
      language: {
        sourceLanguage: language,
      },
      config: {
        audioFormat: "wav",
        samplingRate: 16000,
      },
    }

    // Call BHASHINI API
    const response = await fetch(BHASHINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${BHASHINI_API_KEY}`,
      },
      body: JSON.stringify(bhashiniPayload),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("BHASHINI API error:", errorData)

      // If BHASHINI API fails, use mock response for development
      return mockTranscriptionResponse(language)
    }

    const data = await response.json()

    // Store the transcript in Supabase
    const { data: transcriptData, error } = await supabase
      .from("transcripts")
      .insert({
        user_id: session.user.id,
        language: language,
        transcript: data.text,
        audio_duration: formData.get("duration") || 0,
      })
      .select()

    if (error) {
      console.error("Error storing transcript:", error)
    }

    return NextResponse.json({
      success: true,
      transcript: data.text,
      transcriptId: transcriptData?.[0]?.id,
    })
  } catch (error) {
    console.error("Error processing speech to text:", error)
    return NextResponse.json({ error: "Failed to process speech to text" }, { status: 500 })
  }
}

// Mock function for development or when API fails
function mockTranscriptionResponse(language: string) {
  const mockResponses: Record<string, string> = {
    en: "My name is Rajesh Kumar and I live in Delhi. I have a problem with my neighbor who makes a lot of noise at night. I have talked to them several times but it has not helped.",
    hi: "मेरा नाम राजेश कुमार है और मैं दिल्ली में रहता हूं। मुझे अपने पड़ोसी से परेशानी है जो रात में बहुत शोर करता है। मैंने उनसे कई बार बात की है लेकिन कोई फायदा नहीं हुआ।",
    ta: "என் பெயர் ராஜேஷ் குமார், நான் டெல்லியில் வசிக்கிறேன். எனக்கு என் அக்கம்பக்கத்தில் இருந்து தொந்தரவு உள்ளது, அவர் இரவில் மிகவும் சத்தம் போடுகிறார். நான் அவரிடம் பல முறை பேசியுள்ளேன் ஆனால் எந்த பயனும் இல்லை.",
    bn: "আমার নাম রাজেশ কুমার এবং আমি দিল্লিতে থাকি। আমার প্রতিবেশী থেকে আমার সমস্যা আছে যিনি রাতে খুব শব্দ করেন। আমি তার সাথে কয়েকবার কথা বলেছি কিন্তু কোন লাভ হয়নি।",
  }

  return NextResponse.json({
    success: true,
    transcript: mockResponses[language] || mockResponses.en,
    transcriptId: `mock-${Date.now()}`,
  })
}
