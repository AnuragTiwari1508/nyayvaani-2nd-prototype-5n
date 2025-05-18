"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, MessageSquare, Mic, Upload } from "lucide-react"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <section className="py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  <span className="text-primary">न्याय वाणी</span> - Your Voice in Legal Matters
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  AI-powered multilingual legal assistance platform for Indian citizens. Simplify legal filing using
                  regional speech, AI chatbot, and document summarization.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/voice" passHref>
                  <Button className="gap-1">
                    Get Started <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/chat" passHref>
                  <Button variant="outline" className="gap-1">
                    Chat with Legal AI <MessageSquare className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
            >
              <img
                alt="NyayVaani Platform"
                className="aspect-video object-cover"
                height="310"
                src="/placeholder.svg?height=620&width=1100"
                width="550"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-24 bg-muted/50 rounded-3xl">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Our Services</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Comprehensive legal assistance in your language
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
            <motion.div
              whileHover={{ y: -5 }}
              className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm"
            >
              <div className="rounded-full bg-primary/10 p-4">
                <Mic className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Voice-Based Legal Filing</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                Convert regional speech to text and auto-fill legal forms
              </p>
              <Link href="/voice" passHref>
                <Button variant="link" className="gap-1">
                  Try Now <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ y: -5 }}
              className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm"
            >
              <div className="rounded-full bg-primary/10 p-4">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Document Upload & Summarization</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                Upload legal documents and get summaries in multiple languages
              </p>
              <Link href="/upload" passHref>
                <Button variant="link" className="gap-1">
                  Try Now <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ y: -5 }}
              className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm"
            >
              <div className="rounded-full bg-primary/10 p-4">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Legal Chatbot</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                Get AI guidance on legal procedures and categories
              </p>
              <Link href="/chat" passHref>
                <Button variant="link" className="gap-1">
                  Try Now <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Simple steps to access legal assistance
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex flex-col items-center space-y-4"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white">1</div>
                <h3 className="text-xl font-bold">Record or Upload</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Speak in your language or upload legal documents
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col items-center space-y-4"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white">2</div>
                <h3 className="text-xl font-bold">AI Processing</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Our AI analyzes and processes your information
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col items-center space-y-4"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white">3</div>
                <h3 className="text-xl font-bold">Get Assistance</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Receive legal guidance, forms, and next steps
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
