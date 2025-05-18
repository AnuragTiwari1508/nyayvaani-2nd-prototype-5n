"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mic, MicOff, Play, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { useMobile } from "@/hooks/use-mobile"
import LegalForm from "@/components/legal-form"

export default function VoicePage() {
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [transcript, setTranscript] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [formData, setFormData] = useState({
    complaintType: "",
    issue: "",
    location: "",
    date: "",
    details: "",
  })

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const { toast } = useToast()
  const isMobile = useMobile()

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
        setAudioBlob(audioBlob)

        // Stop all tracks of the stream
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)

      toast({
        title: "Recording started",
        description: "Speak clearly to record your legal issue",
      })
    } catch (error) {
      console.error("Error accessing microphone:", error)
      toast({
        variant: "destructive",
        title: "Microphone access denied",
        description: "Please allow microphone access to use this feature",
      })
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      toast({
        title: "Recording stopped",
        description: "Your audio has been captured",
      })
    }
  }

  const processAudio = async () => {
    if (!audioBlob) return

    setIsProcessing(true)

    try {
      // In a real app, we would send the audio to the BHASHINI API or Azure Speech-to-Text
      // For now, we'll simulate a response after a delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock transcription based on selected language
      let mockTranscript = ""

      switch (selectedLanguage) {
        case "hi":
          mockTranscript =
            "मेरा नाम राजेश कुमार है और मैं दिल्ली में रहता हूं। मुझे अपने पड़ोसी से परेशानी है जो रात में बहुत शोर करता है। मैंने उनसे कई बार बात की है लेकिन कोई फायदा नहीं हुआ।"
          break
        case "ta":
          mockTranscript =
            "என் பெயர் ராஜேஷ் குமார், நான் டெல்லியில் வசிக்கிறேன். எனக்கு என் அக்கம்பக்கத்தில் இருந்து தொந்தரவு உள்ளது, அவர் இரவில் மிகவும் சத்தம் போடுகிறார். நான் அவரிடம் பல முறை பேசியுள்ளேன் ஆனால் எந்த பயனும் இல்லை."
          break
        case "bn":
          mockTranscript =
            "আমার নাম রাজেশ কুমার এবং আমি দিল্লিতে থাকি। আমার প্রতিবেশী থেকে আমার সমস্যা আছে যিনি রাতে খুব শব্দ করেন। আমি তার সাথে কয়েকবার কথা বলেছি কিন্তু কোন লাভ হয়নি।"
          break
        default:
          mockTranscript =
            "My name is Rajesh Kumar and I live in Delhi. I have a problem with my neighbor who makes a lot of noise at night. I have talked to them several times but it has not helped."
      }

      setTranscript(mockTranscript)

      // Extract information from transcript to auto-fill the form
      const extractedData = {
        complaintType: "Noise Complaint",
        issue: "Neighbor Dispute",
        location: "Delhi",
        date: new Date().toISOString().split("T")[0],
        details: mockTranscript,
      }

      setFormData(extractedData)

      toast({
        title: "Audio processed successfully",
        description: "Your speech has been transcribed and form has been filled",
      })
    } catch (error) {
      console.error("Error processing audio:", error)
      toast({
        variant: "destructive",
        title: "Processing failed",
        description: "There was an error processing your audio",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Cleanup function for media recorder
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop()
      }
    }
  }, [isRecording])

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-bold mb-6">Voice-Based Legal Filing</h1>
          <p className="text-muted-foreground mb-8">
            Speak in your preferred language to describe your legal issue. Our AI will transcribe your speech and help
            you fill out the appropriate legal forms.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Record Your Statement</CardTitle>
                <CardDescription>
                  Speak clearly about your legal issue. We support multiple Indian languages.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="mb-4">
                  <Label htmlFor="language">Select Language</Label>
                  <Select
                    value={selectedLanguage}
                    onValueChange={setSelectedLanguage}
                    disabled={isRecording || isProcessing}
                  >
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">Hindi</SelectItem>
                      <SelectItem value="ta">Tamil</SelectItem>
                      <SelectItem value="bn">Bengali</SelectItem>
                      <SelectItem value="te">Telugu</SelectItem>
                      <SelectItem value="mr">Marathi</SelectItem>
                      <SelectItem value="gu">Gujarati</SelectItem>
                      <SelectItem value="kn">Kannada</SelectItem>
                      <SelectItem value="ml">Malayalam</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col items-center justify-center py-8">
                  {isRecording ? (
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                      className="relative mb-4"
                    >
                      <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
                      <Button
                        size="lg"
                        variant="destructive"
                        className="rounded-full h-20 w-20"
                        onClick={stopRecording}
                      >
                        <MicOff className="h-8 w-8" />
                      </Button>
                    </motion.div>
                  ) : (
                    <Button
                      size="lg"
                      variant="default"
                      className="rounded-full h-20 w-20 mb-4"
                      onClick={startRecording}
                      disabled={isProcessing}
                    >
                      <Mic className="h-8 w-8" />
                    </Button>
                  )}
                  <p className="text-sm text-muted-foreground">
                    {isRecording ? "Recording... Click to stop" : "Click to start recording"}
                  </p>
                </div>

                {audioBlob && !isRecording && (
                  <div className="mt-4">
                    <Label>Preview Recording</Label>
                    <div className="flex items-center justify-center bg-muted p-4 rounded-md">
                      <audio src={URL.createObjectURL(audioBlob)} controls className="w-full" />
                    </div>
                    <Button className="w-full mt-4" onClick={processAudio} disabled={isProcessing}>
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-4 w-4" />
                          Process Recording
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Transcription & Form</CardTitle>
                <CardDescription>Your speech will be transcribed and used to auto-fill the legal form.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {transcript ? (
                  <>
                    <div>
                      <Label htmlFor="transcript">Transcription</Label>
                      <Textarea
                        id="transcript"
                        value={transcript}
                        onChange={(e) => setTranscript(e.target.value)}
                        className="h-32"
                      />
                    </div>
                    <LegalForm formData={formData} setFormData={setFormData} />
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <p className="text-muted-foreground mb-2">
                      Record your statement to see the transcription and auto-filled form here.
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Supported languages: English, Hindi, Tamil, Bengali, Telugu, Marathi, Gujarati, and more.
                    </p>
                  </div>
                )}
              </CardContent>
              {transcript && (
                <CardFooter>
                  <Button className="w-full" asChild>
                    <a href="/submit">Continue to Form Submission</a>
                  </Button>
                </CardFooter>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
