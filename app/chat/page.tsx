"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Send, FileText, Loader2, ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import ChatMessage from "@/components/chat-message"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("general")
  const [documentSummary, setDocumentSummary] = useState<string | null>(null)
  const [isLoadingDocument, setIsLoadingDocument] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const documentId = searchParams.get("documentId")

  // Initial greeting message
  useEffect(() => {
    setMessages([
      {
        id: "1",
        role: "assistant",
        content:
          "नमस्ते! मैं आपका कानूनी सहायक हूँ। आप मुझसे किसी भी कानूनी मुद्दे पर सवाल पूछ सकते हैं। How can I assist you with your legal query today?",
        timestamp: new Date(),
      },
    ])
  }, [])

  // Fetch document summary if documentId is provided
  useEffect(() => {
    if (documentId) {
      fetchDocumentSummary(documentId)
    }
  }, [documentId])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const fetchDocumentSummary = async (id: string) => {
    setIsLoadingDocument(true)
    try {
      // In a real implementation, you would fetch the document summary from your API
      // For now, we'll simulate a response after a delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setDocumentSummary(
        "This legal document pertains to a property dispute in Delhi between Rajesh Kumar and his neighbor. The dispute involves noise complaints during night hours, which have been ongoing for several months despite multiple attempts at resolution. The document outlines the specific instances of disturbance and the impact on the complainant's quality of life.",
      )

      // Add a message about the document
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content:
            "I see you've uploaded a document about a property dispute involving noise complaints. How can I help you with this specific issue?",
          timestamp: new Date(),
        },
      ])
    } catch (error) {
      console.error("Error fetching document summary:", error)
      toast({
        variant: "destructive",
        title: "Failed to load document",
        description: "There was an error loading your document. Please try again.",
      })
    } finally {
      setIsLoadingDocument(false)
    }
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Prepare context for the AI
      let context = `You are a legal assistant for NyayVaani, an AI-powered multilingual legal assistance platform for Indian citizens. 
      The user has selected the category: ${selectedCategory}.`

      if (documentSummary) {
        context += `\n\nThe user has uploaded a document with the following summary: ${documentSummary}`
      }

      // Get previous conversation for context (last 5 messages)
      const conversationHistory = messages
        .slice(-5)
        .map((msg) => `${msg.role}: ${msg.content}`)
        .join("\n")

      // Generate response using AI SDK
      const { text } = await generateText({
        model: openai("gpt-4o"),
        system: context,
        prompt: `${conversationHistory}\nuser: ${input}\nassistant:`,
      })

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: text,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error generating response:", error)
      toast({
        variant: "destructive",
        title: "Failed to generate response",
        description: "There was an error generating a response. Please try again.",
      })

      // Add a fallback message
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "I'm sorry, I'm having trouble generating a response right now. Please try again in a moment.",
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-bold mb-6">Legal Chatbot</h1>
          <p className="text-muted-foreground mb-8">
            Get AI-powered legal guidance and answers to your questions. Our chatbot can help explain legal procedures,
            suggest appropriate legal categories, and provide step-by-step guidance.
          </p>
        </motion.div>

        <Tabs defaultValue="chat" className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="document" disabled={!documentSummary && !isLoadingDocument}>
              Document
            </TabsTrigger>
          </TabsList>
          <TabsContent value="chat">
            <Card>
              <CardHeader>
                <CardTitle>Legal Assistant</CardTitle>
                <CardDescription>Ask questions about legal procedures, rights, and next steps.</CardDescription>
                <div className="mt-2">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select legal category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Legal Advice</SelectItem>
                      <SelectItem value="property">Property Disputes</SelectItem>
                      <SelectItem value="family">Family Law</SelectItem>
                      <SelectItem value="consumer">Consumer Rights</SelectItem>
                      <SelectItem value="criminal">Criminal Law</SelectItem>
                      <SelectItem value="employment">Employment Law</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] overflow-y-auto border rounded-lg p-4 mb-4">
                  <AnimatePresence>
                    {messages.map((message) => (
                      <ChatMessage key={message.id} message={message} />
                    ))}
                  </AnimatePresence>
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2 text-muted-foreground"
                    >
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Generating response...</span>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your legal question here..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                    disabled={isLoading}
                  />
                  <Button onClick={handleSendMessage} disabled={isLoading || !input.trim()}>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="text-xs text-muted-foreground">
                  This AI assistant provides general legal information, not legal advice.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/submit">
                    Fill Legal Form
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="document">
            <Card>
              <CardHeader>
                <CardTitle>Document Analysis</CardTitle>
                <CardDescription>AI analysis of your uploaded legal document.</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingDocument ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                    <p>Loading document analysis...</p>
                  </div>
                ) : documentSummary ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Document Summary</h3>
                      <div className="bg-muted p-4 rounded-lg">
                        <p className="whitespace-pre-line">{documentSummary}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">Legal Analysis</h3>
                      <div className="bg-muted p-4 rounded-lg">
                        <p>
                          This appears to be a noise complaint case. In India, noise pollution is regulated under the
                          Noise Pollution (Regulation and Control) Rules, 2000. The complainant may seek remedies
                          through:
                        </p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          <li>Filing a complaint with the local police</li>
                          <li>Approaching the Resident Welfare Association</li>
                          <li>Filing a civil suit for nuisance</li>
                          <li>Complaining to the Pollution Control Board</li>
                        </ul>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">Recommended Actions</h3>
                      <div className="bg-muted p-4 rounded-lg">
                        <ol className="list-decimal list-inside space-y-1">
                          <li>Document instances of noise with date, time, and duration</li>
                          <li>Record audio evidence if possible</li>
                          <li>Send a formal written complaint to the neighbor</li>
                          <li>File a police complaint if the issue persists</li>
                          <li>Consider mediation before pursuing legal action</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-2">No document uploaded yet.</p>
                    <Button asChild>
                      <Link href="/upload">
                        Upload Document
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
