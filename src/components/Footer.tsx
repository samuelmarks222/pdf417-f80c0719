import { useSiteSettings } from "@/contexts/useSiteSettings";

export function Footer() {
  const { settings } = useSiteSettings();

  return (
    <footer className="mt-auto border-t border-border/70 bg-white/70">
      <div className="container flex max-w-7xl flex-col items-center justify-between gap-2 py-5 text-center text-xs text-muted-foreground sm:flex-row sm:text-left">
        <span>{settings.footer_notice} © {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}
