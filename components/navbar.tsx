"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Menu, X, Mic, Upload, MessageSquare, FileText, Clock, Shield } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">NyayVaani</span>
        </Link>
        <nav className="hidden md:flex gap-6 items-center">
          <Link href="/voice" className="text-sm font-medium hover:underline underline-offset-4">
            Voice Filing
          </Link>
          <Link href="/upload" className="text-sm font-medium hover:underline underline-offset-4">
            Document Upload
          </Link>
          <Link href="/chat" className="text-sm font-medium hover:underline underline-offset-4">
            Legal Chatbot
          </Link>
          <Link href="/submit" className="text-sm font-medium hover:underline underline-offset-4">
            Form Submission
          </Link>
          <Link href="/review" className="text-sm font-medium hover:underline underline-offset-4">
            Legal Review
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button variant="outline" size="sm" asChild className="hidden md:flex">
            <Link href="/login">Login</Link>
          </Button>
          <Button size="sm" asChild className="hidden md:flex">
            <Link href="/register">Register</Link>
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="container md:hidden overflow-hidden"
          >
            <div className="grid gap-4 py-4">
              <Link
                href="/voice"
                className="flex items-center gap-2 px-2 py-1 hover:bg-accent rounded-md"
                onClick={() => setIsOpen(false)}
              >
                <Mic className="h-4 w-4" />
                <span>Voice Filing</span>
              </Link>
              <Link
                href="/upload"
                className="flex items-center gap-2 px-2 py-1 hover:bg-accent rounded-md"
                onClick={() => setIsOpen(false)}
              >
                <Upload className="h-4 w-4" />
                <span>Document Upload</span>
              </Link>
              <Link
                href="/chat"
                className="flex items-center gap-2 px-2 py-1 hover:bg-accent rounded-md"
                onClick={() => setIsOpen(false)}
              >
                <MessageSquare className="h-4 w-4" />
                <span>Legal Chatbot</span>
              </Link>
              <Link
                href="/submit"
                className="flex items-center gap-2 px-2 py-1 hover:bg-accent rounded-md"
                onClick={() => setIsOpen(false)}
              >
                <FileText className="h-4 w-4" />
                <span>Form Submission</span>
              </Link>
              <Link
                href="/review"
                className="flex items-center gap-2 px-2 py-1 hover:bg-accent rounded-md"
                onClick={() => setIsOpen(false)}
              >
                <Clock className="h-4 w-4" />
                <span>Legal Review</span>
              </Link>
              <div className="flex flex-col gap-2 pt-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    Login
                  </Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/register" onClick={() => setIsOpen(false)}>
                    Register
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
