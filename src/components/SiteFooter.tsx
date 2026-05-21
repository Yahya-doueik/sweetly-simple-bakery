import { useEffect, useState } from "react";
import { subscribeSiteSettings } from "@/lib/firebase-store";
import { DEFAULT_SITE_SETTINGS } from "@/lib/store-data";

function getDigits(value: string) {
  return value.replace(/\D/g, "");
}

export function SiteFooter() {
  const [settings, setSettings] = useState(DEFAULT_SITE_SETTINGS);

  useEffect(() => {
    const unsub = subscribeSiteSettings(setSettings);
    return () => unsub();
  }, []);

  return (
    <footer className="mt-24 border-t border-border/60 bg-secondary/40">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 md:grid-cols-2">
        <div>
          <p className="font-display text-xl text-foreground">{settings.brandName}</p>
          <p className="mt-2 text-sm text-muted-foreground">{settings.footer.tagline}</p>
        </div>
        <div className="text-sm text-muted-foreground">
          <p className="mb-2 font-medium text-foreground">{settings.footer.contactHeading}</p>
          <p>{settings.supportEmail}</p>
          <p>
            {settings.defaultWhatsAppNumber ||
              settings.whatsappNumbers[0] ||
              getDigits("96170914486")}
          </p>
        </div>
      </div>
      <div className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {settings.brandName}. {settings.footer.copyrightNote}
      </div>
    </footer>
  );
}
