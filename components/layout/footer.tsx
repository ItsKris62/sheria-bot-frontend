import Link from "next/link"
import Image from "next/image"
import { Github, Twitter, Linkedin } from "lucide-react"
import { LOGOS } from "@/lib/constants/logos"

const footerLinks = {
  product: [
    { name: "Features", href: "/#features" },
    { name: "Pricing", href: "/pricing" },
    { name: "Knowledge Base", href: "/knowledge-base" },
    { name: "API Documentation", href: "/docs" },
  ],
  solutions: [
    { name: "For Regulators", href: "/solutions/regulators" },
    { name: "For Startups", href: "/solutions/startups" },
    { name: "For Enterprise", href: "/solutions/enterprise" },
  ],
  company: [
    { name: "About", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Careers", href: "/careers" },
    { name: "Contact", href: "/contact" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Data Protection", href: "/data-protection" },
    { name: "Security", href: "/security" },
  ],
}

const socialLinks = [
  { name: "Twitter", href: "#", icon: Twitter },
  { name: "LinkedIn", href: "#", icon: Linkedin },
  { name: "GitHub", href: "#", icon: Github },
]

export function Footer() {
  return (
    <footer className="relative border-t border-border/50 bg-background">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-primary/[0.05] pointer-events-none" />
      
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="group inline-flex items-center transition-all duration-300 hover:scale-105 hover:opacity-90">
              <Image
                src={LOGOS.footer}
                alt="SheriaBot"
                width={160}
                height={48}
                className="h-12 w-auto object-contain"
              />
            </Link>
            <p className="mt-6 text-sm text-muted-foreground leading-relaxed max-w-xs">
              AI-powered regulatory intelligence for Kenya&apos;s fintech sector. Navigate compliance with confidence.
            </p>
            
            {/* Social Links */}
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="group flex h-10 w-10 items-center justify-center rounded-xl border border-border/50 bg-card/50 text-muted-foreground transition-all duration-300 hover:border-primary/50 hover:bg-primary/10 hover:text-primary hover:scale-110"
                >
                  <social.icon className="h-4 w-4" />
                  <span className="sr-only">{social.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-primary">Product</h3>
            <ul className="mt-5 space-y-3.5">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="group inline-flex items-center text-sm text-muted-foreground transition-all duration-300 hover:text-foreground"
                  >
                    <span className="w-0 h-[1px] bg-primary mr-0 group-hover:w-2 group-hover:mr-2 transition-all duration-300" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-primary">Solutions</h3>
            <ul className="mt-5 space-y-3.5">
              {footerLinks.solutions.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="group inline-flex items-center text-sm text-muted-foreground transition-all duration-300 hover:text-foreground"
                  >
                    <span className="w-0 h-[1px] bg-primary mr-0 group-hover:w-2 group-hover:mr-2 transition-all duration-300" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-primary">Company</h3>
            <ul className="mt-5 space-y-3.5">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="group inline-flex items-center text-sm text-muted-foreground transition-all duration-300 hover:text-foreground"
                  >
                    <span className="w-0 h-[1px] bg-primary mr-0 group-hover:w-2 group-hover:mr-2 transition-all duration-300" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-primary">Legal</h3>
            <ul className="mt-5 space-y-3.5">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="group inline-flex items-center text-sm text-muted-foreground transition-all duration-300 hover:text-foreground"
                  >
                    <span className="w-0 h-[1px] bg-primary mr-0 group-hover:w-2 group-hover:mr-2 transition-all duration-300" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* IntaSend Trust Badge */}
        <div className="mt-16 flex flex-col items-center gap-2 border-t border-border/50 pt-10">
          <Link href="https://intasend.com/security" target="_blank" rel="noopener noreferrer">
            <Image
              src="https://intasend-prod-static.s3.amazonaws.com/img/trust-badges/intasend-trust-badge-no-mpesa-hr-dark.png"
              alt="IntaSend Secure Payments (PCI-DSS Compliant)"
              width={220}
              height={66}
              className="h-auto w-[220px] object-contain opacity-80 hover:opacity-100 transition-opacity duration-300"
            />
          </Link>
          <Link
            href="https://intasend.com/security"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors duration-300"
          >
            Secured by IntaSend Payments
          </Link>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-6 border-t border-border/50 pt-8 md:flex-row">
          <div className="flex flex-col items-center gap-2 md:items-start">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} SheriaBot. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground/70">
              Nairobi, Kenya
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-lg shadow-primary/50" />
            <p className="text-xs text-muted-foreground">
              Built for Kenya&apos;s digital economy
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
