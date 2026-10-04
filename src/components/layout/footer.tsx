import Link from "next/link";
import { Crown, Mail, Phone, MapPin } from "lucide-react";
import { siteConfig } from "@/content/site.config";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-card/50 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Crown className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-lg font-bold tracking-tight text-foreground">
                  The Grand Sovereign
                </span>
                <span className="text-[10px] font-medium tracking-widest text-muted-foreground uppercase">
                  Hotel & Suites
                </span>
              </div>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {siteConfig.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
              Explore
            </h3>
            <ul className="space-y-2.5 text-xs">
              {siteConfig.nav.main.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-muted-foreground hover:text-primary transition-colors">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Guest Services / Legal Links */}
          <div>
            <h3 className="font-serif text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
              Guest Support & Legal
            </h3>
            <ul className="space-y-2.5 text-xs">
              {siteConfig.nav.footer.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-muted-foreground hover:text-primary transition-colors">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h3 className="font-serif text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
              Contact & Location
            </h3>
            <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0 text-primary mt-0.5" />
              <span>
                {siteConfig.address.street}, {siteConfig.address.city}, {siteConfig.address.state} {siteConfig.address.zip}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Phone className="h-4 w-4 shrink-0 text-primary" />
              <span>{siteConfig.contact.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Mail className="h-4 w-4 shrink-0 text-primary" />
              <span>{siteConfig.contact.email}</span>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border/30 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
          <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          <p className="font-mono text-[11px]">Designed for Ultimate Luxury & Experience</p>
        </div>
      </div>
    </footer>
  );
}
