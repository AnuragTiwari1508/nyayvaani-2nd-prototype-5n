import { NextResponse } from "next/server"

// Mock function to simulate transcription service
async function mockTranscription(audioBlob: Blob, language: string): Promise<string> {
  // In a real app, we would send the audio to BHASHINI API or Azure Speech-to-Text
  // For now, we'll return mock responses based on the language

  await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate processing time

  const mockResponses: Record<string, string> = {
    en: "My name is Rajesh Kumar and I live in Delhi. I have a problem with my neighbor who makes a lot of noise at night. I have talked to them several times but it has not helped.",
    hi: "मेरा नाम राजेश कुमार है और मैं दिल्ली में रहता हूं। मुझे अपने पड़ोसी से परेशानी है जो रात में बहुत शोर करता है। मैंने उनसे कई बार बात की है लेकिन कोई फायदा नहीं हुआ।",
    ta: "என் பெயர் ராஜேஷ் குமார், நான் டெல்லியில் வசிக்கிறேன். எனக்கு என் அக்கம்பக்கத்தில் இருந்து தொந்தரவு உள்ளது, அவர் இரவில் மிகவும் சத்தம் போடுகிறார். நான் அவரிடம் பல முறை பேசியுள்ளேன் ஆனால் எந்த பயனும் இல்லை.",
    bn: "আমার নাম রাজেশ কুমার এবং আমি দিল্লিতে থাকি। আমার প্রতিবেশী থেকে আমার সমস্যা আছে যিনি রাতে খুব শব্দ করেন। আমি তার সাথে কয়েকবার কথা বলেছি কিন্তু কোন লাভ হয়নি।",
  }

  return mockResponses[language] || mockResponses.en
}

// Extract form data from transcript
function extractFormData(transcript: string) {
  // In a real app, we would use NLP to extract relevant information
  // For now, we'll return mock data

  return {
    complaintType: "Noise Complaint",
    issue: "Neighbor Dispute",
    location: "Delhi",
    date: new Date().toISOString().split("T")[0],
    details: transcript,
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get("audio") as Blob
    const language = (formData.get("language") as string) || "en"

    if (!audioFile) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 })
    }

    // Process the audio file
    const transcript = await mockTranscription(audioFile, language)

    // Extract form data from transcript
    const extractedData = extractFormData(transcript)

    return NextResponse.json({
      success: true,
      transcript,
      formData: extractedData,
    })
  } catch (error) {
    console.error("Error processing audio:", error)
    return NextResponse.json({ error: "Failed to process audio" }, { status: 500 })
  }
}
