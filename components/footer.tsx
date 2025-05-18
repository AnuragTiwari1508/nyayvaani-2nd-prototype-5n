import Link from "next/link"
import { Shield } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between md:py-12">
        <div className="flex flex-col gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">NyayVaani</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            AI-powered multilingual legal assistance platform for Indian citizens
          </p>
        </div>
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium">Services</h3>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              <li>
                <Link href="/voice" className="hover:underline">
                  Voice Filing
                </Link>
              </li>
              <li>
                <Link href="/upload" className="hover:underline">
                  Document Upload
                </Link>
              </li>
              <li>
                <Link href="/chat" className="hover:underline">
                  Legal Chatbot
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium">Support</h3>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              <li>
                <Link href="/help" className="hover:underline">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:underline">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:underline">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium">Legal</h3>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              <li>
                <Link href="/terms" className="hover:underline">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:underline">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:underline">
                  Legal Disclaimer
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium">Company</h3>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:underline">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:underline">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:underline">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="container flex flex-col items-center justify-between gap-4 border-t py-6 md:h-16 md:flex-row md:py-0">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} NyayVaani. All rights reserved.
        </p>
        <div className="flex gap-4">
          <Link href="#" className="text-xs text-muted-foreground hover:underline">
            Terms
          </Link>
          <Link href="#" className="text-xs text-muted-foreground hover:underline">
            Privacy
          </Link>
          <Link href="#" className="text-xs text-muted-foreground hover:underline">
            Cookies
          </Link>
        </div>
      </div>
    </footer>
  )
}
