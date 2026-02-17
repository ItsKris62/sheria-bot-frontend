import Link from "next/link"
import { Scale, Github, Twitter, Linkedin } from "lucide-react"

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
            <Link href="/" className="group inline-flex items-center gap-3 transition-all duration-300 hover:scale-105">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/30 transition-all duration-300 group-hover:shadow-primary/50">
                <Scale className="h-5 w-5 text-primary-foreground" />
                <div className="absolute inset-0 rounded-xl bg-primary/50 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-foreground tracking-tight">SheriaBot</span>
                <span className="text-[10px] text-primary font-medium -mt-0.5 tracking-wider uppercase">Kenya Fintech</span>
              </div>
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

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-border/50 pt-8 md:flex-row">
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
